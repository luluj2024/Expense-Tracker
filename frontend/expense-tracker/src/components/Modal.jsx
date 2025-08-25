import React from "react";

const Modal = ({ children, isOpen, onClose, title}) => {

    if(!isOpen){
        return null;
    }

    return <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content*/}
            <div className="relative rounded-lg shadow-sm" style={{
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-lg)"
            }}>
                {/* Modal header*/}

                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t" style={{borderColor: "var(--border-default)"}}>
                    <h3 className="text-lg font-medium" style={{color: "var(--text-primary)"}}>
                        {title}
                    </h3>

                    <button
                        type="button"
                        className="bg-transparent rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer"
                        style={{color: "var(--text-secondary)"}}
                        onClick={onClose}
                    >
                        <svg
                            className="w-3 h-3"
                            arial-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    
                    </button>
                </div>

                {/* Modal body*/}
                <div className="p-4 md:p-5 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    </div>;
};

export default Modal;