import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
    return <div className="flex gap-6 p-6 rounded-2xl border" style={{backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-default)", boxShadow: "var(--shadow-sm)"}}>
        <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
            {icon}
        </div>
        <div>
            <h6 className="text-sm mb-1" style={{color: "var(--text-secondary)"}}>{label}</h6>
            <span className="text-[22px]" style={{color: "var(--text-primary)"}}>${value}</span>
        </div>
    </div>;
}

export default InfoCard;