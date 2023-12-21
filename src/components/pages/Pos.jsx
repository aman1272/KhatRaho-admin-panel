import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'
import axios from 'axios'
import useSound from "use-sound";
import mixkit from '../assets/mixkit.wav'

const Pos = () => {
    const accessToken = window.sessionStorage.getItem("Accesstoken");
    const csrfToken = localStorage.getItem('csrfToken')
    let encryptedId = sessionStorage.getItem('encryptedId')

    const [toggle, setToggle] = useState(false)
    const [alert, setAlert] = useState(false)
    const [menu, setMenu] = useState([])
    const [products, setProducts] = useState([])
    const [allData, setAllData] = useState([])
    const [searchData, setSearchData] = useState([])
    const [searchText, setSearchText] = useState([])
    const [activeTab, setActiveTab] = useState('all')
    const [quantity, setQuantity] = useState(1)
    const [cartItem, setCartItem] = useState({})
    const [orderItem, setOrderItem] = useState([])
    const [liveOrderdata, setliveOrderData] = useState({})
    const [playSound] = useSound(mixkit);

    useEffect(() => {
        const savedOrder = JSON.parse(localStorage.getItem('order')) || [];
        getApiData()
        if (!encryptedId) { setOrderItem(savedOrder); }
    }, []);
    //----------------------------------------------Get Product and Menu(Category) -------------------------------------
    const getApiData = async () => {
        try {
            const response = await axios({
                url: "https://khaterahoapi.scanka.com/fooder/pos",
                method: "POST",
                data: JSON.stringify({
                    "token": `${accessToken}`,
                    "csrf": `${csrfToken}`,
                    "request_type": "load_pos_data"
                }),
            })
            console.log(' fetching menu and Products:', response.data.data);
            const { menu, products } = response.data.data
            setMenu(menu)
            setProducts(products)
            setAllData(response.data.data)
            updateProductsBasedOnMenu({ menu, products })
            if (encryptedId) { getLiveOrder({ encryptedId }) }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getLiveOrder = async ({ encryptedId }) => {
        try {
            const response = await axios({
                url: "https://khaterahoapi.scanka.com/fooder/live_order_details",
                method: "POST",
                data: JSON.stringify({
                    "token": `${accessToken}`,
                    "csrf": `${csrfToken}`,
                    "encrypt_id": `${encryptedId}`,
                }),
            })
            console.log(' fetching Live Order:', response.data.data);
            const { items, client_name, created_date, order_id, service_charge_details, tax_details } = response.data.data
            setliveOrderData({ ...liveOrderdata, client_name, created_date, order_id, service_charge_details, tax_details })
            const updatedData = items.map(item => {
                const convertQtty = Number(item.quantity)
                const updated_price = item.proprice !== '' ? item.product_proprice : item.product_price;
                return { ...item, updated_price, quantity: convertQtty };
            });

            setOrderItem([...updatedData])
            if (!encryptedId) {
                localStorage.setItem('order', JSON.stringify([...updatedData]));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //----------------------------------------------------Final Submition for Order Placed-------------------------
    const submitOrder = async () => {
        playSound();
        console.log("order", JSON.stringify({
            data: orderItem
        }))
        setToggle({ ...toggle, invoice: true })
        handlePrint()
        // try {
        //     const response = await axios({
        //         url: "https://khaterahoapi.scanka.com/fooder/live_orders",
        //         method: "POST",
        //         data: JSON.stringify({
        //             "token": `${accessToken}`,
        //             data: orderItem
        //         }),
        //     })
        //     // setData(response.data.data)
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // }
    }

    const handlePrint = () => {

        const divToPrint = document.getElementById('printinvoice')
        const newWin = window.open('', 'Print-Window');
        newWin.document.open();
        newWin.document.write(
            '<html><head><title>Print</title></head><body>' + divToPrint.innerHTML + '</body></html>'
        );
        newWin.document.close();
        newWin.print();
        newWin.close();
    };
    const currentCategoryData = (id) => {
        playSound();
        if (id) {
            setActiveTab(id)
            const currentCategData = allData?.products?.filter((product) => product?.menu_id === id)
            setProducts(currentCategData)
        }
    }

    //----------------------------------------------------------------Category/Menu items Quantity-------------------------------------
    const getMenuItemQuantity = () => {
        const productsByCategory = {};
        allData?.menu?.forEach((category) => {
            productsByCategory[category.id] = [];
        });
        allData?.products?.forEach((product) => {
            const menu_id = Number(product?.menu_id)
            if (productsByCategory[menu_id]) {
                productsByCategory[menu_id].push(product);
            }
        });
        return productsByCategory
    }

    //-----------------------------------------------------update  product data for neccesary keys and value of menu category--------------
    const updateProductsBasedOnMenu = ({ menu = [], products = [] }) => {
        for (const product of products) {
            const matchingMenu = menu.find(item => item?.id === product?.menu_id);
            const isPrice = Number(product?.proprice || product.price)
            if (matchingMenu) {
                product.menuName = matchingMenu?.name;
                product.updated_price = isPrice.toFixed(2)
            }
        }
        const updatedProd = products
        return updatedProd
    }

    //------------------------------------------------------------------manage all search Opretaions--------------------------------------
    const handleSearch = (e) => {
        e.preventDefault()
        let searchResult = []
        if (e?.type == 'change') {
            if (e.target.value.length < 3) { setActiveTab('all'); setProducts(allData?.products) }
            setSearchText(e.target.value)
            const searchTerm = e?.target.value.toLowerCase();
            const findByProduct = updateProductsBasedOnMenu({ ...allData }).filter(item => item?.name?.toLowerCase()?.includes(searchTerm));
            const findByMenu = updateProductsBasedOnMenu({ ...allData }).filter(item => item?.menuName?.toLowerCase()?.includes(searchTerm));
            searchResult = findByProduct.length ? findByProduct : findByMenu
            if (searchResult?.length) {
                setSearchData(searchResult)
                setProducts(searchResult)
                setAlert(false)
                if (!alert) {
                    if (e.target.value.length > 2) {
                        currentCategoryData(searchData[0]?.menu_id)
                        // setSearchText('')
                    }
                } else { setProducts(allData?.products) }
            }
            else { setAlert(true); setProducts([]) }
        }
    }

    //------------------------------------------------------Add order to cart and manage quantity and modal-------------------------------------
    const handleOrder = (item) => {
        playSound()
        if (item.type === 'close') { setQuantity(1); setToggle({ ...toggle, lessQtty: false, modal: false }) }
        else { setToggle({ ...toggle, modal: true }) }

        if (typeof (item) == "object") {
            setCartItem(item)
        }
        if (item.type == 'Add_OrderTocart') {
            setCartItem({ ...cartItem, quantity })
            const isAvailableinOrder = orderItem.some((items) => items?.product_id === cartItem.id || items?.id === cartItem.id)
            if (!isAvailableinOrder) {
                if (!encryptedId) { localStorage.setItem('order', JSON.stringify([...orderItem, { ...cartItem, quantity }])); }
                setOrderItem([...orderItem, { ...cartItem, quantity }])
                setToggle({ ...toggle, modal: false, lessQtty: false })
                setQuantity(1)
            } else {
                const updateOrderItem = orderItem.map((items) => {
                    if (items.product_id == cartItem.id || items.id == cartItem.id) {
                        const newQtty = items.quantity + quantity
                        return { ...items, quantity: newQtty }
                    } else {
                        return { ...items }
                    }
                })
                if (!encryptedId) { localStorage.setItem('order', JSON.stringify(updateOrderItem)); }
                setOrderItem(updateOrderItem)
                setToggle({ ...toggle, modal: false, lessQtty: false })
                setQuantity(1)
            }

        }
    }

    const handleChange = (event) => {
        const inputValue = event;
        if (!isNaN(inputValue) && parseFloat(inputValue) !== 0) {
            setQuantity(Number(inputValue));
        }
    };

    //---------------------------------------------------------------------  Remove order in cart ||Quantity Increamnet/Decreamnet --------------------------------------
    const updateQuantity = (productId, newQuantity, index) => {
        if (productId == 'removeItem' && newQuantity >= 0 && newQuantity < orderItem?.length) {
            let indexToRemove = newQuantity
            const updatedOrder = orderItem.filter((element, index) => index !== indexToRemove)
            if (!encryptedId) {
                localStorage.setItem('order', JSON.stringify(updatedOrder));
            }
            setOrderItem(updatedOrder)
        } else {
            const updatedProducts = orderItem.map((product, i) => {
                if (i === index && product.id === productId) {
                    return { ...product, quantity: newQuantity };
                }
                return product;
            });
            if (!encryptedId) {
                localStorage.setItem('order', JSON.stringify(updatedProducts));
            }
            setOrderItem(updatedProducts);
        }
    }
    const clientName = encryptedId ? liveOrderdata.client_name : ""
    const currencyName = "$"
    const serviceChargeName = encryptedId ? liveOrderdata?.service_charge_details?.name : allData?.service_charge_name
    const serviceChargePerc = encryptedId ? Number(liveOrderdata?.service_charge_details?.percentage || 0) : Number(allData?.service_charge_percent)
    const totalAmount = orderItem.reduce((acc, order) => Number(acc) + Number(order.updated_price * order.quantity), 0);
    const totalItem = allData?.products?.length
    const discountPer = 2
    const discount = totalAmount * discountPer / 100
    const sgstTaxPercent = Number(allData?.tax_percent) / 2
    const sgstTax = totalAmount * sgstTaxPercent / 100
    const cgstTaxPercent = Number(allData?.tax_percent) / 2
    const cgstTax = totalAmount * cgstTaxPercent / 100
    const serviceCharge = serviceChargePerc * totalAmount / 100
    const totalTax = sgstTax + cgstTax + serviceCharge
    const finalPrice = totalAmount - discount + totalTax


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
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);



    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="./css/font-awesome.min.css" />
                <link rel="stylesheet" href="css/style.css" />
                <link rel="stylesheet" href="./css/posstyle.css" />
            </Helmet>
            {Object.keys(allData)?.length ?
                <div>
                    <div className="main-panel layout" onClick={() => { if (toggle.sidebar) { setToggle({ ...toggle, sidebar: false }) } else if (toggle.modal) { setToggle({ ...toggle, modal: false }) } }} >
                        <div className={toggle.sidebar ? "content-wrapper contentdiv opacity-50" : "content-wrapper contentdiv "}>
                            <div className="row">
                                <div className="col-lg-9 d-flex flex-column">
                                    <div className="headernav">
                                        <div className="row">
                                            <div className="col-lg-5">
                                                <a>
                                                    <span
                                                        className="navclck"
                                                        href="#offcanvas-usage"
                                                        data-bs-toggle="offcanvas"
                                                        data-bs-target="#offcanvasExample"
                                                        aria-controls="offcanvasExample"
                                                    >
                                                        <i className="fa fa-navicon text-black" onClick={() => { playSound(); setToggle({ ...toggle, sidebar: true }) }} />
                                                        &nbsp;
                                                    </span></a>
                                                <button className="newordbtn" type="button">
                                                    New Orders
                                                </button>
                                            </div>
                                            <div className="col-lg-7">
                                                <form className="search-form searchcss" onSubmit={handleSearch}  >
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Search Here..."
                                                            onChange={(e) => { handleSearch(e) }}
                                                            value={searchText}
                                                        />
                                                        <span className="input-group-text searchicon" onClick={handleSearch} >
                                                            {(searchText?.length) ? <i className="fa fa-search" /> : ""}
                                                            &nbsp;
                                                        </span>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row flex-grow">
                                        <div className="col-lg-3 d-flex flex-column">
                                            <div className="sidemnuovr ps-4 mt-4 menunm">
                                                <div className="card card-rounded  grid-margin" onClick={() => { playSound(); setProducts(allData.products); setActiveTab('all'); setAlert(false) }} >
                                                    <a>
                                                        <div className={activeTab == 'all' ? "card-body currentcrd " : "card-body"}>
                                                            <span className="fw-bold">All Menu</span>
                                                            <br />
                                                            <p className="itemno">{totalItem} Items</p>
                                                        </div>
                                                    </a>
                                                </div>
                                                {menu.map((item, i) => {
                                                    return (
                                                        <>
                                                            <div className="card card-rounded  grid-margin" key={i}>
                                                                <a>
                                                                    <div className={activeTab == item.id ? "card-body currentcrd " : " card-body"} onClick={() => { setAlert(false); currentCategoryData(item.id) }} >
                                                                        <span className="fw-bold">{item.name}</span>
                                                                        <br />
                                                                        <p className="itemno">{getMenuItemQuantity()[item.id]?.length} Items</p>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </>

                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="col-lg-9 d-flex flex-column">
                                            <div className="filter_scrl mt-4" >
                                                <div className="row filtercrd">
                                                    {alert || !products?.length ? <div className="alert alert-info alert-danger fade show  text-center font-weight-bold" role="alert">
                                                        <h4>There are no items available in this category</h4>
                                                    </div> : ""}
                                                    {
                                                        products.map((item, i) => {
                                                            return (
                                                                <>
                                                                    <div className="col-lg-3" key={i} onClick={() => { handleOrder(item) }} >
                                                                        <a>
                                                                            <div className="card card-rounded  grid-margin">
                                                                                <div className="card-body">
                                                                                    <div className="text-right">
                                                                                        <span className="badge label-blue">
                                                                                            <i className="fa fa-star" />
                                                                                            &nbsp; Popular
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="mt-2">
                                                                                        <span className="name">{item.name}</span>
                                                                                        <p className="price">{currencyName}{item?.updated_price || item.proprice || item.price}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </>
                                                            )
                                                        })}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3  billcrd">
                                    <div className="address">
                                        <div className="mt-3 d-sm-flex justify-content-between">
                                            <div className="">
                                                <h3 className="me-2 fw-bold">{clientName}</h3>
                                                <p className="card-subtitle">
                                                    Order &nbsp;/&nbsp;Dine in
                                                </p>
                                                <p className="time">{allData?.created_date || formattedDate}</p>
                                            </div>
                                            <div className="me-4">
                                                <div className="ad">Ad</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <ul className="text-center billtab">
                                            <li className="pdlft20 active col-md-4">
                                                <a href="#">DINE IN</a>
                                            </li>
                                            <li className="col-md-4">
                                                <a href="#">DELIVERY</a>
                                            </li>
                                            <li className="col-md-4">
                                                <a href="#">PICK UP</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="card-title m-3 fw-bold">{(!orderItem?.length) ? "Your Order list is empty" : "Order Details"}</h4>
                                        <div className="tablediv">
                                            {
                                                orderItem.map((item, i) => {
                                                    const price = item?.updated_price || item.price
                                                    const totalAm = price * item?.quantity || 1
                                                    return (
                                                        <div className="itemdiv" key={i} >
                                                            <div className="row">
                                                                <div className="col-lg-4">
                                                                    <div className="wrapper">
                                                                        <p className="itemnm">{item.name || item.product_name}</p>
                                                                        <span className="text-muted text-small">
                                                                            {" "}
                                                                            M.R.P. : {currencyName}{item?.updated_price || item?.proprice || item.price} </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 d-flex align-items-center">
                                                                    <button className="quantityInput" onClick={() => { playSound(); if (item.quantity > 1) { updateQuantity(item.id, item.quantity - 1, i) } else { updateQuantity("removeItem", i) } }}  >
                                                                        <i className="fa fa-minus"  ></i>
                                                                    </button>
                                                                    <div className='quantityInput' >
                                                                        {item.quantity}
                                                                    </div>
                                                                    <button className="quantityInput" onClick={() => { playSound(); { updateQuantity(item.id, item.quantity + 1, i) } }}
                                                                    >
                                                                        <i className="fa fa-plus" ></i>
                                                                    </button>
                                                                </div>
                                                                <div className='col-lg-4 divright d-flex align-items-center' >
                                                                    {currencyName}{totalAm.toFixed(2)}
                                                                    {/* <i class="fa fa-window-close closeicon" aria-hidden="true"></i> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                        {!orderItem?.length ? "" : <div className="footerbtn">
                                            <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                <div className="d-flex">
                                                    <div className="wrapper">
                                                        <span className="totalwrd">item({orderItem?.length})</span>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <span>{currencyName}{totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                <div className="d-flex">
                                                    <div className="wrapper">
                                                        <span className="totalwrd">Discount({discountPer}%)</span>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <span>{currencyName}{discount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            {(allData?.service_charge_percent) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                <div className="d-flex">
                                                    <div className="wrapper">
                                                        <span className="totalwrd">{serviceChargeName}({serviceChargePerc}%)</span>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <span>{currencyName}{serviceCharge.toFixed(2)}</span>
                                                </div>
                                            </div>}
                                            {(allData?.tax_percent) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                <div className="d-flex">
                                                    <div className="wrapper">
                                                        <span className="totalwrd">CGST({cgstTaxPercent}%)</span>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <span>{currencyName}{cgstTax.toFixed(2)}</span>
                                                </div>
                                            </div>}
                                            {(allData?.tax_percent) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                <div className="d-flex">
                                                    <div className="wrapper">
                                                        <span className="totalwrd">SGST({sgstTaxPercent || 0}%)</span>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <span>{currencyName}{sgstTax.toFixed(2)}</span>
                                                </div>
                                            </div>}
                                            <div className="totalbtn text-center" onClick={submitOrder} >
                                                <span>
                                                    <button className="btn btn-primary btn-lg  savebtn">
                                                        <div className="wrapper d-flex align-items-center justify-content-between">
                                                            <div className="d-flex">
                                                                <div className="wrapper">
                                                                    <h4 className="fw-bold">Total &nbsp;{currencyName}{finalPrice.toFixed(2)}</h4>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <h4 className="fw-bold">
                                                                    Proceed Order &nbsp;&nbsp;
                                                                    <i
                                                                        className="fa fa-long-arrow-right"
                                                                        aria-hidden="true"
                                                                    />
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={toggle.sidebar ? "offcanvas offcanvas-start navmenu show" : "offcanvas offcanvas-start navmenu"}
                        tabIndex={-1}
                        id="offcanvasExample"
                        aria-labelledby="offcanvasExampleLabel"
                        role="dialog"
                        area-modal='true'
                    >
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title">All Menus</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                                onClick={() => { playSound(); setToggle({ ...toggle, sidebar: false }) }}
                            />
                        </div>
                        <div className="offcanvas-body">
                            <div>
                                <ul className="list-group navli">
                                    <Link to='/dashboard' onClick={() => playSound()} >
                                        <li className="">
                                            <i className="fa fa-home me-2" /> Dashboard
                                        </li></Link>
                                    <li className="">
                                        <i className="fa fa-cog me-2" /> Settings
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={toggle.modal ? "modal fade show d-block" : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content w-75">
                                <div className="modal-header pl-2 pr-0 pt-0 pb-0">
                                    <h3 className="modal-title ml-2" id="exampleModalLabel">{cartItem?.name}</h3>
                                    <button type="button" className="close " data-dismiss="modal" aria-label="Close" onClick={() => handleOrder({ type: "close" })} >
                                        <span style={{ fontSize: "40px" }} >&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body p-0">
                                    <div className=" d-flex flex-column"  >
                                        <h4 className=" d-flex flex-row justify-content-center mt-2" >Quantity</h4>
                                        <div className=" d-flex flex-row justify-content-center mt-2 mb-2" >
                                            <button className="btn btn-link px-2" onClick={() => { playSound(); if (quantity > 1) { setQuantity(quantity - 1) } else { setToggle({ ...toggle, lessQtty: true }) } }}
                                            >
                                                <i className="fa fa-minus"></i>
                                            </button>

                                            <input name="quantity" type="text" inputmode="numeric"
                                                value={quantity}
                                                onChange={(e) => { handleChange(e.target.value) }}
                                                style={{ width: '4em', paddingLeft: "6.5%" }} />
                                            <button className="btn btn-link px-2" onClick={() => { playSound(); setQuantity(quantity + 1); setToggle({ ...toggle, lessQtty: false }) }}
                                            >
                                                <i className="fa fa-plus"  ></i>
                                            </button>
                                        </div>
                                        <p className=" d-flex flex-row justify-content-center text-danger" >{(toggle.lessQtty) && "Quantity should not be less than 1"}</p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => handleOrder({ type: "close" })} >Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={() => handleOrder({ type: "Add_OrderTocart" })} >Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="modal fade bd-example-modal-lg" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                            <div className="modal-dialog m-0 modal-lg mw-100" role="document">
                                <div className="modal-content">
                                    <div className="modal-body p-0">
                                        <div className="container" id="printinvoice">
                                            <table
                                                style={{
                                                    width: "100%",
                                                    fontFamily: "PT Sans, sans-serif",
                                                    background: "#FFF",
                                                    tableLayout: "fixed"
                                                }}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table style={{ width: "100%", tableLayout: "fixed" }}>
                                                                <tbody>
                                                                    {" "}
                                                                    <tr>
                                                                        <th colSpan={2}>
                                                                            <p
                                                                                style={{
                                                                                    textAlign: "center",
                                                                                    padding: "5px 2px",
                                                                                    margin: 0,
                                                                                    fontSize: 14,
                                                                                    color: "black"
                                                                                }}
                                                                            >
                                                                                <strong>
                                                                                    Lava Pub &amp; Restaurant gh
                                                                                    <strong />
                                                                                </strong>
                                                                            </p>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2} style={{ fontSize: 13 }}>
                                                                            GSTIN : 09AAGCT6067R1ZD
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ fontSize: 13 }}>
                                                                            Date : <span>06, Sep 23</span>
                                                                        </td>
                                                                        <td style={{ fontSize: 13, textAlign: "right" }}>
                                                                            Time : <span>01:09 pm</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ fontSize: 13 }}>
                                                                            Table #: <span>Counter</span>
                                                                        </td>
                                                                        <td style={{ fontSize: 13, textAlign: "right" }}>
                                                                            <strong>
                                                                                Order # : <span>103</span>
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table style={{ tableLayout: "fixed", width: "100%" }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            style={{
                                                                                width: "55%",
                                                                                textAlign: "left",
                                                                                fontSize: 12,
                                                                                borderTop: "1px solid black",
                                                                                borderBottom: "1px solid black",
                                                                                verticalAlign: "middle"
                                                                            }}
                                                                        >
                                                                            Item
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "10%",
                                                                                textAlign: "center",
                                                                                fontSize: 12,
                                                                                borderTop: "1px solid black",
                                                                                borderBottom: "1px solid black",
                                                                                verticalAlign: "middle"
                                                                            }}
                                                                        >
                                                                            Qty
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "20%",
                                                                                textAlign: "center",
                                                                                fontSize: 12,
                                                                                borderTop: "1px solid black",
                                                                                borderBottom: "1px solid black",
                                                                                verticalAlign: "middle"
                                                                            }}
                                                                        >
                                                                            Rate
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "20%",
                                                                                textAlign: "right",
                                                                                fontSize: 12,
                                                                                borderTop: "1px solid black",
                                                                                borderBottom: "1px solid black",
                                                                                verticalAlign: "middle"
                                                                            }}
                                                                        >
                                                                            Amt
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style={{
                                                                                width: "55%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "left",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>tandoori paneer roll</strong>
                                                                        </td>{" "}
                                                                        <td
                                                                            style={{
                                                                                width: "10%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "center",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>1</strong>
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "20%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "center",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>₹100</strong>
                                                                        </td>{" "}
                                                                        <td
                                                                            style={{
                                                                                width: "20%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "right",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>₹100</strong>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        {" "}
                                                                        <td
                                                                            style={{
                                                                                width: "55%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "left",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>Bao Wow Pav</strong>
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "10%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "center",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>1</strong>
                                                                        </td>{" "}
                                                                        <td
                                                                            style={{
                                                                                width: "20%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "center",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>₹40</strong>
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "20%",
                                                                                fontSize: 13,
                                                                                color: "black",
                                                                                textAlign: "right",
                                                                                verticalAlign: "bottom",
                                                                                padding: "1px 0px"
                                                                            }}
                                                                        >
                                                                            <strong>₹40</strong>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                style={{
                                                                    width: "100%",
                                                                    tableLayout: "fixed",
                                                                    borderTop: "1px solid black !important"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        {" "}
                                                                        <td
                                                                            style={{
                                                                                width: "60%",
                                                                                fontSize: 13,
                                                                                textAlign: "right",
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px",
                                                                                paddingRight: 12
                                                                            }}
                                                                        >
                                                                            Subtotal
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "40%",
                                                                                textAlign: "right",
                                                                                fontSize: 13,
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px"
                                                                            }}
                                                                        >
                                                                            ₹140.00
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style={{
                                                                                width: "60%",
                                                                                fontSize: 13,
                                                                                textAlign: "right",
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px",
                                                                                paddingRight: 12
                                                                            }}
                                                                        >
                                                                            Discount(₹)
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "40%",
                                                                                textAlign: "right",
                                                                                fontSize: 13,
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px"
                                                                            }}
                                                                        >
                                                                            ₹0.00
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            style={{
                                                                                width: "60%",
                                                                                fontSize: 13,
                                                                                textAlign: "right",
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px",
                                                                                paddingRight: 12
                                                                            }}
                                                                        >
                                                                            SCH(5%)
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "40%",
                                                                                textAlign: "right",
                                                                                fontSize: 13,
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px"
                                                                            }}
                                                                        >
                                                                            ₹7.00
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        {" "}
                                                                        <td
                                                                            style={{
                                                                                width: "60%",
                                                                                fontSize: 13,
                                                                                textAlign: "right",
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px",
                                                                                paddingRight: 12
                                                                            }}
                                                                        >
                                                                            CGST(6%)
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                width: "40%",
                                                                                fontSize: 13,
                                                                                textAlign: "right",
                                                                                verticalAlign: "bottom",
                                                                                padding: "3px 0px"
                                                                            }}
                                                                        >
                                                                            ₹8.82
                                                                        </td>
                                                                    </tr>
                                                                    <tr> </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div class="text-center mt-5">
                    <div class="spinner-border" role="status">
                    </div>
                </div>}
        </>
    )

}
export default Pos;