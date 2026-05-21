import Sidebar from "./Sidebar.jsx";
import TopNavbar from "./TopNavbar.jsx";

export default function MainLayout({ children }) {
    return (
        <div className="d-flex">
            <Sidebar /> {/* render duy nhất */}
            <div className="main flex-grow-1">
                <TopNavbar />
                <div className="main-content p-4">
                    {children} {/* page content */}
                </div>
            </div>
        </div>
    );
}