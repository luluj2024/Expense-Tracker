import React from "react";
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from "react-icons/lu";

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete}) => {
    const getAmountStyle = () => 
        type === "income" ? "badge badge--pos" : "badge badge--neg";


    return <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
        <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
            {icon ? (
                <img src={icon} alt={title} className="w-6 h-6" />
            ) : (
                <LuUtensils />
            )}
        </div>

        <div className="flex-1 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium" style={{color: "var(--text-primary)"}}>{title}</p>
                <p className="text-xs my-1" style={{color: "var(--text-secondary)"}}>{date}</p>
            </div>

            <div className="flex items-center gap-2">
                {!hideDeleteBtn && (
                    <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={onDelete}>
                        <LuTrash2 size={18} />
                    </button>
                )}

                <div className={`flex items-center gap-2 ${getAmountStyle()}`}>
                    <h6 className="text-xs font-medium">
                        {type === "income" ? "+" : "-"} ${amount}
                    </h6>
                    {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
                </div>
            </div>
        </div>
    </div>;
};

export default TransactionInfoCard;