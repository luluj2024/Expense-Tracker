import React from "react";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import ThemeToggle from "../ThemeToggle";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="flex items-center justify-between gap-5 u-bg-elevated u-border-default backdrop-blur-[2px] py-3 px-6 sticky top-0 z-30" style={{borderBottomWidth:1}}>
            <button
                className="block lg:hidden"
                style={{color: "var(--text-primary)"}}
                onClick={() => {
                    setOpenSideMenu(!openSideMenu);
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl " />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>

            <h2 className="text-lg font-medium">Expense Tracker</h2>

            {openSideMenu && (
                <div className="fixed -ml-4 bg-white" style={{top: `var(--navbar-h)`}}>
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}

            <div className="ml-auto">
                <ThemeToggle />
            </div>
        </div>
    )
}

export default Navbar;