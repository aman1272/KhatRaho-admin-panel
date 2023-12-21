import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const Menu = () => {
    const navigate = useNavigate();

    const [menu, setMenu] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})
    const [searchTerm, setSearchTerm] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        getMenu()
    }, []);


    useEffect(() => {
        setPage(0)
        getMenu()
    }, [perPage]);

    useEffect(() => {
        getMenu()
    }, [page]);


    const getMenu = async () => {
        let fooder_id = window.sessionStorage.getItem('fooder_id')
        console.log("fooder_id", fooder_id)
        try {
            const response = await axios({
                url: "http://localhost:8000/fooders/menus",
                method: "GET",
                headers: {
                    'limit': perPage,
                    'skip': page,
                    fooder_id
                }
            })
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


    const deleteMenu = async () => {
        const url = "http://localhost:8000/menu/delete"
        try {
            const response = await axios({
                url: url,
                method: "POST",
                data: {
                    id
                }
            })
            setId(null)
            setToggle({ ...toggle, modal: false })
            getMenu()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Menu?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {
            setAlert({ noMenu: true })
            setMenu(filteredResults);

        } else {
            setAlert({ noMenu: false })
            setMenu(filteredResults);
        }
    };

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    const manageAction = (id, action) => {
        if (action == "edit") {
            window.sessionStorage.setItem("menuId", id)
            navigate('/menu/edit')
        }
        else if (action == "delete") {
            setToggle({ ...toggle, modal: true }); setId(id)
        }
        else {
            navigate('/menu/edit')
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
        return ` ${day} ${month} ${year}  ${hours}:${formattedMinutes} ${ampm}`;
    }

    return (
        <>
            <Sidebar name={"Menus"} >
                <div className={(toggle.modal) ? " content-wrapper opacity-50 " : " content-wrapper"} >
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body ">
                            <div className="d-flex justify-content-between vsalign mb-2 mt-2" >
                                <div>
                                    <h3 className="ukhd mb-3" >All Menus</h3>
                                </div>
                                {/* <div>
                                    <span class="btn btn-warning text-black mb-0 me-0" onClick={() => manageAction()} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Category/ Menus</span>
                                </div> */}
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
                                            <th> Fooder</th>
                                            <th className="w-25" >Description</th>
                                        </tr>
                                    </thead>
                                    {(!menu.length) ? <tr>
                                        <td colSpan="7" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                        : (menu?.map((item, i) => {
                                            let status = (item.status) ? "Available" : "Unavailable"
                                            const timestamp = item.entry_date * 1000
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);

                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
                                                        <tr key={i}>
                                                            <td>
                                                                <h6 className="text-dark font-weight" >{i + page + 1}</h6>
                                                            </td>
                                                            <td>
                                                                <h5 className="text-dark font-weight" >{item.menu_name}</h5>
                                                                <span className="text-dark font-weight" >{status}</span><br />
                                                                {(item.tags) && <span className={`table-color-col bg-info text-light mt-1`} >{item.tags}</span>}
                                                            </td>
                                                            <td>
                                                                <h5 className="text-dark font-weight" >  {item.fooder_name}</h5>
                                                                <span className={`table-color-col bg-warning text-light font-weight`} >{formattedDate}</span>
                                                            </td>
                                                            <td>
                                                                <h6>{item.description}</h6>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )
                                        }))
                                    }

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

                                    {(Math.ceil(menuBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(menuBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((menuBoundary / perPage) >= newPage) {
                                                setPage(newPage)
                                            }
                                        }}
                                    ></i>
                                </div>
                            </div >
                        </div>
                    </div>
                </div>
                <div className={toggle.modal ? "modal fade show d-block" : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content w-100">

                            <div className="delete-modal">
                                <div className=" d-flex flex-column"  >
                                    <h4 className=" d-flex flex-row justify-content-center mt-2" >Are you sure ? You want to delete this.</h4>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-warning margin-between" onClick={() => deleteMenu()} >Yes</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { setToggle({ ...toggle, modal: false }) }} >No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    )
}
export default WithBootstrap(Menu)