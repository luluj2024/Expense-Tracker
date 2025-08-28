// import React, { useState } from "react";
// import Input from "../Inputs/Input"
// import EmojiPickerPopup from "../EmojiPickerPopup";

// const AddExpenseForm = ({onAddExpense}) =>{
//     const [expense, setExpense] = useState({
//         category:"",
//         amount:"",
//         date:"",
//         icon:"",
//     });

//     const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

//     return (
//         <div className="form">
//             <EmojiPickerPopup
//                 icon={expense.icon}
//                 onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
//             />

//             <div className="form-field">
//                 <Input
//                     value={expense.category}
//                     onChange={( { target }) => handleChange("category", target.value)}
//                     label="Expense Category"
//                     placeholder="Rent, Grocery, etc"
//                     type="text"
//                 />
//             </div>

//             <div className="form-field">
//                 <Input
//                     value={expense.amount}
//                     onChange={( { target }) => handleChange("amount", target.value)}
//                     label="Amount"
//                     placeholder=""
//                     type="number"
//                 />
//             </div>

//             <div className="form-field">
//                 <Input
//                     value={expense.date}
//                     onChange={( { target }) => handleChange("date", target.value)}
//                     label="Date"
//                     placeholder=""
//                     type="date"
//                 />
//             </div>

//             <div className="form-actions">
//                 <button
//                     type="button"
//                     className="add-btn add-btn-fill"
//                     onClick={()=>onAddExpense(expense)}
//                 >
//                     Add Expense
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AddExpenseForm;


import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const [uploading, setUploading] = useState(false);
  const [ocrInfo, setOcrInfo] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (key, value) => setExpense((prev) => ({ ...prev, [key]: value }));

  const toYMD = (s) => {
    if (!s) return "";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s; 
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  };


  const handleReceiptSelect = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setError("");
  setUploading(true);
  setOcrInfo(null);

  try {
    const fd = new FormData();
    fd.append("receipt", file);

    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录：未找到 token");

    const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/expense/receipt/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,    
      },
      body: fd,
    });

    if (!resp.ok) {
      const t = await resp.json().catch(() => ({}));
      throw new Error(t.message || `Analyze failed (${resp.status})`);
    }

    const data = await resp.json();
    setOcrInfo(data);

    const toYMD = (s) => {
      if (!s) return "";
      const d = new Date(s);
      if (Number.isNaN(d.getTime())) return s;
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${d.getFullYear()}-${mm}-${dd}`;
    };

    setExpense((prev) => ({
      ...prev,
      amount: data.amount != null ? String(data.amount) : prev.amount,
      date: data.date ? toYMD(data.date) : prev.date,
      category: prev.category || data.suggestedCategory || prev.category,
    }));
  } catch (err) {
    setError(err.message);
  } finally {
    setUploading(false);
  }
};

  const handleAdd = () => {
    onAddExpense?.(expense);
  };

  return (
    <div className="form">
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      {/* uploading the receipt */}
      <div className="form-field">
        <label className="input-label">Receipt Photo (Only .jpeg .jpg and .png formats are allowed)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleReceiptSelect}

          style={{ width: "100%" }}
        />
        {uploading && <div className="hint">Recognizing…</div>}
        {error && <div className="hint" style={{ color: "#d33" }}>{error}</div>}
        {ocrInfo && (
            <div className="hint" style={{ fontSize: 12, color: "#666" }}>
            Auto-extracted — Merchant: {ocrInfo.merchantName || "—"}, Amount: {ocrInfo.amount ?? "—"},
            Date: {ocrInfo.date || "—"}, Suggested category: {ocrInfo.suggestedCategory || "—"}
            </div>
        )}
      </div>

      <div className="form-field">
        <Input
          value={expense.category}
          onChange={({ target }) => handleChange("category", target.value)}
          label="Expense Category"
          placeholder="Rent, Grocery, etc"
          type="text"
        />
      </div>

      <div className="form-field">
        <Input
          value={expense.amount}
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Amount"
          placeholder=""
          type="number"
        />
      </div>

      <div className="form-field">
        <Input
          value={expense.date}
          onChange={({ target }) => handleChange("date", target.value)}
          label="Date"
          placeholder=""
          type="date"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleAdd}
          disabled={uploading}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
