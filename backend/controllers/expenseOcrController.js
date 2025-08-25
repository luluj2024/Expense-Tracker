// backend/controllers/expenseOcrController.js
const fs = require('fs');
const axios = require('axios');

const AZURE_DI_ENDPOINT = process.env.AZURE_DI_ENDPOINT; // 例如: https://xxx.cognitiveservices.azure.com
const AZURE_DI_KEY = process.env.AZURE_DI_KEY;
const TIMEOUT = Number(process.env.AZURE_DI_TIMEOUT_MS || 20000);

// 简单的启发式分类关键词，可按需扩充/改为数据库持久化
const CATEGORY_KEYWORDS = {
  Food: ['restaurant','cafe','coffee','burger','pizza','kfc','mcdonald','starbucks','dunkin','food','meal'],
  Groceries: ['market','grocery','supermarket','walmart','costco','carrefour','aldi','lidl','tesco'],
  Transport: ['uber','lyft','taxi','metro','subway','bus','train','fuel','gas','shell','bp','parking'],
  Shopping: ['store','mall','amazon','target','best buy','decathlon','ikea','apparel','clothes'],
  Entertainment: ['cinema','movie','theater','netflix','spotify','amusement'],
  Utilities: ['electric','water','gas','internet','telecom','verizon','att','vodafone'],
};

function guessCategory({ merchantName = '', itemsText = '' }) {
  const text = `${merchantName} ${itemsText}`.toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some(k => text.includes(k))) return cat;
  }
  return 'Other';
}

// 兼容不同返回形态安全地取字符串
function safeStr(v) {
  if (v == null) return '';
  return typeof v === 'string' ? v : String(v);
}

exports.analyzeReceiptController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No receipt file uploaded' });
    if (!AZURE_DI_ENDPOINT || !AZURE_DI_KEY) {
      return res.status(500).json({ message: 'Azure Document Intelligence env not configured' });
    }

    // 调用预置收据模型
    const analyzeUrl =
      `${AZURE_DI_ENDPOINT}/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31`;

    const fileBuffer = fs.readFileSync(req.file.path);

    // 1) 提交分析
    const analyzeResp = await axios.post(analyzeUrl, fileBuffer, {
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_DI_KEY,
        'Content-Type': 'application/octet-stream',
      },
      maxBodyLength: Infinity,
      timeout: TIMEOUT,
      validateStatus: () => true,
    });

    if (analyzeResp.status !== 202) {
        console.error('[Azure Analyze error]', analyzeResp.status, analyzeResp.data);
        return res.status(502).json({
        message: 'Analyze request failed',
        status: analyzeResp.status,
        detail: analyzeResp.data,
    });
    }

    // 2) 轮询结果
    const opLocation = analyzeResp.headers['operation-location'];
    if (!opLocation) return res.status(502).json({ message: 'Missing operation-location header' });

    const start = Date.now();
    let result;
    while (Date.now() - start < TIMEOUT) {
      const r = await axios.get(opLocation, {
        headers: { 'Ocp-Apim-Subscription-Key': AZURE_DI_KEY },
        timeout: Math.min(5000, TIMEOUT),
        validateStatus: () => true,
      });
      if (r.status !== 200) break;
      const status = r.data.status;
      if (status === 'succeeded') { result = r.data; break; }
      if (status === 'failed') {
        return res.status(502).json({ message: 'Analysis failed', detail: r.data });
      }
      await new Promise(rs => setTimeout(rs, 800));
    }
    if (!result) return res.status(504).json({ message: 'Analyze polling timeout' });

    // 3) 解析字段（稳健取值）
    const doc = result?.analyzeResult?.documents?.[0] || {};
    const fields = doc.fields || {};

    // 商户名
    const merchantName =
      fields.MerchantName?.valueString ??
      fields.MerchantName?.content ??
      '';

    // 日期（可能是 valueDate 或 content）
    const rawDate =
      fields.TransactionDate?.valueDate ??
      fields.TransactionDate?.content ??
      null;

    // 金额（安全处理：优先 number；否则尝试从字符串提取）
    let total = null;
    if (typeof fields.Total?.valueNumber === 'number') {
      total = fields.Total.valueNumber;
    } else if (typeof fields.Total?.content === 'string') {
      const n = Number(fields.Total.content.replace(/[^\d.]/g, ''));
      total = Number.isNaN(n) ? null : n;
    }

    // Items 里拼接描述，帮助猜分类
    const itemsNode = fields.Items?.values || fields.Items?.valueArray || [];
    const itemsText = itemsNode
      .map(it => {
        const p = it?.properties || it; // 有的版本是 properties，有的是直接字段
        const desc = p?.Description?.valueString ?? p?.Description?.content ?? '';
        return safeStr(desc);
      })
      .filter(Boolean)
      .join(' ');

    const suggestedCategory = guessCategory({ merchantName, itemsText });

    // 4) 返回给前端用于表单回填
    res.json({
      merchantName: safeStr(merchantName),
      date: rawDate ? safeStr(rawDate) : null, // 前端可再格式化为 YYYY-MM-DD
      amount: total,
      suggestedCategory,
      // 开发期可保留 raw，生产可删除
      raw: result,
    });
  } catch (err) {
    console.error('[analyzeReceiptController] error:', err);
    res.status(500).json({
      message: 'Server error during OCR',
      error: err.message,
      code: err.code,
      responseStatus: err.response?.status,
      responseData: err.response?.data,
    });
  } finally {
    // 清理临时上传文件
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
  }
};
