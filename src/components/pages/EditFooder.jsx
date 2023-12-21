import { useState, useEffect } from "react";
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';


const EditFooder = () => {
    const navigate = useNavigate()
    const [fooderDetail, setFooderDetail] = useState({ address: "", name: "", username: "", tax2_value: "", tax2_name: "", tax1_value: "", daily_hrs: "", facilities: "", service_charge: "", type: "", gstin: "", fssai_number: "", upi_address: "", landline: "", started_on: "" })
    const [showComponent, setShowComponent] = useState(false);
    const [time, setTime] = useState({})
    const [facility, setFacility] = useState([])
    const [qrImage, setQrImage] = useState("");
    const [logo, setLogo] = useState("");

    const id = window.sessionStorage.getItem('fooder_id')

    const closeScreen = () => {
        window.sessionStorage.removeItem("fooder_id")
        navigate("/fooders")
    }

    useEffect(() => {
        if (id) {
            getFooder()
        }
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);

    const getFooder = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/fooders",
                method: "GET",
                headers: {
                    id, 
                    editfooder: true
                }
            })
            console.log("res",response.data)
            const { address, name, tax2_value, tax2_name, tax1_value, service_charge, type, gstin, fssai_number, upi_address, landline, started_on } = response?.data?.data[0];
            const { deSeria_daily_hrs, deserialized_facilities } = response?.data
            setTime(deSeria_daily_hrs)
            setFacility(createArrayFromIndexes(deserialized_facilities))
            const formattedDate = formatDateToYYYYMMDD(started_on)
            setFooderDetail({ address, name, tax2_value, tax2_name, tax1_value, service_charge, type, gstin, fssai_number, upi_address, landline, formattedDate })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const createArrayFromIndexes = (indexes) => {
        const resultArray = new Array(9).fill(false);
        for (const index of indexes) {
            if (index >= 0 && index < 9) {
                resultArray[index] = true;
            }
        }
        return resultArray;
    }

    const formatDateToYYYYMMDD = (inputDate) => {
        const parsedDate = new Date(inputDate);
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
        const day = parsedDate.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const updateFooder = async () => {
        const date = formatDate(fooderDetail.formattedDate)
        const facilities = findTrueIndices(facility)
        const url = "http://localhost:8000/edit/fooder"
        const finaldata = JSON.stringify({ ...fooderDetail, logo, qrImage, time, date, facilities })
        console.log("final Data", finaldata)
        try {
            const response = await axios({
                url: url,
                method: "PUT",
                headers: {
                    id
                },
                data: { data: finaldata }
            })
            if (!response.data.error) {
                closeScreen()
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (props) => {
        setFooderDetail({ ...fooderDetail, [props.target.name]: props.target.value })
    }

    const handleChangeCheckBox = (isChecked, index) => {
        const newFacilities = [...facility];
        newFacilities[index] = isChecked;
        setFacility(newFacilities);
    }

    const handleChangeTime = (props, index, field) => {
        const newValue = props.target.value
        const updatedData = { ...time };
        updatedData[index] = { ...updatedData[index], [field]: newValue };
        setTime(updatedData);
    }

    const formatDate = (inputDate) => {
        const dateParts = inputDate.split("-");
        if (dateParts.length === 3) {
            const year = dateParts[0];
            const month = dateParts[1];
            const day = dateParts[2];
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            const formattedDate = `${day} ${months[parseInt(month) - 1]} ${year}`;
            return formattedDate;
        }
        return inputDate;
    }

    const findTrueIndices = (arr) => {
        const trueIndices = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                trueIndices.push(`${i}`);
            }
        }
        return trueIndices;
    }

    return (
        <>
            {
                showComponent ?
                    <Sidebar name={"Fooders"}>
                        <div className="main-panel">
                            <div className="content-wrapper">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="d-flex justify-content-between m-1 p-1 align-items-baseline " >
                                            <h3 className="ukhd mb-3">Fooders</h3>
                                            <button type="button" class="btn btn-danger btn-sm" onClick={closeScreen}  ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>
                                        </div>
                                        <div className="row flex-grow">
                                            <div className="col-12 grid-margin stretch-card">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <div className="d-sm-flex justify-content-between align-items-start">
                                                            <div className="valign">
                                                                <h4 className="card-title card-title-dash mb-3">
                                                                    Edit Fooders Details
                                                                </h4>
                                                            </div>
                                                            <div className="valign"></div>
                                                        </div>
                                                        <form className="forms-sample" onKeyPress={(event) => (event.key === 'Enter') ? updateFooder("profile") : ''} >
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> Fooder's Name </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Ener Fooder Name"
                                                                            name="name"
                                                                            value={fooderDetail.name}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> Started On </label>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            placeholder="Started On"
                                                                            name="formattedDate"
                                                                            value={fooderDetail.formattedDate}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label>Landline</label>
                                                                        <div className="input-group mb-3">
                                                                            <div className="input-group-append">
                                                                                <span className="input-group-text mdi mdi-phone">
                                                                                </span>
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Landline"
                                                                                name="landline"
                                                                                value={fooderDetail.landline}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> UPI Address </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            readOnly=""
                                                                            defaultValue="indoreatorswebcreati.62015066@hdfcbank"
                                                                            name="upi_address"
                                                                            value={fooderDetail.upi_address}
                                                                            onChange={(e) => handleChange(e)}

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> FSSAI Number </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Ener FSSAI Number"
                                                                            name="fssai_number"
                                                                            value={fooderDetail.fssai_number}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> GSTIN </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Ener GSTIN"
                                                                            name="gstin"
                                                                            value={fooderDetail.gstin}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> CGST + SGST </label>
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Price"
                                                                                name="tax1_value"
                                                                                value={fooderDetail.tax1_value}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                            <span className="input-group-text">%</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> Tax Name 2 </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Ener Fooder Name"
                                                                            value={fooderDetail.tax2_name}
                                                                            name="tax2_name"
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> Tax 2 Value </label>
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Price"
                                                                                name="tax2_value"
                                                                                value={fooderDetail.tax2_value}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                            <span className="input-group-text">%</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="form-group">
                                                                        <label>Address</label>
                                                                        <textarea
                                                                            className="form-control"
                                                                            name="address"
                                                                            placeholder="Enter Address"
                                                                            rows={1}
                                                                            defaultValue={""}
                                                                            value={fooderDetail.address}
                                                                            onChange={(e) => handleChange(e)}

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> Choose Logo </label>
                                                                        <br />
                                                                        {fooderDetail.logo && (
                                                                            <img
                                                                                src={fooderDetail.logo}
                                                                                className="mb-2"
                                                                                alt="logo"
                                                                                style={{ width: "120px", height: "auto" }}
                                                                            />
                                                                        )}
                                                                        <input
                                                                            className="form-control h-100"
                                                                            type="file"
                                                                            id="formFile"
                                                                            name="logo"
                                                                            onChange={(e) => setLogo(e.target.files[0])}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="form-group">
                                                                        <label> Upload QR Image </label>
                                                                        {fooderDetail.upi_image && (
                                                                            <img
                                                                                src={fooderDetail.upi_image}
                                                                                className="mb-2"
                                                                                alt="qrImage"
                                                                                style={{ width: "120px", height: "auto" }}
                                                                            />
                                                                        )}
                                                                        <input
                                                                            className="form-control h-100"
                                                                            type="file"
                                                                            id="formFile"
                                                                            name="qrImage"
                                                                            onChange={(e) =>
                                                                                setQrImage(e.target.files[0])
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <h4 className="card-title card-title-dash mb-3" />
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <label> Type </label>
                                                                        <select className="form-select" name="type" onChange={(e) => handleChange(e, "select")} >
                                                                            <option value={fooderDetail.type} className="d-none" selected={fooderDetail.type}>
                                                                                {(fooderDetail.type == 1) ? "Restaurant" : (fooderDetail.type == 2) ? "Confectioners (Sweets Shop)" : (fooderDetail.type == 3) ? "Bakers" : (fooderDetail.type == 4) ? "Multiplex" : "Select Type"}
                                                                            </option>
                                                                            <option value={0}>Select Type</option>
                                                                            <option value={1}>Restaurant</option>
                                                                            <option value={2}>Confectioners (Sweets Shop)</option>
                                                                            <option value={3}>Bakers</option>
                                                                            <option value={4}>Multiplex</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-9">
                                                                    <div className="form-group">
                                                                        <h4 className="card-title card-title-dash mb-3">
                                                                            Facilities
                                                                        </h4>
                                                                        <div className="d-flex" >
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option1"
                                                                                    name="delivery"
                                                                                    value={0}
                                                                                    checked={facility[0]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 0)}
                                                                                />
                                                                                <label className="form-check-label">Delivery</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option2"
                                                                                    name="takeOut"
                                                                                    value={1}
                                                                                    checked={facility[1]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 1)}
                                                                                />
                                                                                <label className="form-check-label">Take Out</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option3"
                                                                                    name="servesVeg"
                                                                                    value={2}
                                                                                    checked={facility[2]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 2)}
                                                                                />
                                                                                <label className="form-check-label">
                                                                                    Serves Veg (only)
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option3"
                                                                                    name="dineIn"
                                                                                    value={3}
                                                                                    checked={facility[3]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 3)}
                                                                                />
                                                                                <label className="form-check-label">Dine In </label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option3"
                                                                                    name="parking"
                                                                                    value={4}
                                                                                    checked={facility[4]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 4)}
                                                                                />
                                                                                <label className="form-check-label">Parking </label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option3"
                                                                                    name="bar"
                                                                                    value={5}
                                                                                    checked={facility[5]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 5)}
                                                                                />
                                                                                <label className="form-check-label">Bar</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option3"
                                                                                    name="wifi"
                                                                                    value={6}
                                                                                    checked={facility[6]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 6)}
                                                                                />
                                                                                <label className="form-check-label">Wifi</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option3"
                                                                                    name="acceptCC"
                                                                                    value={7}
                                                                                    checked={facility[7]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 7)}
                                                                                />
                                                                                <label className="form-check-label">
                                                                                    {" "}
                                                                                    Accepts CC{" "}
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="checkbox"
                                                                                    defaultValue="option3"
                                                                                    name="tableBooking"
                                                                                    value={8}
                                                                                    checked={facility[8]}
                                                                                    onChange={(e) => handleChangeCheckBox(e.target.checked, 8)}

                                                                                />
                                                                                <label className="form-check-label">
                                                                                    Table Booking
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <h4 className="card-title card-title-dash mb-3">
                                                                Working Hours
                                                            </h4>
                                                            <div className="row">
                                                                <div className="col-1 vsalign">
                                                                    <div className="form-group">
                                                                        <label> Monday </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[0]?.open}
                                                                                onChange={(e) => handleChangeTime(e, 0, "open")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[0]?.close}
                                                                                onChange={(e) => handleChangeTime(e, 0, "close")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-1 vsalign">
                                                                    <div className="form-group">
                                                                        <label> Tuesday </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[1]?.open}
                                                                                onChange={(e) => handleChangeTime(e, 1, "open")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[1]?.close}
                                                                                onChange={(e) => handleChangeTime(e, 1, "close")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-1 vsalign">
                                                                    <div className="form-group">
                                                                        <label> Wednesday </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[2]?.open}
                                                                                onChange={(e) => handleChangeTime(e, 2, "open")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[2]?.close}
                                                                                onChange={(e) => handleChangeTime(e, 2, "close")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-1 vsalign">
                                                                    <div className="form-group">
                                                                        <label> Thursday </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[3]?.open}
                                                                                onChange={(e) => handleChangeTime(e, 3, "open")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[3]?.close}
                                                                                onChange={(e) => handleChangeTime(e, 3, "close")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-1 vsalign">
                                                                    <div className="form-group">
                                                                        <label> Friday </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[4]?.open}
                                                                                onChange={(e) => handleChangeTime(e, 4, "open")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[4]?.close}
                                                                                onChange={(e) => handleChangeTime(e, 4, "close")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-1 vsalign">
                                                                    <div className="form-group">
                                                                        <label> Saturday </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[5]?.open}
                                                                                onChange={(e) => handleChangeTime(e, 5, "open")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[5]?.close}
                                                                                onChange={(e) => handleChangeTime(e, 5, "close")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-1 vsalign">
                                                                    <div className="form-group">
                                                                        <label> Sunday </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                defaultValue=""
                                                                                value={time[6]?.open}
                                                                                onChange={(e) => handleChangeTime(e, 6, "open")}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="time"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={time[6]?.close}
                                                                                onChange={(e) => handleChangeTime(e, 6, "close")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <button type="submit" className="btn btn-primary me-2" onClick={updateFooder} >
                                                            Submit
                                                        </button>
                                                        <button className="btn btn btn-secondary">Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Sidebar>
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>}
        </>
    )
}
export default WithBootstrap(EditFooder)