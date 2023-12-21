import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const SupportTicket = () => {
    const navigate = useNavigate();
    const currency = ` ₹ `

    const [ticket, setTicket] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        getTicket()
    }, []);


    useEffect(() => {
        setPage(0)
        getTicket()
    }, [perPage]);

    useEffect(() => {
        getTicket()
    }, [page]);


    const getTicket = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/get/support-ticket/data",
                method: "GET",
                headers: {
                    'limit': perPage,
                    'skip': page,
                }
            })
            if (!response.data.error) {
                if (!response.data?.data?.length) { setAlert({ noCustomers: true }) }
                setTicket(response.data.data)
                setAllData({ ...allData, Customers: response?.data?.data })
            } else {
                setAlert({ noCustomers: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const ticketBoundary = ticket[0]?.total_counts


    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Customers?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {
            // setSearchTerm('')
            setAlert({ noProducts: true })
            setTicket(filteredResults);

        } else {
            setAlert({ noProducts: false })
            setTicket(filteredResults);
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
        return ` ${day} ${month} ${year}  ${hours}:${formattedMinutes} ${ampm}`;
    }

    return (
        <>
            <Sidebar name={"Support Tickets"} >
                <div className=" content-wrapper " >
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body ">
                            <h3 className="ukhd mb-3" >All Support Tickets</h3>
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
                                            <th>Ticket No.</th>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th>Subject</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {(!ticket.length) ? <tr>
                                        <td colSpan="7" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                        :
                                        (ticket?.map((item, i) => {


                                            const timestamp = item.created_date * 1000
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);
                                            let status
                                            let status_class
                                            if (item.status == 0) { status = "Open"; status_class = "order-reject" }
                                            else if (item.status == 1) { status = "Closed"; status_class = "order-accept" }

                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
                                                        <tr key={i}>
                                                            <td>
                                                                <h6>#{i + page + 1}</h6>
                                                            </td>
                                                            <td>
                                                                {(item.name) && <h5 className="text-dark font-weight d-flex align-items-center"><span className="mdi mdi-account" ></span>{item.name}<span className="mdi mdi-bell" ></span></h5>}
                                                                <h6>{item.username}</h6>
                                                                <h6 className={`table-color-col bg-info text-light mt-1`}>{item.ip}</h6>
                                                                <h6 className={`table-color-col bg-warning text-light font-weight`} >{formattedDate}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.landline}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.subject}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.description}</h6>
                                                            </td>
                                                            <td>
                                                                <h6 className={`table-color-col font-weight ${status_class}`} >{status}</h6>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex flex-column" >
                                                                    <i class="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { }} ></i>
                                                                </div>                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )

                                        }))}
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

                                    {(Math.ceil(ticketBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(ticketBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((ticketBoundary / perPage) >= newPage) {
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
export default WithBootstrap(SupportTicket)