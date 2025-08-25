import React from "react";
import {
    BarChart,
    Bar, 
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const CustomBarChart = ({data}) => {

    // to alternate color
    const getBarColor = (index) => {
        return index % 2 === 0 ? "#875cf5" : "#cfbefb";
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length){
            return (
                <div style={{backgroundColor: "var(--tooltip-bg)", color: "var(--tooltip-text)", boxShadow: "var(--shadow-md)", borderRadius: "var(--radius-md)", padding: "12px", border: "1px solid var(--border-default)"}}>
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
    };

    return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />

                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--chart-axis)"}} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "var(--chart-axis)"}} stroke="none" />

                    <Tooltip content={CustomTooltip} />

                    <Bar
                        dataKey="amount"
                        fill="#FF8042"
                        radius={[10,10,0,0]}
                        activeDot={{ r:8, fill: "yellow"}}
                        activeStyle={{ fill: "green"}}
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getBarColor(index)} />
                        ))}
                    </Bar>

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;