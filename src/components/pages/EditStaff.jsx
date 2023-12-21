import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import WithBootstrap from "../WithBootstrap";


const EditStaff = () => {
    const navigate = useNavigate();
    const [profileNotif, setProfileNotif] = useState({})
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        mobile_num: "",
        email: "",
        address: "",
        userName: "",
        password: "",
        confirmPassword: "",
        status: true,
    });
    const userId = window.sessionStorage.getItem("userId")


    useEffect(() => {
        if (userId) {
            getStaffs()
        }
    }, []);


    const getStaffs = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/get/staff",
                method: "GET",
                headers: {
                    userId
                }
            })
            if (!response.data.error) {
                console.log("get Data", response.data)
                setFormData(response.data.data[0])
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const addStaff = async (e) => {
        const status = formData.status ? 1 : 0
        const data = { email: formData.email, name: formData.name, status, mobile_num: formData.mobile_num, password: formData.password, addStaff: true }
        await axios({
            url: "http://localhost:8000/signup",
            method: "POST",
            data: { data },
        })
            .then((response) => {
                console.log("sresponse when add staff", response.data)
                if (response.data.success) {
                    console.log("staff sdded successfully")
                    setFormData({})
                    setProfileNotif({ message: response.data.message, profile: true })
                }
                else {
                    console.log("error in add staff")
                    setProfileNotif({ message: response.data.message, profile: true, err: true })
                }
            })
            .catch((err) => {
                console.log("err", err);
                alert("Something went wrong")
            })
    };

    const updatePassword = async () => {
        const userId = window.sessionStorage.getItem('userId')
        const data = { password: formData.password, userId }
        const url = "http://localhost:8000/password/update"
        try {
            const response = await axios({
                url: url,
                method: "PUT",
                data: { data: data }
            })
            console.log('res update password', response.data.message)
            if (response.data.success) {
                setFormData({ ...formData, password: "", confirmPassword: "" })
                setProfileNotif({ message: response.data.message, password: true })
            } else {
                setProfileNotif({ message: response.data.message, password: true, err: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const updateProfile = async () => {
        const status = formData.status ? 1 : 0
        const data = { email: formData.email, name: formData.name, userId, status, mobile_num: formData.mobile_num, editprofile: true }
        console.log("updateprofile", data)
        const url = "http://localhost:8000/profile/update"
        try {
            const response = await axios({
                url: url,
                method: "PUT",
                data: { data },
            })
            console.log('res', response.data)
            if (response.data.success) {
                setProfileNotif({ message: response.data.message, profile: true })
                getStaffs()
            } else {
                setProfileNotif({ message: response.data.message, profile: true, err: true })
            }
        } catch (error) {
            alert("Something went wrong")
            console.error('Error fetching data:', error);
        }
    }


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };


    const handleBackClick = (e) => {
        window.sessionStorage.removeItem("userId")
        navigate("/staffs");
    };


    return (
        <>
            <Sidebar name="Staffs">
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="d-flex justify-content-between m-1 p-1 align-items-baseline ">
                                    <h3 className="ukhd mb-3">Staffs</h3>
                                    <button type="button" class="btn btn-danger btn-sm" onClick={handleBackClick}  ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>
                                </div>
                                <div className="row">
                                    <div className={`${userId ? "col-lg-8" : "col-lg-12"} d-flex flex-column`}>
                                        <div className="row flex-grow">
                                            <div className="col-12 grid-margin">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <h4 className="card-title">{userId ? "Edit" : "Add"} Staff Details</h4>
                                                        <form className="pt-3" onKeyPress={(event) => (event.key === 'Enter') ? (userId ? updateProfile() : addStaff()) : ''} >
                                                            {(profileNotif.profile) && <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                                {profileNotif.message} <button
                                                                    type="button"
                                                                    className="btn-close"
                                                                    data-bs-dismiss="offcanvas"
                                                                    aria-label="Close"
                                                                    onClick={() => { setProfileNotif({}) }}
                                                                /> </div>}
                                                            {error && (
                                                                <div className="d-sm-flex justify-content-between align-items-start alert alert-danger">
                                                                    <div className="vsalign">{error}</div>
                                                                    <div className="vsalign">
                                                                        <span
                                                                            className=".h3 text-muted"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => setError("")}
                                                                        >
                                                                            x
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {success && (
                                                                <div className="d-sm-flex justify-content-between align-items-start alert alert-success">
                                                                    <div className="vsalign">{success}</div>
                                                                    <div className="vsalign">
                                                                        <span
                                                                            className=".h3 text-muted"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => setSuccess("")}
                                                                        >
                                                                            x
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="row">
                                                                <div className="col-12 col-md-6 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Name
                                                                            <span className="text-danger">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Enter  Name"
                                                                            name="name"
                                                                            value={formData.name}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 col-md-6 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label> Phone Number </label>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            placeholder="Enter  Phone Number"
                                                                            maxLength={10}
                                                                            name="mobile_num"
                                                                            value={formData.mobile_num}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 col-md-6 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label> Email </label>
                                                                        <input
                                                                            type="email"
                                                                            className="form-control"
                                                                            placeholder="Enter Email"
                                                                            name="email"
                                                                            value={formData.email}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* <div className="col-12 col-md-6 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label> Address </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Enter Address"
                                                                            name="address"
                                                                            value={formData.address}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 col-md-6 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label> User Name </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Enter User Name"
                                                                            name="userName"
                                                                            value={formData.userName}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </div>
                                                                </div> */}

                                                                {!userId && <div className="col-12 col-md-6 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label> Password </label>
                                                                        <input
                                                                            type="password"
                                                                            className="form-control"
                                                                            placeholder="Enter password"
                                                                            name="password"
                                                                            value={formData.password}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </div>
                                                                </div>}

                                                                <div className="col-12 col-md-6 col-lg-6">
                                                                    <div className="form-group togglecss">
                                                                        <label>Status</label>
                                                                        <div className="button r" id="button-1">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox"
                                                                                name="status"
                                                                                checked={formData.status == 1}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                            <div className="knobs"></div>
                                                                            <div className="layer"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* <div className="form-group">
                                                                    <label>Description</label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        placeholder="Enter Description"
                                                                        name="description"
                                                                        value={formData.description}
                                                                        onChange={handleInputChange}
                                                                    ></textarea>
                                                                </div> */}
                                                            </div>
                                                        </form>
                                                        <button className="btn btn-warning me-2" onClick={() => (userId ? updateProfile() : addStaff())} >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="btn btn btn-secondary"
                                                            onClick={handleBackClick}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {userId && <div className="col-lg-4 d-flex flex-column">
                                        <div className="row flex-grow">
                                            <div className="col-12 grid-margin">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <h4>Change Password</h4>
                                                        <form className="pt-3" onKeyPress={(event) => (event.key === 'Enter') ? updatePassword() : ''} >
                                                            {(profileNotif.password) && <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                                {profileNotif.message}<button
                                                                    type="button"
                                                                    className="btn-close"
                                                                    data-bs-dismiss="offcanvas"
                                                                    aria-label="Close"
                                                                    onClick={() => { setProfileNotif({}) }}
                                                                /> </div>}
                                                            <div className="form-group">
                                                                <input
                                                                    type="password"
                                                                    className="form-control"
                                                                    placeholder="New Password"
                                                                    name="password"
                                                                    defaultValue=""
                                                                    value={formData.password}
                                                                    onChange={(e) => handleInputChange(e)}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <input
                                                                    type="password"
                                                                    className="form-control"
                                                                    placeholder="Re-type New Password"
                                                                    name="confirmPassword"
                                                                    defaultValue=""
                                                                    value={formData.confirmPassword}
                                                                    onChange={(e) => handleInputChange(e)}
                                                                />
                                                            </div>
                                                            {(formData?.confirmPassword?.length > 0 && formData.confirmPassword !== formData.password) ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                                                Password not matched with Confirm Password
                                                            </div> : ""}
                                                        </form>
                                                        <div className="mt-3">
                                                            <button className="btn btn-warning me-2" onClick={() => updatePassword()} >
                                                                Save
                                                            </button>
                                                            <button className="btn btn btn-secondary" onClick={() => setFormData({ ...formData, password: "", confirmPassword: "" })} >Reset</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    );
};

export default WithBootstrap(EditStaff);
