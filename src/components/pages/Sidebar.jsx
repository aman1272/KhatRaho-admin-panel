import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import WithBootstrap from '../WithBootstrap';
import Headers from "./Headers";

const Sidebar = ({ children, name }) => {
    const [toggle, setToggle] = useState({ theme: "light", activeTab: "Dashboard" })
    const [showComponent, setShowComponent] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, []);

    const sidebar = [{ name: "Dashboard", className: "mdi mdi-grid-large menu-icon", path: "/dashboard", },
    // { name: "POS", className: "mdi mdi-monitor-dashboard menu-icon vsalign", path: "/pos", },
    // { name: "Live Orders", className: "mdi mdi-speedometer-medium menu-icon", path: "", },
    { name: "Users", className: "menu-icon mdi mdi-account-group", path: "/users", },
    { name: "Staffs", className: "menu-icon mdi mdi-account", path: "/staffs", },
    { name: "Fooders", className: "menu-icon mdi mdi-airballoon", path: "/fooders", },
    { name: "Orders", className: "menu-icon mdi mdi-cart", path: "/orders", },
    { name: "Support Tickets", className: "menu-icon mdi mdi-card-text-outline", path: "/support-tickets", },
    { name: "Menus", className: "menu-icon mdi mdi-floor-plan", path: "/menus", },
    { name: "Products", className: "menu-icon mdi mdi-silverware-fork-knife", path: "/products", },
    // { name: "Documents", className: "menu-icon mdi mdi-folder", path: "", },
    // { name: "Customers", className: "menu-icon mdi mdi-account-group", path: "/customers", },
    { name: "Profile", className: "menu-icon mdi mdi-account-circle-outline", path: "/profile", },
    { name: "Logout", className: "menu-icon mdi mdi-logout", path: "", },]


    const manageSidebar = (item) => {
        if (item.name == "Logout") { window.sessionStorage.clear(); navigate('/') }
        else {
            window.sessionStorage.removeItem("fooder_id")
            window.sessionStorage.removeItem("productId")
            window.sessionStorage.removeItem('menuId')
            setToggle({ ...toggle, activeTab: `${item.name}` })
        }
    }

    return (
        <>
            {
                showComponent ?

                    <div className="container-scroller" >
                        <Headers />
                        <div className="container-fluid page-body-wrapper px-0">
                            <nav className="sidebar sidebar-offcanvas sidebar-dark" id="sidebar">
                                <ul className="nav">
                                    {
                                        sidebar.map((item, i) => {
                                            return (
                                                <li className={(name == item.name) ? "nav-item active" : "nav-item"} key={i}
                                                    onClick={() => manageSidebar(item)}>
                                                    <Link className="nav-link" to={item.path}>
                                                        <i className={item.className}></i>
                                                        <span className="menu-title">{item.name}</span>
                                                    </Link>
                                                </li>
                                            )

                                        })
                                    }
                                </ul>
                            </nav>
                            <main className="main-panel" >{children}</main>
                        </div>
                    </div>
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>}
        </>
    )
}
export default WithBootstrap(Sidebar)