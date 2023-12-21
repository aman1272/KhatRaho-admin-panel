import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const Staffs = () => {
    const navigate = useNavigate()
    const [staffs, setStaffs] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
        getStaffs()
    }, []);


    useEffect(() => {
        setPage(0)
        getStaffs()
    }, [perPage]);

    useEffect(() => {
        getStaffs()
    }, [page]);


    const getStaffs = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/get/staff",
                method: "GET",
                headers: {
                    'limit': perPage,
                    'skip': page,
                }
            })
            if (!response.data.error) {
                if (!response.data?.data?.length) { setAlert({ noUsers: true }) }
                setStaffs(response.data.data)
                setAllData({ ...allData, Staffs: response?.data?.data })
            } else {
                setAlert({ ...alert, modal: true, err: true })
                setMessage(response.data.message)
            }
        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };
    const staffsBoundary = staffs[0]?.total_counts


    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Staffs?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {
            setAlert({ noProducts: true })
            setStaffs(filteredResults);

        } else {
            setAlert({ noProducts: false })
            setStaffs(filteredResults);
        }
    };

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    const handleType = async (userId, e) => {
        const { name, value } = e.target
        console.log(name, value, userId)
        try {
            const response = await axios({
                url: "http://localhost:8000/edit/staff",
                method: "PUT",
                headers: {
                    userId, changetype: true
                },
                data: { [name]: value }
            })
            setMessage(response.data.message)
            if (!response.data.error) {
                setAlert({ ...alert, modal: true, userId })
            } else {
                setAlert({ ...alert, modal: true, err: true, userId })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    }

    const manageStaffStatus = async (userId, stts) => {
        let status = (stts == 1) ? 0 : 1
        const url = "http://localhost:8000/edit/staff"
        try {
            await axios({
                url: url,
                method: "PUT",
                headers: {
                    userId
                },
                data: {
                    status
                }
            })
            getStaffs()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }



    const manageAction = (id, action) => {
        if (action == "edit") {
            window.sessionStorage.setItem("userId", id)
            navigate('/staff/edit')
        }
        else {
            navigate('/staff/edit')
        }
    }

    return (
        <>
            <Sidebar name={"Staffs"} >
                <div className=" content-wrapper " >
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body ">
                            <div className="d-flex justify-content-between vsalign mb-2 mt-2" >
                                <div>
                                    <h3 className="ukhd mb-3" >All Staffs</h3>
                                </div>
                                <div>
                                    <span class="btn btn-warning text-black mb-0 me-0" onClick={() => { manageAction() }} ><i class="menu-icon mdi mdi-account vsalign"></i>Add Staff</span>
                                </div>
                            </div>
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
                                            <th>S.No.</th>
                                            <th>Name</th>
                                            <th>Number</th>
                                            <th>Username</th>
                                            <th>Status</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {(!staffs.length) ? <tr>
                                        <td colSpan="7" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                        :
                                        staffs?.map((item, i) => {

                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
                                                        <tr key={i}>
                                                            <td>
                                                                <h6 className="text-dark font-weight">{i + page + 1}</h6>
                                                            </td>
                                                            <td>
                                                                <h5 className="text-dark font-weight">{item.name}</h5>
                                                            </td>
                                                            <td>
                                                                <h6 className="text-dark font-weight">{item.mobile_num}</h6>
                                                            </td>
                                                            <td>
                                                                <h6 className="text-dark font-weight">{item.email}</h6>
                                                            </td>
                                                            <td>
                                                                <div className={`status-btn-parent ${(item.status) ? "status-on-parent-color " : "status-off-parent-color "}`} onClick={() => manageStaffStatus(item.userId, item.status)} >
                                                                    <div className={`status-btn-on ${(!item.status) ? "hidden-on-btn-color" : " "}  `}>On</div>
                                                                    {(!item.status) && <div className="status-btn-off">Off</div>}
                                                                </div>
                                                            </td>
                                                            <td className="width-status-dropdown"  >
                                                                    <select className="form-select mt-2" name="type" onChange={(e) => handleType(item.userId, e)} >
                                                                        <option className="d-none" value={item.type} selected={(item.type) ? "Staff" : "Admin"}>
                                                                            {(item.type) ? "Staff" : "Admin"}
                                                                        </option>
                                                                        <option value={0}>Admin</option>
                                                                        <option value={1}>Staff</option>
                                                                    </select>
                                                                    {alert.modal && alert.userId == item.userId ? <div className={`alert ${alert.err ? "alert-danger" : "alert-success"} alert-dismissible fade show mt-2`} role="alert">
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
                                                                    <i class="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { manageAction(item.userId, "edit") }} ></i>
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

                                    {(Math.ceil(staffsBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(staffsBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((staffsBoundary / perPage) >= newPage) {
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
export default WithBootstrap(Staffs)