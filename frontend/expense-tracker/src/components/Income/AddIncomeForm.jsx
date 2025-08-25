import React, { useState } from "react";
import Input from "../Inputs/Input"
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({onAddIncome}) =>{
    const [income, setIncome] = useState({
        source:"",
        amount:"",
        date:"",
        icon:"",
    });

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    return (
        <div className="form">
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <div className="form-field">
                <Input
                    value={income.source}
                    onChange={( { target }) => handleChange("source", target.value)}
                    label="Income Source"
                    placeholder="Freelance, Salary, etc"
                    type="text"
                />
            </div>

            <div className="form-field">
                <Input
                    value={income.amount}
                    onChange={( { target }) => handleChange("amount", target.value)}
                    label="Amount"
                    placeholder=""
                    type="number"
                />
            </div>

            <div className="form-field">
                <Input
                    value={income.date}
                    onChange={( { target }) => handleChange("date", target.value)}
                    label="Date"
                    placeholder=""
                    type="date"
                />
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={()=>onAddIncome(income)}
                >
                    Add Income
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm;