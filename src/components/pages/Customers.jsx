import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const Customers = () => {
    const navigate = useNavigate();
    const currency = ` ₹ `

    const [customers, setCustomers] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        getCustomers()
    }, []);


    useEffect(() => {
        setPage(0)
        getCustomers()
    }, [perPage]);

    useEffect(() => {
        getCustomers()
    }, [page]);


    const getCustomers = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/customers",
                method: "GET",
                headers: {
                    'limit': perPage,
                    'skip': page,
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
            setCustomers(filteredResults);

        } else {
            setAlert({ noProducts: false })
            setCustomers(filteredResults);
        }
    };

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    return (
        <>
            <Sidebar name={"Customers"} >
                <div className=" content-wrapper " >
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body ">
                            <h3 className="ukhd mb-3" >All Customers</h3>
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
                            {(!!customers.length) && <div className="table-responsive table-alone mt-1 ">
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
                                                <tbody className="border-table-row " >
                                                    <tr key={i}>
                                                        <td>
                                                            <h6>{i + page + 1}</h6>
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

                                    {(Math.ceil(customerBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(customerBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((customerBoundary / perPage) >= newPage) {
                                                setPage(newPage)
                                            }
                                        }}
                                    ></i>
                                </div>
                            </div >
                            }
                            {alert.noProducts && <div className="d-flex justify-content-center table-alone"><h3>There are no Customers</h3></div>}
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    )
}
export default WithBootstrap(Customers)