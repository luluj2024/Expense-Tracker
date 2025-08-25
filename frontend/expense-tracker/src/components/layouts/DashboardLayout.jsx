import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({children, activeMenu}) =>{
    const user = useContext(UserContext);

    return (
        <div className="u-bg-default min-h-screen">
            <Navbar activeMenu={activeMenu} />

            {user &&(
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    <div className="grow">
                        <div className="container my-5">{children}</div>
                    </div>
                </div>

            )}
        </div>
    )
}

export default DashboardLayout;