import React from "react";
import {SIDE_MENU_DATA} from "../../utils/data";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({activeMenu}) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "logout"){
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    return (
        <div className="w-64 p-5 sticky z-20 overflow-y-auto" style={{backgroundColor: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)", height: `calc(100vh - var(--navbar-h))`, top: `var(--navbar-h)`, overflowX: "hidden", width: "16rem"}}>
            <div className="flex flex-col items-center justify-center gap-s mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img
                        src={user?.profileImageUrl || ""}
                        alt="Profile Image"
                        className="w-20 h-20 bg-slate-400 rounded-full"
                    />) : (
                        <CharAvatar
                            fullName={user?.fullName || ""}
                            width="w-20"
                            height="h-20"
                            style="text-xl" />
                        )}

                <h5 className="font-medium leading-6">
                    {user?.fullName || ""}
                </h5>
            </div>

            {SIDE_MENU_DATA.map((item, index) => {
                const isActive = activeMenu === item.label;
                return (
                    <button 
                        key={`menu_${index}`}
                        className="w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-colors"
                        style={{
                            backgroundColor: isActive ? "var(--sidebar-item-active)" : "var(--sidebar-item-bg)",
                            color: isActive ? "var(--sidebar-item-active-text)" : "var(--sidebar-text)",
                            border: isActive ? "1px solid transparent" : "1px solid var(--sidebar-border)"
                        }}
                        onMouseEnter={(e)=>{ if(!isActive) e.currentTarget.style.backgroundColor = "var(--sidebar-item-hover)"; }}
                        onMouseLeave={(e)=>{ if(!isActive) e.currentTarget.style.backgroundColor = "var(--sidebar-item-bg)"; }}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className="text-xl" style={{ color: "currentColor" }} />
                        {item.label}
                    </button>
                );
            })}
        </div>);
};

export default SideMenu;