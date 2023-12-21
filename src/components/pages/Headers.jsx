import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import WithBootstrap from '../WithBootstrap';


const Headers = () => {
    const navigate = useNavigate();

    const [toggle, setToggle] = useState({ theme: "light", activeTab: "Dashboard" })
    const [header, setHeader] = useState({ message: false, notification: false, profile: false })

    const name = window.sessionStorage.getItem('name')
    const email = window.sessionStorage.getItem('email')

    const manageToggle = (props) => {
        setToggle(props)
    }

    const signOut = () => {
        window.sessionStorage.clear()
        navigate('/')
    }


    return (
        <>
            <nav className={`navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row ${toggle.headTheme}`}>
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
                    <div className="me-3">
                        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-bs-toggle="minimize" >
                            <span className="icon-menu" onClick={() => { toggle.closeSidebar ? manageToggle({ ...toggle, closeSidebar: false }) : manageToggle({ ...toggle, closeSidebar: true }) }} ></span>
                        </button>
                    </div>
                    <div>
                        <Link className="navbar-brand brand-logo" to="/dashboard">
                            <img src="images/Khateraho 2023 logo Black.png" alt="KhateRaho" />
                        </Link>
                        <a className="navbar-brand brand-logo-mini" href="/">
                            <img src="images/logo-mini.svg" alt="logo" />
                        </a>
                    </div>
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-top">
                    <ul className="navbar-nav">
                        <li className="nav-item font-weight-semibold d-none d-lg-block ms-0">
                            <h1 className="welcome-text">Hello, <span className="text-black fw-bold">{name}</span></h1>
                            {/* <h3 className="welcome-sub-text">Your performance summary this week </h3> */}
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <Link className="nav-item " to='/pos' >
                            <span class="btn btn-success posbtn d-flex justify-content-center "><i class="mdi mdi-monitor-dashboard menu-icon vsalign"></i> POS</span>
                        </Link>
                        <li className="nav-item">
                            <form className="search-form" action="#">
                                <i className="icon-search"></i>
                                <input type="search" className="form-control" placeholder="Search Here" title="Search here" />
                            </form>
                        </li>
                        <li className="nav-item dropdown" onClick={() => { header.message ? setHeader({ message: false }) : setHeader({ message: true }) }} >
                            <a className={header.message ? "nav-link count-indicator show" : "nav-link count-indicator"} id="countDropdown" href="#" data-bs-toggle="dropdown"
                                aria-expanded={header.message ? "true" : "false"}>
                                <i className="icon-mail icon-lg"></i>
                            </a>
                            <div className={header.message ? "dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0 show" : "dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0 "}
                                aria-labelledby="notificationDropdown">
                                <a className="dropdown-item py-3 border-bottom">
                                    <p className="mb-0 font-weight-medium float-left">You have 4 new notifications </p>
                                    <span className="badge badge-pill badge-primary float-right">View all</span>
                                </a>
                                <a className="dropdown-item preview-item py-3">
                                    <div className="preview-thumbnail">
                                        <i className="mdi mdi-alert m-auto text-primary"></i>
                                    </div>
                                    <div className="preview-item-content">
                                        <h6 className="preview-subject fw-normal text-dark mb-1">Application Error</h6>
                                        <p className="fw-light small-text mb-0"> Just now </p>
                                    </div>
                                </a>
                                <a className="dropdown-item preview-item py-3">
                                    <div className="preview-thumbnail">
                                        <i className="mdi mdi-settings m-auto text-primary"></i>
                                    </div>
                                    <div className="preview-item-content">
                                        <h6 className="preview-subject fw-normal text-dark mb-1">Settings</h6>
                                        <p className="fw-light small-text mb-0"> Private message </p>
                                    </div>
                                </a>
                                <a className="dropdown-item preview-item py-3">
                                    <div className="preview-thumbnail">
                                        <i className="mdi mdi-airballoon m-auto text-primary"></i>
                                    </div>
                                    <div className="preview-item-content">
                                        <h6 className="preview-subject fw-normal text-dark mb-1">New user registration</h6>
                                        <p className="fw-light small-text mb-0"> 2 days ago </p>
                                    </div>
                                </a>
                            </div>
                        </li>
                        <li className="nav-item dropdown" onClick={() => { header.bell ? setHeader({ bell: false }) : setHeader({ bell: true }) }} >
                            <a className={header.bell ? "nav-link count-indicator show" : "nav-link count-indicator"} id="countDropdown" href="#" data-bs-toggle="dropdown"
                                aria-expanded={header.bell ? "true" : "false"}>
                                <i className="icon-bell"></i>
                                <span className="count"></span>
                            </a>
                            <div className={header.bell ? "dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0 show" : "dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"}
                                aria-labelledby="countDropdown">
                                <a className="dropdown-item py-3">
                                    <p className="mb-0 font-weight-medium float-left">You have 7 unread mails </p>
                                    <span className="badge badge-pill badge-primary float-right">View all</span>
                                </a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item preview-item">
                                    <div className="preview-thumbnail">
                                        <img src="https://khateraho.baatcheet.online/images/faces/face8.jpg" alt="image" className="img-sm profile-pic" />
                                    </div>
                                    <div className="preview-item-content flex-grow py-2">
                                        <p className="preview-subject ellipsis font-weight-medium text-dark">Marian Garner </p>
                                        <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                                    </div>
                                </a>
                                <a className="dropdown-item preview-item">
                                    <div className="preview-thumbnail">
                                        <img src="https://khateraho.baatcheet.online/images/faces/face8.jpg" alt="image" className="img-sm profile-pic" />
                                    </div>
                                    <div className="preview-item-content flex-grow py-2">
                                        <p className="preview-subject ellipsis font-weight-medium text-dark">David Grey </p>
                                        <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                                    </div>
                                </a>
                                <a className="dropdown-item preview-item">
                                    <div className="preview-thumbnail">
                                        <img src="https://khateraho.baatcheet.online/images/faces/face8.jpg" alt="image" className="img-sm profile-pic" />
                                    </div>
                                    <div className="preview-item-content flex-grow py-2">
                                        <p className="preview-subject ellipsis font-weight-medium text-dark">Travis Jenkins </p>
                                        <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                                    </div>
                                </a>
                            </div>
                        </li>
                        <li className="nav-item dropdown d-none d-lg-block user-dropdown w-100" onClick={() => { header.profile ? setHeader({ profile: false }) : setHeader({ profile: true }) }} >
                            <a className={header.profile ? "nav-link show" : "nav-link "} id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded={header.profle ? "true" : "false"}>
                                <img className="img-xs rounded-circle" src="https://khateraho.baatcheet.online/images/faces/face8.jpg" alt="Profile image" /> </a>
                            <div className={header.profile ? "dropdown-menu dropdown-menu-right navbar-dropdown show" : "dropdown-menu dropdown-menu-right navbar-dropdown"} aria-labelledby="UserDropdown">
                                <div className="dropdown-header text-center">
                                    <img className="img-md rounded-circle" src="https://khateraho.baatcheet.online/images/faces/face8.jpg" alt="Profile image" />
                                    <p className="mb-1 mt-3 font-weight-semibold">{name}</p>
                                    <p className="fw-light text-muted mb-0">{email}</p>
                                </div>
                                <Link className="dropdown-item" to="/profile"><i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i> My
                                    Profile <span className="badge badge-pill badge-danger">1</span></Link>
                                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-message-text-outline text-primary me-2"></i>
                                    Messages</a>
                                <a className="dropdown-item"><i
                                    className="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2"></i> Activity</a>
                                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-help-circle-outline text-primary me-2"></i>
                                    FAQ</a>
                                <a onClick={signOut} className="dropdown-item"><i className="dropdown-item-icon mdi mdi-power text-primary me-2" ></i>Sign Out</a>
                            </div>
                        </li>
                    </ul>
                    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button"
                        data-bs-toggle="offcanvas">
                        <span className="mdi mdi-menu"></span>
                    </button>
                </div>
            </nav>
        </>
    )

}
export default WithBootstrap(Headers)