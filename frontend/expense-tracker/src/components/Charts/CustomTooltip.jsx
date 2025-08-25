import React from "react";

const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
        return (
            <div style={{backgroundColor: "var(--tooltip-bg)", color: "var(--tooltip-text)", boxShadow: "var(--shadow-md)", borderRadius: "var(--radius-md)", padding: "8px", border: "1px solid var(--border-default)"}}>
                <p style={{fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "var(--tooltip-text)"}}>
                    {payload[0].name}
                </p>
                
                <p style={{fontSize: "14px", color: "var(--text-secondary)"}}>
                    Amount: {" "}
                    <span style={{fontSize: "14px", fontWeight: "500", color: "var(--text-primary)"}}>
                        ${payload[0].value}
                    </span>
                </p>
            </div>
        );
    }

    return null;
}

export default CustomTooltip;