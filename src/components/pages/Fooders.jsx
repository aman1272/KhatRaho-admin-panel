import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const Fooders = () => {
    const navigate = useNavigate();

    const [fooders, setFooders] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getFooders()
    }, []);


    useEffect(() => {
        setPage(0)
        getFooders()
    }, [perPage]);

    useEffect(() => {
        getFooders()
    }, [page]);


    const getFooders = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/fooders",
                method: "GET",
                headers: {
                    'limit': perPage,
                    'skip': page,
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


    const manageAction = (id, action) => {
        if (action == "edit") {
            window.sessionStorage.setItem("fooder_id", id)
            navigate('/fooder/edit')
        }
        else if (action == "menu") {
            window.sessionStorage.setItem("fooder_id", id)
            navigate('/menus')
        }
        else if (action == "product") {
            window.sessionStorage.setItem("fooder_id", id)
            navigate('/products')
        }
        else if (action == "documents") {
            window.sessionStorage.setItem("fooder_id", id)
            navigate('/document')
        }

    }

    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Fooders?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {
            setAlert({ noFooders: true })
            setFooders(filteredResults);

        } else {
            setAlert({ noFooders: false })
            setFooders(filteredResults);
        }
    };

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    const handleChange = async (e, fooder_id) => {
        const { name, value } = e.target
        try {
            const response = await axios({
                url: "http://localhost:8000/edit/fooder/status",
                method: "PUT",
                headers: {
                    fooder_id
                },
                data: { [name]: value }
            })
            console.log("response update API", response.data)
            if (response.data.success) {
                if (!response.data?.data?.length) {
                    setMessage(response.data.message)
                    setAlert({ ...alert, modal: true, fooder_id })
                }
            } else {
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
            <Sidebar name={"Fooders"}>
                <div className=" content-wrapper" >
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body">
                            <h3 className="ukhd mb-3" >All Fooders</h3>
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
                                            {/* <th>S.NO.</th> */}
                                            <th>Fooder Id</th>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th className="W-25" > Address</th>
                                            <th>Region</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {
                                        (!fooders.length) ? <tr>
                                            <td colSpan="7" className="text-center">
                                                No data found
                                            </td>
                                        </tr>
                                            :
                                            fooders?.map((item, i) => {

                                                const timestamp = item.joining_date * 1000
                                                const currentDate = new Date(timestamp);
                                                const formattedDate = formatDate(currentDate);
                                                let status
                                                if (item.is_approved) {
                                                    switch (item.is_approved) {
                                                        case 0:
                                                            status = "Unverified";
                                                            break;
                                                        case 1:
                                                            status = "Verified";
                                                            break;
                                                        case 2:
                                                            status = "Suspended";
                                                            break;
                                                        case 3:
                                                            status = "Terminated";
                                                            break;
                                                    }
                                                }
                                                return (
                                                    <>
                                                        <tbody className="border-table-row " >
                                                            <tr key={i}>
                                                                <td>
                                                                    {/* <h6 className="text-dark font-weight"  >{i + page + 1}</h6>   */}
                                                                    <h6 className="text-dark font-weight"  >{item.fooder_id}</h6>
                                                                </td>
                                                                <td>
                                                                    <h5 className="text-dark font-weight" >{item.name}</h5>
                                                                    <h6 className="text-dark font-weight" >{item.username}</h6>
                                                                    <span className={`table-color-col bg-warning text-light font-weight`} >{formattedDate}</span>
                                                                </td>
                                                                <td>
                                                                    <p className="text-dark font-weight" >{item.landline}</p>
                                                                    <p className="text-dark font-weight" >{item.login_mobile_number}</p>
                                                                </td>
                                                                <td>
                                                                    <p className="text-dark font-weight" >{item.address}</p>
                                                                </td>
                                                                <td>
                                                                    <p className="text-dark font-weight" >{item.location_name}</p>
                                                                </td>
                                                                <td className="width-status-dropdown" >
                                                                    <select className="form-select" name="status" onChange={(e) => handleChange(e, item.fooder_id)} >
                                                                        <option className="d-none" value={item.status} selected={status}>
                                                                            {status}
                                                                        </option>
                                                                        <option value={0}>Unverified</option>
                                                                        <option value={1}>Verified</option>
                                                                        <option value={2}>Suspended</option>
                                                                        <option value={3}>Terminated</option>
                                                                    </select>
                                                                    {alert.modal && alert.fooder_id == item.fooder_id ? <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                                                                        {message}  <button
                                                                            type="button"
                                                                            className="btn-close"
                                                                            data-bs-dismiss="offcanvas"
                                                                            aria-label="Close"
                                                                            onClick={() => { setAlert({ ...alert, modal: false }) }}
                                                                        />
                                                                    </div> : ""}
                                                                </td>
                                                                <td >
                                                                    <div className="d-flex flex-column" >
                                                                        <button type="button" class="btn btn-dark btn-sm mb-2" onClick={() => { manageAction(item.fooder_id, "edit") }} >Edit</button>
                                                                        <button type="button" class="btn btn-warning btn-sm mb-2" onClick={() => { manageAction(item.fooder_id, "menu") }} ><span className="d-flex justify-content-center margin" ><i class="menu-icon mdi mdi-floor-plan"></i><span>Menu</span></span></button>
                                                                        <button type="button" class="btn btn-success btn-sm mb-2" onClick={() => { manageAction(item.fooder_id, "product") }} ><span className="d-flex justify-content-center" ><i class="menu-icon mdi mdi-silverware-fork-knife"></i><span>Products</span></span></button>
                                                                        <button type="button" class="btn btn-primary btn-sm" onClick={() => { manageAction(item.fooder_id, "documents") }} ><span className="d-flex justify-content-center" ><i class=" menu-icon mdi mdi-folder"></i><span>Documents</span></span></button>
                                                                    </div>
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

                                    {(Math.ceil(fooderBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(fooderBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((fooderBoundary / perPage) >= newPage) {
                                                setPage(newPage)
                                            }
                                        }}
                                    ></i>
                                </div>
                            </div >
                        </div>
                    </div>
                </div>
            </Sidebar >
        </>
    )
}
export default WithBootstrap(Fooders)