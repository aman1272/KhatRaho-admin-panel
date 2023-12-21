import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const Users = () => {

    const [users, setUsers] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
        getUsers()
    }, []);


    useEffect(() => {
        setPage(0)
        getUsers()
    }, [perPage]);

    useEffect(() => {
        getUsers()
    }, [page]);


    const getUsers = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/get/users",
                method: "GET",
                headers: {
                    'limit': perPage,
                    'skip': page,
                }
            })
            if (!response.data.error) {
                if (!response.data?.data?.length) { setAlert({ noUsers: true }) }
                setUsers(response.data.data)
                setAllData({ ...allData, Users: response?.data?.data })
            } else {
                setAlert({ ...alert, modal: true, err: true })
                setMessage(response.data.message)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setAlert({ ...alert, modal: true, err: true })
            setMessage(error)
        }
    };
    const usersBoundary = users[0]?.total_counts


    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Users?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {
            setAlert({ noProducts: true })
            setUsers(filteredResults);

        } else {
            setAlert({ noProducts: false })
            setUsers(filteredResults);
        }
    };

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    const handleChange = async (e, eater_id) => {
        const { name, value } = e.target
        try {
            const response = await axios({
                url: "http://localhost:8000/edit/user/status",
                method: "PUT",
                headers: {
                    eater_id
                },
                data: { [name]: value }
            })
            setMessage(response.data.message)
            if (!response.data.error) {
                setAlert({ ...alert, modal: true, eater_id })
            } else {
                setAlert({ ...alert, modal: true, err: true, eater_id })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setAlert({ ...alert, modal: true, err: true })
            setMessage(error)
        }
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
            <Sidebar name={"Users"} >
                <div className=" content-wrapper " >
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body ">
                            <h3 className="ukhd mb-3" >All Users</h3>
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
                                            <th>User Id</th>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th>Address</th>
                                            <th>Region</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {(!users.length) ? <tr>
                                        <td colSpan="7" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                        :
                                        (users?.map((item, i) => {

                                            const timestamp = item.joining_date * 1000
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);

                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
                                                        <tr key={i}>
                                                            <td>
                                                                <h6 className="text-dark font-weight">{item.eater_id}</h6>
                                                            </td>
                                                            <td>
                                                                {(item.name) && <h5 className="text-dark font-weight d-flex align-items-center">{item.name}<span className="mdi mdi-bell" ></span></h5>}
                                                                <span className={`table-color-col bg-warning text-light font-weight`} >{formattedDate}</span>
                                                            </td>
                                                            <td>
                                                                <h6 className="text-dark font-weight">{item.mobile}</h6>
                                                            </td>
                                                            <td>
                                                                <h6 className="text-dark font-weight">{item.address}</h6>
                                                            </td>
                                                            <td>
                                                                <h6 className="text-dark font-weight">{item.region}</h6>
                                                            </td>
                                                            <td className="width-status-dropdown" >
                                                                <select className="form-select " name="status" onChange={(e) => handleChange(e, item.eater_id)} >
                                                                    <option className="d-none" value={item.status} selected={(item.status == 0) ? "Unverified" : (item.status == 1) ? "Verified" : (item.status == 2) ? "Suspended" : (item.status == 3) ? "Terminated" : "Select Type"}>
                                                                        {(item.status == 0) ? "Unverified" : (item.status == 1) ? "Verified" : (item.status == 2) ? "Suspended" : (item.status == 3) ? "Terminated" : "Select Type"}

                                                                    </option>
                                                                    <option value={0}>Unverified</option>
                                                                    <option value={1}>Verified</option>
                                                                    <option value={2}>Suspended</option>
                                                                    <option value={3}>Terminated</option>
                                                                </select>
                                                                {alert.modal && alert.eater_id == item.eater_id ? <div className={`alert ${alert.err ? "alert-danger" : "alert-success"} alert-dismissible fade show mt-2`} role="alert">
                                                                    {message}  <button
                                                                        type="button"
                                                                        className="btn-close"
                                                                        data-bs-dismiss="offcanvas"
                                                                        aria-label="Close"
                                                                        onClick={() => { setAlert({ ...alert, modal: false, err: false }) }}
                                                                    />
                                                                </div> : ""}
                                                            </td>
                                                            <td  >
                                                                <div className="d-flex flex-column" >
                                                                    <i className="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { }} ></i>
                                                                </div>
                                                            </td>
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

                                    {(Math.ceil(usersBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(usersBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((usersBoundary / perPage) >= newPage) {
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
export default WithBootstrap(Users)