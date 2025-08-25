import React from "react";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Area,
    AreaChart,
} from "recharts";


const CustomLineChart = ({data}) => {

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{backgroundColor: "var(--tooltip-bg)", color: "var(--tooltip-text)", boxShadow: "var(--shadow-md)", borderRadius: "var(--radius-md)", padding: "8px", border: "1px solid var(--border-default)"}}>
                    <p style={{fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "var(--tooltip-text)"}}>
                        {payload[0].payload.category}
                    </p>
                    <p style={{fontSize: "14px", color: "var(--text-secondary)"}}>
                        Amount: <span style={{fontSize: "14px", fontWeight: "500", color: "var(--text-primary)"}}>
                            ${payload[0].payload.amount}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    }

        return (
            <div className="bg-white">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="none" />
    
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--chart-axis)"}} stroke="none" />
                        <YAxis tick={{ fontSize: 12, fill: "var(--chart-axis)"}} stroke="none" />
    
                        <Tooltip content={<CustomTooltip />} />

                        <Area type="monotone" dataKey="amount" stroke="#875cf5" fill="url(#incomeGradient)" strokeWidth={3} dot={{ r:3, fill:"#ab8df8"}} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
}

export default CustomLineChart;