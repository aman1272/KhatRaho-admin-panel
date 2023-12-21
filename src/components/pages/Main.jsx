import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import WithBootstrap from '../WithBootstrap';
import axios from 'axios'
import Documents from "./Document";
import EditMenu from "./EditMenu";
import EditProduct from "./EditProduct";
import Dashbord from "./Dashboard";
import Headers from "./Headers";

const Main = () => {
    const currency = ` ₹ `
    const accessToken = window.sessionStorage.getItem("Accesstoken");
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [customers, setCustomers] = useState([])
    const [fooders, setFooders] = useState([])
    const [menu, setMenu] = useState([])
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [orderDetails, setOrdersDetails] = useState([])
    const [alert, setAlert] = useState({})
    const [profileNotif, setProfileNotif] = useState({})
    const [toggle, setToggle] = useState({ theme: "light", activeTab: "Dashboard" })
    const [header, setHeader] = useState({ message: false, notification: false, profile: false })
    const [profile, setProfile] = useState({ name: "", email: "", password: "", confirmPassword: "" })
    const [showComponent, setShowComponent] = useState(false);
    const [perPage, setPerPage] = useState({ Fooders: 10, Menu: 10, Products: 10, Orders: 10, Customers: 10, OrderDetails: 10 })
    const [page, setPage] = useState({ fooder: 0, menu: 0, product: 0, order: 0, customer: 0, document: 0, orderDetail: 0 })
    const [idForData, setIdForData] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [allData, setAllData] = useState([]);
    const [secondScreen, setSecondScreen] = useState({});

    const sidebar = [{ name: "Dashboard", className: "mdi mdi-grid-large menu-icon", path: "", },
    { name: "POS", className: "mdi mdi-monitor-dashboard menu-icon vsalign", path: "/pos", },
    { name: "Live Orders", className: "mdi mdi-speedometer-medium menu-icon", path: "", },
    { name: "Fooders", className: "menu-icon mdi mdi-airballoon", path: "", },
    { name: "Menu", className: "menu-icon mdi mdi-floor-plan", path: "", },
    { name: "Products", className: "menu-icon mdi mdi-silverware-fork-knife", path: "", },
    // { name: "Documents", className: "menu-icon mdi mdi-folder", path: "", },
    { name: "Customers", className: "menu-icon mdi mdi-account-group", path: "", },
    { name: "Orders", className: "menu-icon mdi mdi-cart", path: "", },
    { name: "Profile", className: "menu-icon mdi mdi-account-circle-outline", path: "", },
    { name: "Logout", className: "menu-icon mdi mdi-logout", path: "", },]

    useEffect(() => {
        sessionStorage.removeItem('encryptedId')
        if (!accessToken) {
            navigate('/');
        }
        getUser()
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (toggle.activeTab == "Customers") { getCustomers() }
        else if (toggle.activeTab == "Fooders") { getFooders() }
        else if (toggle.activeTab == "Profile") { getUser() }
        else if (toggle.activeTab == "Menu") { getMenu(idForData) }
        else if (toggle.activeTab == "Products") { getProducts(idForData) }
        else if (toggle.activeTab == "Orders") { getOrder() }
    }, [page]);

    useEffect(() => {
        setPage({ fooder: 0, menu: 0, product: 0, order: 0, customer: 0, document: 0, orderDetail: 0 })
        if (toggle.activeTab == "Customers") { getCustomers() }
        else if (toggle.activeTab == "Fooders") { getFooders() }
        else if (toggle.activeTab == "Profile") { getUser() }
        else if (toggle.activeTab == "Menu") { getMenu(idForData) }
        else if (toggle.activeTab == "Products") { getProducts(idForData) }
        else if (toggle.activeTab == "Orders") { getOrder() }
    }, [perPage]);


    const getUser = async () => {
        setProfile({})
        const userId = window.sessionStorage.getItem('userId')
        try {
            const response = await axios({
                url: "http://localhost:8000/user/detail",
                method: "POST",
                data: { data: userId }
            })
            const { email, name } = response.data[0]
            setProfile({ password: "", confirmPassword: "", email, name })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const updateProfile = async () => {
        const userId = window.sessionStorage.getItem('userId')
        const sendingData = { email: profile.email, name: profile.name, userId }
        const url = "http://localhost:8000/profile/update"
        try {
            const response = await axios({
                url: url,
                method: "POST",
                data: { data: sendingData }
            })
            setProfileNotif({ message: response.data.message, profile: true })
            console.log('res', response.data.message)
            getUser()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updatePassword = async () => {
        const userId = window.sessionStorage.getItem('userId')
        const sendingData = { password: profile.password, userId }
        const url = "http://localhost:8000/password/update"
        try {
            const response = await axios({
                url: url,
                method: "POST",
                data: { data: sendingData }
            })
            console.log('res', response.data.message)
            setProfile({ ...profile, password: "", confirmPassword: "" })
            setProfileNotif({ message: response.data.message, password: true })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getLiveOrders = async () => {
        const csrfToken = localStorage.getItem('csrfToken')
        try {
            const response = await axios({
                url: "https://khaterahoapi.scanka.com/fooder/live_orders",
                method: "POST",
                data: JSON.stringify({
                    "token": `${accessToken}`,
                    "csrf": `${csrfToken}`,
                }),
            })
            setData(response.data.data)
            setAllData({ ...allData, LiveOrders: response?.data?.data })
            if (!response.data.data.length) { setAlert({ noLiveOrder: true }) }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getFooders = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/fooders",
                method: "GET",
                headers: {
                    'limit': perPage.Fooders,
                    'skip': page.fooder,
                }
            })
            if (!response.data.error) {
                if (!response.data?.data?.length) { setAlert({ noFooders: true }) }
                setAllData({ ...allData, Fooders: response?.data?.data })
                setFooders(response.data.data)
            } else {
                setAlert({ noFooders: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fooderBoundary = fooders[0]?.NumberOfFooders

    const getMenu = async (fooder_id, skip) => {
        if (fooder_id) { setIdForData(fooder_id) }
        let skipData = skip ? 0 : page.menu
        try {
            const response = await axios({
                url: "http://localhost:8000/fooders/menus",
                method: "GET",
                headers: {
                    'limit': perPage.Menu,
                    'skip': skipData,
                    fooder_id
                }
            })
            setToggle({ activeTab: "Menu" })
            if (!response.data?.error) {
                if (!response.data?.data?.length) { setAlert({ noMenu: true }) }
                setMenu(response?.data?.data)
                setAllData({ ...allData, Menu: response?.data?.data })
            } else {
                setAlert({ noMenu: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const menuBoundary = menu[0]?.total_item

    const getProducts = async (fooder_id, skip) => {
        if (fooder_id) { setIdForData(fooder_id) }
        let skipData = skip ? 0 : page.product
        try {
            const response = await axios({
                url: "http://localhost:8000/fooders/products",
                method: "GET",
                headers: {
                    'limit': perPage.Products,
                    'skip': skipData,
                    fooder_id
                }
            })
            setToggle({ activeTab: "Products" })
            if (!response.data?.error) {
                if (!response.data?.data?.length) { setAlert({ noProducts: true }) }
                setAllData({ ...allData, Products: response?.data?.data })
                setProducts(response?.data?.data)
            } else {
                setAlert({ noProducts: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const productsBoundary = products[0]?.total_item

    const editProd = async (id) => {
        const url = "http://localhost:8000/products/edit"
        try {
            const response = await axios({
                url: url,
                method: "GET",
                headers: {
                    id
                }
            })
            console.log('res', response.data)
            // setProfile({ ...profile, password: "", confirmPassword: "" })
            // setProfileNotif({ message: response.data.message, password: true })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteProd = async (id) => {
        const url = "http://localhost:8000/product/delete"
        try {
            await axios({
                url: url,
                method: "POST",
                data: {
                    id
                }
            })
            getProducts()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const manageProdStatus = async (id, stts) => {
        let status = (stts == 1) ? 0 : 1
        console.log("id,stts", id, status)
        const url = "http://localhost:8000/products/change/status"
        try {
            await axios({
                url: url,
                method: "POST",
                data: {
                    id, status
                }
            })
            getProducts()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const editMenu = async (id) => {
        const url = "http://localhost:8000/menu/delete"
        try {
            await axios({
                url: url,
                method: "POST",
                data: {
                    id
                }
            })
            getMenu()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteMenu = async (id) => {
        console.log("id", id)
        const url = "http://localhost:8000/menu/delete"
        try {
            const response = await axios({
                url: url,
                method: "POST",
                data: {
                    id
                }
            })
            console.log('res', response.data)
            getMenu()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getOrder = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/orders",
                method: "GET",
                headers: {
                    'limit': perPage.Orders,
                    'skip': page.order,
                }
            })
            setToggle({ activeTab: "Orders" })
            if (!response.data?.error) {
                if (!response.data?.data?.length) { setAlert({ noOrders: true }) }
                setAllData({ ...allData, Orders: response?.data?.data })
                setOrders(response?.data?.data)
            } else if (!response?.data?.data?.length || response?.data?.error) {
                setAlert({ noOrders: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const orderBoundary = orders[0]?.TotalItem

    const getOrdersDetail = async (order_id) => {
        try {
            const response = await axios({
                url: "http://localhost:8000/orders/details",
                method: "GET",
                headers: {
                    'limit': perPage.OrderDetails,
                    'skip': page.orderDetail,
                    order_id
                }
            })
            if (!response.data.error) { setOrdersDetails(response?.data?.data) }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getCustomers = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/customers",
                method: "GET",
                headers: {
                    'limit': perPage.Customers,
                    'skip': page.customer,
                }
            })
            if (!response.data.error) {
                if (!response.data?.data?.length) { setAlert({ noCustomers: true }) }
                setCustomers(response.data.data)
                setAllData({ ...allData, Customers: response?.data?.data })
            } else {
                setAlert({ noCustomers: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const customerBoundary = customers[0]?.total_counts

    const getOrdersCartData = () => {
        let charges = JSON.parse(orderDetails[0].service_charge_details)
        let taxes = JSON.parse(orderDetails[0].tax_details)
        const serviceChargeName = charges.name
        const serviceChargePerc = charges.percentage
        const totalAmount = orderDetails?.reduce((acc, order) => Number(acc) +
            Number((order.product_proprice || order.product_price) * order.quantity), 0);
        const discountType = orderDetails[0].discount_type
        const discountRate = orderDetails[0].discount_rate
        const discountPercentage = !discountType ? discountRate : ""
        const discountAmount = discountType ? discountRate : totalAmount * discountRate / 100
        const totalItem = orderDetails?.length
        const cgstTaxPercent = taxes[0].percentage
        const cgstTax = totalAmount * cgstTaxPercent / 100
        const sgstTaxPercent = taxes[1].percentage
        const sgstTax = totalAmount * sgstTaxPercent / 100
        const serviceCharge = serviceChargePerc * totalAmount / 100
        const totalTax = sgstTax + cgstTax + serviceCharge
        const finalPrice = totalAmount + totalTax - discountAmount

        const customerName = orderDetails[0]?.order_eater_name
        const customerNumber = orderDetails[0]?.order_eater_phonenumber
        const fooderName = orderDetails[0]?.order_foode_name
        const fooderNumber = orderDetails[0]?.login_mobile_number
        const state = orderDetails[0]?.state
        const city = orderDetails[0]?.city
        const Suggestions = orderDetails[0]?.eater_suggestions
        let status
        let status_class
        if (orderDetails[0].status == 0) { status = "Pending"; status_class = "order-status-pending" }
        else if (orderDetails[0].status == 1) { status = "Accept and Prepare Order"; status_class = "order-accept" }
        else if (orderDetails[0].status == 2) { status = "Order Ready"; status_class = "order-ready" }
        else if (orderDetails[0].status == 3) { status = "Delivered and paid"; status_class = "Unpaid" }
        if (orderDetails[0].status == 4) { status = "Reject"; status_class = "order-reject" }

        const orderNumber = orderDetails[0]?.order_number_qrcode
        const timestamp = orderDetails[0]?.creation_date * 1000
        const formatDate = (date) => {
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ];
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            if (hours > 12) {
                hours -= 12;
            }
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            return ` ${day} ${month} ${year} · ${hours}:${formattedMinutes} ${ampm}`;
        }
        const currentDate = new Date(timestamp);
        const formattedDate = formatDate(currentDate);

        return {
            totalItem, totalAmount, sgstTax, cgstTax, sgstTaxPercent, cgstTaxPercent,
            finalPrice, serviceChargeName, serviceChargePerc, totalTax, serviceCharge,
            customerName, customerNumber, fooderName, fooderNumber, state, city, status,
            orderNumber, formattedDate, discountRate, discountAmount, discountPercentage,
            status_class, Suggestions
        }
    }

    const handleSearch = (searchText, name) => {
        setSearchTerm(searchText);
        let targettedData = allData[name]
        const filteredResults = targettedData?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {
            // setSearchTerm('')
            if (name === "Fooders") {
                setAlert({ noFooders: true })
                setFooders(filteredResults);
            } else if (name === "Products") {
                setAlert({ noProducts: true })
                setProducts(filteredResults);
            } else if (name === "Menu") {
                setAlert({ noMenu: true })
                setMenu(filteredResults);
            } else if (name === "Customers") {
                setAlert({ noCustomers: true })
                setCustomers(filteredResults);
            } else if (name === "Orders") {
                setAlert({ noOrders: true })
                setOrders(filteredResults);
            }
        } else {
            if (name === "Fooders") {
                setAlert({ noFooders: false })
                setFooders(filteredResults);
            } else if (name === "Products") {
                setAlert({ noProducts: false })
                setProducts(filteredResults);
            } else if (name === "Menu") {
                setAlert({ noMenu: false })
                setMenu(filteredResults);
            } else if (name === "Customers") {
                setAlert({ noCustomers: false })
                setCustomers(filteredResults);
            } else if (name === "Orders") {
                setAlert({ noOrders: false })
                setOrders(filteredResults);
            }
        }

    };
    // console.log("allData", allData)

    const handleChange = (props) => {
        setProfile({ ...profile, [props.target.name]: props.target.value })
    }

    const handlePerPage = (value, name) => {
        const limit = Number(value); if (limit !== perPage.name) { setPerPage({ ...perPage, [name]: limit }) }
    }

    const manageToggle = (props) => {
        setToggle(props)
    }

    const signOut = () => {
        window.sessionStorage.clear()
        navigate('/')
    }

    const onSecondScreenClose = () => {
        setSecondScreen({})
    }

    const manageSidebar = (item) => {
        setToggle({ ...toggle, activeTab: `${item.name}` });
        setAlert({})
        setOrdersDetails({})
        setSecondScreen({})
        setSearchTerm('')
        setIdForData(null)
        if (item.name == "Live Orders") { getLiveOrders() }
        else if (item.name == "Logout") { window.sessionStorage.clear(); navigate('/') }
        else if (item.name == "Customers") { getCustomers() }
        else if (item.name == "Fooders") { getFooders() }
        else if (item.name == "Profile") { getUser() }
        else if (item.name == "Menu") { getMenu() }
        else if (item.name == "Products") { getProducts() }
        else if (item.name == "Orders") { getOrder() }
        else {
            // setAlert({})
        }

    }
    return (
        <>
            {showComponent ?
                <div className={toggle.closeSidebar ? "container-scroller sidebar-icon-only" : `container-scroller ${(toggle?.sidebarTheme == 'dark') ? "sidebar-dark" : "sidebar-light"}`} onClick={() => { }} >
                    <Headers>
                        <div className="container-fluid page-body-wrapper">
                            <div className="main-panel">
                                {(toggle.activeTab == "Dashboard") && <Dashbord />}
                                {(toggle?.activeTab == "Fooders" && !!allData?.Fooders?.length && !secondScreen?.verification || toggle.activeTab == "Menu" &&
                                    !!allData?.Menu?.length && !secondScreen?.editMenu ||
                                    toggle?.activeTab == "Products" && !!allData?.Products?.length && !secondScreen?.editProd ||
                                    toggle?.activeTab === "Customers" && !!allData?.Customers?.length ||
                                    toggle.activeTab == "Orders" && !!allData?.Orders?.length && !orderDetails?.length)

                                    && <div className="header-padding" >
                                        <h5>All {toggle.activeTab}</h5>
                                        <div className="d-flex justify-content-between align-items-start" >
                                            <div className="d-flex align-item-center max-width ">
                                                <p className="p-0" >Show records per page :</p>
                                                <div>
                                                    <div className="dropdown show" onClick={() => { if (!toggle.select) { setToggle({ ...toggle, select: true }) } else { setToggle({ ...toggle, select: false }) } }} >
                                                        <a className="btn btn-secondary btn-sm dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            {perPage[toggle.activeTab]}
                                                        </a>
                                                        <div className={toggle.select ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuLink">
                                                            <a className="dropdown-item" onClick={(e) => handlePerPage(10, toggle.activeTab)}  >10</a>
                                                            <a className="dropdown-item" onClick={(e) => handlePerPage(25, toggle.activeTab)} >25</a>
                                                            <a className="dropdown-item" onClick={(e) => handlePerPage(50, toggle.activeTab)}  >50</a>
                                                            <a className="dropdown-item" onClick={(e) => handlePerPage(100, toggle.activeTab)}  >100</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchTerm}
                                                className="searchbar"
                                                onChange={(e) => handleSearch(e.target.value, toggle.activeTab)}
                                            />
                                        </div>
                                    </div>}
                                {(toggle.activeTab == "Live Orders" && !!data.length) && <div className="table-responsive table-alone mt-1 ">
                                    <table className="table select-table ">
                                        <thead>
                                            <tr>
                                                <th>Order Number</th>
                                                <th>Status</th>
                                                <th>Mode</th>
                                                <th> Ago Time</th>
                                                <th>Order Time</th>
                                                <th>QR Code</th>
                                                <th>Change</th>
                                            </tr>
                                        </thead>

                                        {data?.map((item, i) => {
                                            const timestamp = item.order_time * 1000
                                            const formatDate = (date) => {
                                                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                const months = [
                                                    'January', 'February', 'March', 'April', 'May', 'June', 'July',
                                                    'August', 'September', 'October', 'November', 'December'
                                                ];
                                                const dayOfWeek = daysOfWeek[date.getDay()];
                                                const month = months[date.getMonth()];
                                                const day = date.getDate();
                                                const year = date.getFullYear();
                                                let hours = date.getHours();
                                                const minutes = date.getMinutes();
                                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                                if (hours > 12) {
                                                    hours -= 12;
                                                }
                                                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                                                return `${dayOfWeek}, ${month} ${day} ${year} · ${hours}:${formattedMinutes} ${ampm}`;
                                            }
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);
                                            return (
                                                <>
                                                    <tbody>
                                                        <tr key={i}>
                                                            <td>
                                                                <h6>{item.order_num}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.order_status_label}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.order_mode}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.hour_ago}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{formattedDate}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.order_number_qrcode}</h6>
                                                            </td>
                                                            <td>
                                                                <button type="button" class="btn btn-info btn-sm" onClick={() => { navigate('/pos'); window.sessionStorage.setItem("encryptedId", `${item.encryptedId}`) }} >Change</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )

                                        })}
                                    </table>
                                </div>
                                }
                                {alert.noLiveOrder && <div className="d-flex justify-content-center table-alone"><h3>There are no Live Order</h3></div>}

                                {(toggle.activeTab == "Customers" && !!customers.length) && <div className="table-responsive table-alone mt-1 ">
                                    <table className="table select-table ">
                                        <thead>
                                            <tr>
                                                <th>S NO.</th>
                                                <th>Name</th>
                                                <th>Phone Number</th>
                                                <th>Orders Count</th>
                                            </tr>
                                        </thead>
                                        {customers?.map((item, i) => {

                                            return (
                                                <>
                                                    <tbody>
                                                        <tr key={i}>
                                                            <td>
                                                                <h6>{i + page.customer + 1}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.eater_name}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.eater_phonenumber}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.order_count}</h6>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )

                                        })}
                                    </table>
                                    <div className="custom-footer" >
                                        <i className="mdi mdi-chevron-double-left pagination-button"
                                            onClick={() => {
                                                const newPage = page.customer - perPage.Customers;
                                                if (newPage >= 0) setPage({ ...page, customer: newPage })
                                            }}
                                        ></i>

                                        {(((page.customer + perPage.Customers) / perPage.Customers) - 1) !== 0 && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.customer - perPage.Customers;
                                                if (newPage >= 0) setPage({ ...page, customer: newPage })
                                            }} >{Math.ceil(((page.customer + perPage.Customers) / perPage.Customers) - 1)}</span>}

                                        <span className="pagination-active" >{Math.ceil((page.customer + perPage.Customers) / perPage.Customers)}</span>

                                        {(Math.ceil(customerBoundary / perPage.Customers) >= ((page.customer + perPage.Customers) / perPage.Customers) + 1) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.customer + perPage.Customers; setPage({ ...page, customer: newPage })
                                            }} >{Math.ceil(((page.customer + perPage.Customers) / perPage.Customers) + 1)}</span>}

                                        {(Math.ceil(customerBoundary / perPage.Customers) >= ((page.customer + perPage.Customers) / perPage.Customers) + 2) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.customer + perPage.Customers * 2; setPage({ ...page, customer: newPage })
                                            }} >{Math.ceil(((page.customer + perPage.Customers) / perPage.Customers) + 2)}</span>}

                                        <i className="mdi mdi-chevron-double-right pagination-button"
                                            onClick={() => {
                                                if (Math.floor(customerBoundary / perPage.Customers) >= ((page.customer + perPage.Customers) / perPage.Customers)) {
                                                    const newPage = page.customer + perPage.Customers; setPage({ ...page, customer: newPage })
                                                }
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                }
                                {alert.noCustomers && <div className="d-flex justify-content-center table-alone"><h3>There are no Customers</h3></div>}

                                {(toggle.activeTab == "Fooders" && !!fooders.length && !secondScreen.verification) && <div className="table-responsive table-alone mt-1 ">
                                    <table className="table select-table ">
                                        <thead>
                                            <tr>
                                                <th>S.NO.</th>
                                                <th>NAME</th>
                                                <th>MOBILE</th>
                                                <th className="W-25" > ADDRESS</th>
                                                <th>STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        {fooders?.map((item, i) => {
                                            const timestamp = item.joining_date * 1000
                                            const formatDate = (date) => {
                                                const months = [
                                                    'January', 'February', 'March', 'April', 'May', 'June', 'July',
                                                    'August', 'September', 'October', 'November', 'December'
                                                ];
                                                const month = months[date.getMonth()];
                                                const day = date.getDate();
                                                const year = date.getFullYear();
                                                let hours = date.getHours();
                                                const minutes = date.getMinutes();
                                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                                if (hours > 12) {
                                                    hours -= 12;
                                                }
                                                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                                                return ` ${day} ${month} ${year} · ${hours}:${formattedMinutes} ${ampm}`;
                                            }
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);
                                            let status
                                            if (item.is_approved) {
                                                switch (item.is_approved) {
                                                    case 0:
                                                        status = "pending";
                                                        break;
                                                    case 1:
                                                        status = "Accept and Prepare";
                                                        break;
                                                    case 2:
                                                        status = "Delivered and Paid";
                                                        break;
                                                    case 3:
                                                        status = "Out of Delivery";
                                                        break;
                                                    case 4:
                                                        status = "Reject";
                                                        break;
                                                    default:
                                                        status = ""
                                                }
                                            }
                                            return (
                                                <>
                                                    <tbody>
                                                        <tr key={i}>
                                                            <td>
                                                                <h6>{i + page.fooder + 1}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.name}</h6>
                                                                <h6>{item.username}</h6>
                                                                <p>{formattedDate}</p>
                                                            </td>
                                                            <td>
                                                                <p>{item.landline}</p>
                                                                <p>{item.login_mobile_number}</p>
                                                            </td>
                                                            <td>
                                                                <p>{item.address}</p>
                                                            </td>
                                                            <td>
                                                                <h6>{status}</h6>
                                                            </td>
                                                            <td className="w-25" >
                                                                <button type="button" class="btn btn-secondary btn-sm " onClick={() => { }} >View</button>
                                                                <button type="button" class="btn btn-warning btn-sm margin-between" onClick={() => { setSearchTerm(''); setPage({ ...page, menu: 0 }); getMenu(item.fooder_id, true) }} ><span className="d-flex justify-content-center" ><i class="menu-icon mdi mdi-floor-plan"></i><span>Menu</span></span></button>
                                                                <button type="button" class="btn btn-success btn-sm" onClick={() => { setSearchTerm(''); setPage({ ...page, product: 0 }); getProducts(item.fooder_id, true) }} ><span className="d-flex justify-content-center" ><i class="menu-icon mdi mdi-silverware-fork-knife"></i><span>Products</span></span></button>
                                                                <button type="button" class="btn btn-primary btn-sm margin-between" onClick={() => { setSearchTerm(''); setSecondScreen({ verification: true }) }} ><span className="d-flex justify-content-center" ><i class=" menu-icon mdi mdi-folder"></i><span>Documents</span></span></button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )

                                        })}
                                    </table>
                                    <div className="custom-footer" >
                                        <i className="mdi mdi-chevron-double-left pagination-button"
                                            onClick={() => {
                                                const newPage = page.fooder - perPage.Fooders;
                                                if (newPage >= 0) setPage({ ...page, fooder: newPage })
                                            }}
                                        ></i>

                                        {(((page.fooder + perPage.Fooders) / perPage.Fooders) - 1) !== 0 && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.fooder - perPage.Fooders;
                                                if (newPage >= 0) setPage({ ...page, fooder: newPage })
                                            }} >{Math.ceil(((page.fooder + perPage.Fooders) / perPage.Fooders) - 1)}</span>}

                                        <span className="pagination-active" >{Math.ceil((page.fooder + perPage.Fooders) / perPage.Fooders)}</span>

                                        {(Math.ceil(fooderBoundary / perPage.Fooders) >= ((page.fooder + perPage.Fooders) / perPage.Fooders) + 1) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.fooder + perPage.Fooders; setPage({ ...page, fooder: newPage })
                                            }} >{Math.ceil(((page.fooder + perPage.Fooders) / perPage.Fooders) + 1)}</span>}

                                        {(Math.ceil(fooderBoundary / perPage.Fooders) >= ((page.fooder + perPage.Fooders) / perPage.Fooders) + 2) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.fooder + perPage.Fooders * 2; setPage({ ...page, fooder: newPage })
                                            }} >{Math.ceil(((page.fooder + perPage.Fooders) / perPage.Fooders) + 2)}</span>}

                                        <i className="mdi mdi-chevron-double-right pagination-button"
                                            onClick={() => {
                                                if (Math.floor(fooderBoundary / perPage.Fooders) >= ((page.fooder + perPage.Fooders) / perPage.Fooders)) {
                                                    const newPage = page.fooder + perPage.Fooders; setPage({ ...page, fooder: newPage })
                                                }
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                }
                                {alert.noFooders && <div className="d-flex justify-content-center table-alone"><h3>There are no Fooders</h3></div>}


                                {(toggle.activeTab == "Fooders" && secondScreen.verification) &&
                                    <Documents onClose={onSecondScreenClose} />
                                }

                                {(toggle.activeTab == "Menu" && !!menu?.length && !secondScreen?.editMenu) && <div className="table-responsive table-alone mt-1 ">
                                    <table className="table select-table ">
                                        <thead>
                                            <tr>
                                                <th>S.NO.</th>
                                                <th>MENU</th>
                                                <th> FOODER NAME</th>
                                                <th className="w-25" >DESCRIPTION</th>
                                                <th> STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        {menu?.map((item, i) => {
                                            let status = (item.status) ? "Active" : "Inactive"
                                            let payment_status = (item.status) ? "Paid" : "Unpaid"

                                            return (
                                                <>
                                                    <tbody>
                                                        <tr key={i}>
                                                            <td>
                                                                <p>{i + page.menu + 1}</p>
                                                            </td>
                                                            <td>
                                                                <h6>{item.menu_name}</h6>
                                                                <span className="bg-warning p-1 rounded" >Product(s):{item.product_count}</span>
                                                            </td>
                                                            <td>
                                                                <h6>{item.fooder_name}</h6>
                                                            </td>
                                                            <td>
                                                                <p>{item.description}</p>
                                                            </td>
                                                            <td>
                                                                <span className={`table-color-col ${payment_status}`} >{status}</span>
                                                            </td>
                                                            <td>
                                                                <i class="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { setSecondScreen({ editMenu: true }) }} ></i>
                                                                <i class="fs-20 mdi mdi-archive text-danger" onClick={() => deleteMenu(item.id)} ></i>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )

                                        })}

                                    </table>
                                    <div className="custom-footer" >
                                        <i className="mdi mdi-chevron-double-left pagination-button"
                                            onClick={() => {
                                                const newPage = page.menu - perPage.Menu;
                                                if (newPage >= 0) setPage({ ...page, menu: newPage })
                                            }}
                                        ></i>

                                        {(((page.menu + perPage.Menu) / perPage.Menu) - 1) !== 0 && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.menu - perPage.Menu;
                                                if (newPage >= 0) setPage({ ...page, menu: newPage })
                                            }} >{((page.menu + perPage.Menu) / perPage.Menu) - 1}</span>}

                                        <span className="pagination-active" >{(page.menu + perPage.Menu) / perPage.Menu}</span>

                                        {(Math.ceil(menuBoundary / perPage.Menu) >= ((page.menu + perPage.Menu) / perPage.Menu) + 1) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.menu + perPage.Menu; setPage({ ...page, menu: newPage })
                                            }} >{((page.menu + perPage.Menu) / perPage.Menu) + 1}</span>}

                                        {(Math.ceil(menuBoundary / perPage.Menu) >= ((page.menu + perPage.Menu) / perPage.Menu) + 2) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.menu + perPage.Menu * 2; setPage({ ...page, menu: newPage })
                                            }} >{((page.menu + perPage.Menu) / perPage.Menu) + 2}</span>}

                                        <i className="mdi mdi-chevron-double-right pagination-button"
                                            onClick={() => {
                                                if (Math.floor(menuBoundary / perPage.Menu) >= ((page.menu + perPage.Menu) / perPage.Menu)) {
                                                    const newPage = page.menu + perPage.Menu; setPage({ ...page, menu: newPage })
                                                }
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                }
                                {alert?.noMenu && <div className="d-flex justify-content-center table-alone"><h3>There are no Menu </h3></div>}

                                {(toggle.activeTab == "Menu" && secondScreen?.editMenu) &&
                                    <EditMenu onClose={onSecondScreenClose} />
                                }

                                {(toggle.activeTab == "Products" && !!products?.length && !secondScreen?.editProd) && <div className="table-responsive table-alone mt-1 ">
                                    <table className="table select-table ">
                                        <thead>
                                            <tr>
                                                {/* <th>S.NO.</th> */}
                                                <th>IMAGE</th>
                                                <th>PRODUCTS</th>
                                                <th>PROMO PRICE</th>
                                                <th> PRICE</th>
                                                <th>STATUS</th>
                                                <th> PREPARATION TIME</th>
                                                <th>RANK</th>
                                                <th> TAGS</th>
                                                <th>ACTION</th>
                                                {/* <th>Creation Date</th> */}
                                            </tr>
                                        </thead>
                                        {products?.map((item, i) => {

                                            let tagTop_rated = item.top_rated
                                            let tagBest_seller = item.best_seller
                                            let tagMost_ordered = item.most_ordered

                                            let rank
                                            if (tagTop_rated && tagBest_seller && tagMost_ordered) {
                                                rank = "Top Rated, Best seller, Most Ordered"
                                            } else if (tagBest_seller && tagMost_ordered) {
                                                rank = " Best seller, Most Ordered"
                                            } else if (tagTop_rated && tagMost_ordered) {
                                                rank = "Top Rated, Most Ordered"
                                            } else if (tagBest_seller && tagTop_rated) {
                                                rank = "Top Rated, Best seller"
                                            } else if (tagTop_rated) {
                                                rank = "Top Rated"
                                            } else if (tagBest_seller) {
                                                rank = "Best seller"
                                            } else if (tagMost_ordered) {
                                                rank = "Most Ordered"
                                            }


                                            let status
                                            if (item.status) {
                                                switch (item.status) {
                                                    case 0:
                                                        status = "Off";
                                                        break;
                                                    case 1:
                                                        status = "On";
                                                        break;
                                                    default:
                                                        status = ""
                                                }
                                            }
                                            return (
                                                <>
                                                    <tbody>
                                                        <tr key={i}>
                                                            {/* <td>
                                                            <h6>{i + page.product + 1}</h6>
                                                        </td> */}
                                                            <td>
                                                                {/* <h6>{item.picture}</h6> */}
                                                                {/* <img src={item.picture} alt="img not available" /> */}
                                                                <img src={`https://khateraho.baatcheet.online/khateraho/upload/fooders/1/product/1695987421652-1694770356.png`} alt="img not available" />

                                                            </td>
                                                            <td>
                                                                <h6>{item.product_name}</h6>
                                                                <h6>{item.menu_name}</h6>
                                                            </td>
                                                            <td>
                                                                {item.proprice && <h5 className="text-warning" >{currency}{item.proprice}</h5>}
                                                            </td>
                                                            <td>
                                                                <h5 className="text-success"  >{currency}{item.price}</h5>
                                                            </td>
                                                            <td>
                                                                <div className={`status-btn-parent ${(item.status) ? "status-on-parent-color " : "status-off-parent-color "}`} onClick={() => manageProdStatus(item.id, item.status)} >
                                                                    <div className={`status-btn-on ${(!item.status) ? "hidden-on-btn-color" : " "}  `}>On</div>
                                                                    {(!item.status) && <div className="status-btn-off">Off</div>}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p>{item.preparation_time}</p>
                                                            </td>
                                                            <td>
                                                                <p>{rank}</p>
                                                            </td>
                                                            <td>
                                                                <p>{item.tags}</p>
                                                            </td>
                                                            <td>
                                                                <i class="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { setSecondScreen({ editProd: true }) }} ></i>
                                                                <i class="fs-20 mdi mdi-archive text-danger" onClick={() => { deleteProd(item.id) }}  ></i>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )

                                        })}
                                    </table>
                                    <div className="custom-footer" >
                                        <i className="mdi mdi-chevron-double-left pagination-button"
                                            onClick={() => {
                                                const newPage = page.product - perPage.Products;
                                                if (newPage >= 0) setPage({ ...page, product: newPage })
                                            }}
                                        ></i>

                                        {(((page.product + perPage.Products) / perPage.Products) - 1) !== 0 && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.product - perPage.Products;
                                                if (newPage >= 0) setPage({ ...page, product: newPage })
                                            }} >{((page.product + perPage.Products) / perPage.Products) - 1}</span>}

                                        <span className="pagination-active" >{(page.product + perPage.Products) / perPage.Products}</span>

                                        {(Math.ceil(productsBoundary / perPage.Products) >= ((page.product + perPage.Products) / perPage.Products) + 1) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.product + perPage.Products; setPage({ ...page, product: newPage })
                                            }} >{((page.product + perPage.Products) / perPage.Products) + 1}</span>}

                                        {(Math.ceil(productsBoundary / perPage.Products) >= ((page.product + perPage.Products) / perPage.Products) + 2) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.product + perPage.Products * 2; setPage({ ...page, product: newPage })
                                            }} >{((page.product + perPage.Products) / perPage.Products) + 2}</span>}

                                        <i className="mdi mdi-chevron-double-right pagination-button"
                                            onClick={() => {
                                                if (Math.floor(productsBoundary / perPage.Products) >= ((page.product + perPage.Products) / perPage.Products)) {
                                                    const newPage = page.product + perPage.Products; setPage({ ...page, product: newPage })
                                                }
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                }
                                {alert?.noProducts && <div className="d-flex justify-content-center table-alone"><h3>There are no Products </h3></div>}

                                {(toggle.activeTab == "Products" && secondScreen.editProd) &&
                                    <EditProduct onClose={onSecondScreenClose} />
                                }

                                {(toggle.activeTab == "Orders" && !!orders?.length && !orderDetails?.length) && <div className="table-responsive table-alone mt-1 ">
                                    <table className="table select-table ">
                                        <thead>
                                            <tr>
                                                <th>S.NO.</th>
                                                <th>ORDERS</th>
                                                <th>CLIENT DETAILS</th>
                                                <th> AMOUNT</th>
                                                <th className="w-25" >SUGGESTIONS</th>
                                                <th>ORDER STATUS</th>
                                                <th>PAYMENT STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        {orders?.map((item, i) => {
                                            const timestamp = item.creation_date * 1000
                                            const formatDate = (date) => {
                                                const months = [
                                                    'January', 'February', 'March', 'April', 'May', 'June', 'July',
                                                    'August', 'September', 'October', 'November', 'December'
                                                ];
                                                const month = months[date.getMonth()];
                                                const day = date.getDate();
                                                const year = date.getFullYear();
                                                let hours = date.getHours();
                                                const minutes = date.getMinutes();
                                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                                if (hours > 12) {
                                                    hours -= 12;
                                                }
                                                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                                                return ` ${day} ${month} ${year} · ${hours}:${formattedMinutes} ${ampm}`;
                                            }
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);
                                            let payment_status = (item.payment_status) ? "Paid" : "Unpaid"
                                            let status
                                            let status_class
                                            if (item.status == 0) { status = "Pending"; status_class = "order-status-pending" }
                                            else if (item.status == 1) { status = "Accept and Prepare Order"; status_class = "order-accept" }
                                            else if (item.status == 2) { status = "Order Ready"; status_class = "order-ready" }
                                            else if (item.status == 3) { status = "Delivered and paid"; status_class = "Unpaid" }
                                            if (item.status == 4) { status = "Reject"; status_class = "order-reject" }

                                            return (
                                                <>
                                                    <tbody>
                                                        <tr key={i}>
                                                            <td>
                                                                <p>{i + page.order + 1}</p>
                                                            </td>
                                                            <td>
                                                                <h5>#{item.qr_code_number}</h5>
                                                                <p>Table No-{item.fooder_table}</p>
                                                                <p>{formattedDate}</p>
                                                            </td>
                                                            <td >
                                                                <h5><span class="mdi mdi-account"></span>{item.eater_name}</h5>
                                                                <p ><span class="mdi mdi-phone">{item.eater_phonenumber}</span></p>
                                                            </td>
                                                            <td>
                                                                <h4 className="text-danger">{currency}{item?.total?.toFixed(2)}</h4>
                                                            </td>
                                                            <td >
                                                                <p>{item.eater_suggestions}</p>
                                                            </td>
                                                            <td>
                                                                <div className={`table-color-col ${status_class}`}>{status}</div>
                                                            </td>
                                                            <td>
                                                                <span className={`table-color-col ${payment_status}`} >{payment_status}</span>
                                                            </td>
                                                            <td className="d-flex justify-center flex-column" >
                                                                <button type="button" class="btn btn-success btn-sm" onClick={() => { getOrdersDetail(item.order_id) }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-content-save-edit-outline vsalign"></i><span>Details</span></div></button>
                                                                <button type="button" class="btn btn-warning btn-sm mt-1 mb-1 " onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign "></i><span>Bill</span></div></button>
                                                                <button type="button" class="btn btn-dark btn-sm" onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign"></i><span>KOT</span></div></button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )

                                        })}
                                    </table>
                                    <div className="custom-footer" >
                                        <i className="mdi mdi-chevron-double-left pagination-button"
                                            onClick={() => {
                                                const newPage = page.order - perPage.Orders;
                                                if (newPage >= 0) setPage({ ...page, order: newPage })
                                            }}
                                        ></i>

                                        {(((page.order + perPage.Orders) / perPage.Orders) - 1) !== 0 && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.order - perPage.Orders;
                                                if (newPage >= 0) setPage({ ...page, order: newPage })
                                            }} >{((page.order + perPage.Orders) / perPage.Orders) - 1}</span>}

                                        <span className="pagination-active" >{(page.order + perPage.Orders) / perPage.Orders}</span>

                                        {(Math.ceil(orderBoundary / perPage.Orders) >= ((page.order + perPage.Orders) / perPage.Orders) + 1) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.order + perPage.Orders; setPage({ ...page, order: newPage })
                                            }} >{((page.order + perPage.Orders) / perPage.Orders) + 1}</span>}

                                        {(Math.ceil(orderBoundary / perPage.Orders) >= ((page.order + perPage.Orders) / perPage.Orders) + 2) && <span className="pagination-other"
                                            onClick={() => {
                                                const newPage = page.order + perPage.Orders * 2; setPage({ ...page, order: newPage })
                                            }} >{((page.order + perPage.Orders) / perPage.Orders) + 2}</span>}

                                        <i className="mdi mdi-chevron-double-right pagination-button"
                                            onClick={() => {
                                                if (Math.floor(orderBoundary / perPage.Orders) >= ((page.order + perPage.Orders) / perPage.Orders)) {
                                                    const newPage = page.order + perPage.Orders; setPage({ ...page, order: newPage })
                                                }
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                }
                                {alert?.noOrders && <div className="d-flex justify-content-center table-alone"><h3>There are no Orders </h3></div>}


                                {(toggle.activeTab == "Orders" && !!orderDetails?.length) && <div>
                                    <div className="table-responsive table-alone mt-1 ">
                                        <div className="d-flex justify-content-between" >
                                            <div>
                                                <h5>Order Id # {getOrdersCartData().orderNumber}</h5>

                                            </div>
                                            <div>
                                                <h5 className={`d-flex justify-content-center align-items-center`}>Status :<span className={`rounded-pill p-1 ${getOrdersCartData().status_class}`} >{getOrdersCartData().status}</span></h5>
                                                <h5>Placed on : <span className="text-primary"  >{getOrdersCartData().formattedDate}</span> </h5>
                                            </div>
                                            <div>
                                                <button type="button" class="btn btn-warning btn-sm" onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign"></i><span>Bill</span></div></button>
                                                <button type="button" class="btn btn-dark btn-sm margin-between" onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign"></i><span>KOT</span></div></button>
                                                <button type="button" class="btn btn-danger btn-sm" onClick={() => { setOrdersDetails([]); }} ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between m-3" >
                                            <div>
                                                {getOrdersCartData().fooderName && <h4>Fooder Name : {getOrdersCartData().fooderName}</h4>}
                                                {getOrdersCartData().fooderNumber && <p><span class="mdi mdi-phone" />Number : {getOrdersCartData().fooderNumber}</p>}
                                                <p><span class="mdi mdi-office-building"></span>{getOrdersCartData().state}/{getOrdersCartData().city}</p>
                                            </div>
                                            <div>
                                                {getOrdersCartData().customerName && <h4>Customer Name : {getOrdersCartData().customerName}</h4>}
                                                {getOrdersCartData().customerNumber && <p><span class="mdi mdi-phone" />Number : {getOrdersCartData().customerNumber}</p>}
                                            </div>
                                        </div>

                                        <table className="table select-table ">
                                            <thead>
                                                <tr>
                                                    <th>S.NO.</th>
                                                    <th>PRODUCT NAME</th>
                                                    <th>PRICE</th>
                                                    <th> QUANTITY</th>
                                                    <th>TOTAL</th>
                                                </tr>
                                            </thead>
                                            {orderDetails?.map((item, i) => {
                                                const price = item.product_proprice ? item.product_proprice : item.product_price
                                                const amount = price * item.quantity
                                                return (
                                                    <>
                                                        <tbody>
                                                            <tr key={i}>
                                                                <td>
                                                                    <p>{i + page.orderDetail + 1}</p>
                                                                </td>
                                                                <td>
                                                                    <p>{item.product_name}</p>
                                                                </td>
                                                                <td >
                                                                    <p >{price}</p>
                                                                </td>
                                                                <td>
                                                                    <p>{item?.quantity}</p>
                                                                </td>
                                                                <td>
                                                                    <p>{amount}</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </>
                                                )

                                            })}
                                        </table>
                                        <div >
                                            <div className="cart-items-right footerbtn" >
                                                {getOrdersCartData().totalAmount && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                    <div className="d-flex">
                                                        <div className="wrapper">
                                                            <span className="totalwrd">Subtotal</span>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <span className="text-danger" >{currency}{getOrdersCartData().totalAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>}
                                                {(!!getOrdersCartData().discountAmount) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                    <div className="d-flex">
                                                        <div className="wrapper">
                                                            <span className="totalwrd">Discount ({getOrdersCartData().discountPercentage}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <span className="text-danger" >{currency}{getOrdersCartData().discountAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>}
                                                {(!!getOrdersCartData().serviceCharge) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                    <div className="d-flex">
                                                        <div className="wrapper">
                                                            <span className="totalwrd">{getOrdersCartData().serviceChargeName}({getOrdersCartData().serviceChargePerc}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <span className="text-danger" >{currency}{getOrdersCartData().serviceCharge.toFixed(2)}</span>
                                                    </div>
                                                </div>}
                                                {(!!getOrdersCartData().cgstTax) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                    <div className="d-flex">
                                                        <div className="wrapper">
                                                            <span className="totalwrd">CGST({getOrdersCartData().cgstTaxPercent}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <span className="text-danger" >{currency}{getOrdersCartData().cgstTax.toFixed(2)}</span>
                                                    </div>
                                                </div>}
                                                {(!!getOrdersCartData().sgstTax) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                    <div className="d-flex">
                                                        <div className="wrapper">
                                                            <span className="totalwrd">SGST({getOrdersCartData().sgstTaxPercent}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <span className="text-danger" >{currency}{getOrdersCartData().sgstTax.toFixed(2)}</span>
                                                    </div>
                                                </div>}
                                                {(!!getOrdersCartData().finalPrice) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                    <div className="d-flex">
                                                        <div className="wrapper">
                                                            <h3 className="totalwrd">Total Amount Paid :</h3>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <h3 className="totalwrd"><span className="" > {currency}{getOrdersCartData().finalPrice.toFixed(2)}</span></h3>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="totaldiv wrapper d-flex align-items-center justify-content-start wrapper p-3">
                                        <h5 className="totalwrd">  Eater Suggestions*</h5>
                                        {/* <p>hxbsxhisxinsx jb uhsiu uihsaio ioasho iahsoiashoihx oiashoixhsaoixh</p> */}
                                        <p>{getOrdersCartData().Suggestions}</p>
                                    </div>
                                </div>
                                }

                                {(toggle.activeTab == "Profile") &&
                                    <div className="main-panel">
                                        <div className="content-wrapper">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="row">
                                                        <div className="col-lg-8 d-flex">
                                                            <div className="row flex-grow">
                                                                <div className="col-12 grid-margin">
                                                                    <div className="card card-rounded">
                                                                        <div className="card-body">
                                                                            <h4 className="card-title">Contact Details</h4>
                                                                            <form className="forms-sample" onKeyPress={(event) => (event.key === 'Enter') ? updateProfile("profile") : ''} >
                                                                                <div className="form-group">
                                                                                    <label>Name</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        name="name"
                                                                                        placeholder="Name"
                                                                                        onChange={(e) => handleChange(e)}
                                                                                        value={profile.name}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Email</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        name="email"
                                                                                        placeholder="email"
                                                                                        value={profile.email}
                                                                                        defaultValue=""
                                                                                        onChange={(e) => handleChange(e)}
                                                                                    />
                                                                                </div>
                                                                                {(profileNotif.profile) && <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                                                    {profileNotif.message} <button
                                                                                        type="button"
                                                                                        className="btn-close"
                                                                                        data-bs-dismiss="offcanvas"
                                                                                        aria-label="Close"
                                                                                        onClick={() => { setProfileNotif({}) }}
                                                                                    /> </div>}
                                                                            </form>
                                                                            <button className="btn btn-primary me-2" onClick={() => updateProfile()} >
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 d-flex">
                                                            <div className="row flex-grow">
                                                                <div className="col-12 grid-margin">
                                                                    <div className="card card-rounded">
                                                                        <div className="card-body">
                                                                            <h4>Change Password</h4>
                                                                            <form className="pt-3" onKeyPress={(event) => (event.key === 'Enter') ? updatePassword() : ''} >
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        type="password"
                                                                                        className="form-control"
                                                                                        placeholder="New Password"
                                                                                        name="password"
                                                                                        defaultValue=""
                                                                                        value={profile.password}
                                                                                        onChange={(e) => handleChange(e)}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        type="password"
                                                                                        className="form-control"
                                                                                        placeholder="Re-type New Password"
                                                                                        name="confirmPassword"
                                                                                        defaultValue=""
                                                                                        value={profile.confirmPassword}
                                                                                        onChange={(e) => handleChange(e)}
                                                                                    />
                                                                                </div>
                                                                                {(profile?.confirmPassword?.length > 0 && profile.confirmPassword !== profile.password) ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                                                                    Password not matched with Confirm Password
                                                                                </div> : ""}
                                                                                {(profileNotif.password) && <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                                                    {profileNotif.message}<button
                                                                                        type="button"
                                                                                        className="btn-close"
                                                                                        data-bs-dismiss="offcanvas"
                                                                                        aria-label="Close"
                                                                                        onClick={() => { setProfileNotif({}) }}
                                                                                    /> </div>}
                                                                            </form>
                                                                            <div className="mt-3">
                                                                                <button className="btn btn-primary me-2" onClick={() => updatePassword()} >
                                                                                    Save
                                                                                </button>
                                                                                <button className="btn btn btn-secondary" onClick={() => setProfile({ ...profile, password: "", confirmPassword: "" })} >Reset</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                }
                            </div>
                        </div>
                    </Headers>
                </div>
                : <div class="text-center mt-5">
                    <div class="spinner-border" role="status">
                    </div>
                </div>}
        </>
    )
}

export default WithBootstrap(Main)