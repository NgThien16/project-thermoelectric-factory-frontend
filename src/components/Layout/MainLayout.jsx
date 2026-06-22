import Sidebar from "./Sidebar.jsx";
import TopNavbar from "./TopNavbar.jsx";
import { useLocation } from "react-router-dom";

export default function MainLayout({ children }) {

    const location = useLocation();

    // Login không dùng layout
    if (location.pathname === "/login") {
        return children;
    }

    return (
        <div className="d-flex">
            <Sidebar />

            <div className="main flex-grow-1">
                <TopNavbar />

                <div className="main-content p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}