import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const Orders = () => {
    const navigate = useNavigate();
    const currency = ` ₹ `

    const [orders, setOrders] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        getOrder()
    }, []);


    useEffect(() => {
        setPage(0)
        getOrder()
    }, [perPage]);

    useEffect(() => {
        getOrder()
    }, [page]);


    const getOrder = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/orders",
                method: "GET",
                headers: {
                    'limit': perPage,
                    'skip': page,
                }
            })
            setToggle({ activeTab: "Orders" })
            if (!response.data?.error) {
                if (!response.data?.data?.length) { setAlert({ noOrders: true }) }
                setAllData({ ...allData, Customers: response?.data?.data })
                setOrders(response?.data?.data)
            } else if (!response?.data?.data?.length || response?.data?.error) {
                setAlert({ noOrders: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const orderBoundary = orders[0]?.TotalItem

    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Customers?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {
            // setSearchTerm('')
            setAlert({ noOrders: true })
            setOrders(filteredResults);

        } else {
            setAlert({ noOrders: false })
            setOrders(filteredResults);
        }
    };

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

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

    return (
        <>
            <Sidebar name={"Orders"} >
                <div className=" content-wrapper" >
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body">
                            <h3 className="ukhd mb-3 mt-2" >All Orders</h3>
                            <div className="d-flex justify-content-between align-items-start" >
                                <div className="d-flex align-item-center max-width ">
                                    <p className="p-0" >Show records per page :</p>
                                    <div>
                                        <div className="dropdown show" onClick={() => { if (!toggle.select) { setToggle({ ...toggle, select: true }) } else { setToggle({ ...toggle, select: false }) } }} >
                                            <a className="btn btn-secondary btn-sm dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                {perPage}
                                            </a>
                                            <div className={toggle.select ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuLink">
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(10)}  >10</a>
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(25)} >25</a>
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(50)}  >50</a>
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(100)}  >100</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    className="searchbar"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                         <div className="table-responsive table-alone mt-1 ">
                                <table className="table select-table ">
                                    <thead>
                                        <tr>
                                            <th>Order Id</th>
                                            <th>Orders</th>
                                            <th>Client Details</th>
                                            <th> Amount</th>
                                            <th className="w-25" >Suggestions</th>
                                            <th>Order Status</th>
                                            <th>Payment Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {
                                    (!orders.length) ? <tr>
                                    <td colSpan="7" className="text-center">
                                        No data found
                                    </td>
                                </tr>
                                    :
                                    orders?.map((item, i) => {
                                        const timestamp = item.creation_date * 1000
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
                                                <tbody className="border-table-row " >
                                                    <tr key={i}>
                                                        <td>
                                                            <p className="text-dark font-weight"  >{item.order_id}</p>
                                                        </td>
                                                        <td>
                                                            <h5 className="text-dark font-weight" >#{item.qr_code_number}</h5>
                                                            <p className="text-dark font-weight" >Table No-{item.fooder_table}</p>
                                                            <p className="text-dark font-weight" >{formattedDate}</p>
                                                        </td>
                                                        <td >
                                                            <h5 className="text-dark font-weight" ><span class="mdi mdi-account"></span>{item.eater_name}</h5>
                                                            <p className="text-dark font-weight" ><span class="mdi mdi-phone">{item.eater_phonenumber}</span></p>
                                                        </td>
                                                        <td>
                                                            <h4 className="text-danger">{currency}{item?.total?.toFixed(2)}</h4>
                                                        </td>
                                                        <td >
                                                            <p className="text-dark font-weight" >{item.eater_suggestions}</p>
                                                        </td>
                                                        <td>
                                                            <div className={`table-color-col font-weight ${status_class}`}>{status}</div>
                                                        </td>
                                                        <td>
                                                            <span className={`table-color-col font-weight ${payment_status}`} >{payment_status}</span>
                                                        </td>
                                                        <td className="d-flex justify-center flex-column" >
                                                            <button type="button" class="btn btn-success btn-sm" onClick={() => { navigate('/order/details'); window.sessionStorage.setItem("order_id", `${item.order_id}`) }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-content-save-edit-outline vsalign"></i><span>Details</span></div></button>
                                                            <button type="button" class="btn btn-warning btn-sm mt-1 mb-1 " onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign "></i><span>Bill</span></div></button>
                                                            <button type="button" class="btn btn-dark btn-sm" onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign"></i><span>KOT</span></div></button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </>
                                        )

                                    })}
                                </table>
                                <div className="custom-footer mt-3" >
                                    <i className="mdi mdi-chevron-double-left pagination-button"
                                        onClick={() => {
                                            const newPage = page - perPage;
                                            if (newPage >= 0) setPage(newPage)
                                        }}
                                    ></i>

                                    {(((page + perPage) / perPage) - 1) !== 0 && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page - perPage;
                                            if (newPage >= 0) setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) - 1)}</span>}

                                    <span className="pagination-active" >{Math.ceil((page + perPage) / perPage)}</span>

                                    {(Math.ceil(orderBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(orderBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((orderBoundary / perPage) >= newPage) {
                                                setPage(newPage)
                                            }
                                        }}
                                    ></i>
                                </div>
                            </div >
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    )
}
export default WithBootstrap(Orders)