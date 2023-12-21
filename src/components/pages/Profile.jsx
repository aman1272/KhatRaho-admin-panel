import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import WithBootstrap from '../WithBootstrap';
import axios from 'axios'
import Sidebar from "./Sidebar";


const Profile = () => {
    const [profile, setProfile] = useState({ name: "", email: "", password: "", confirmPassword: "" })
    const [profileNotif, setProfileNotif] = useState({})

    useEffect(() => {
        getUser()
    }, []);

    const getUser = async () => {
        setProfile({})
        const userId = window.sessionStorage.getItem('userId')
        try {
            const response = await axios({
                url: "http://localhost:8000/user/detail",
                method: "POST",
                data: { data: userId }
            })
            const { email, name } = response.data[0]
            window.sessionStorage.setItem('name', name)
            window.sessionStorage.setItem('email', email)
            setProfile({ password: "", confirmPassword: "", email, name })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const updateProfile = async () => {
        const userId = window.sessionStorage.getItem('userId')
        const sendingData = { email: profile.email, name: profile.name, userId }
        const url = "http://localhost:8000/profile/update"
        try {
            const response = await axios({
                url: url,
                method: "PUT",
                data: { data: sendingData }
            })
            if (response.data.success) {
                setProfileNotif({ message: response.data.message, profile: true })
                window.sessionStorage.setItem(
                    "userId", userId
                )
                getUser()
            } else {
                setProfileNotif({ message: response.data.message, profile: true, err: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updatePassword = async () => {
        const userId = window.sessionStorage.getItem('userId')
        const sendingData = { password: profile.password, userId }
        const url = "http://localhost:8000/password/update"
        try {
            const response = await axios({
                url: url,
                method: "PUT",
                data: { data: sendingData }
            })
            if (response.data.success) {
                setProfile({ ...profile, password: "", confirmPassword: "" })
                setProfileNotif({ message: response.data.message, password: true })
            } else {
                setProfile({ ...profile, password: "", confirmPassword: "" })
                setProfileNotif({ message: response.data.message, password: true, err: true })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (props) => {
        setProfile({ ...profile, [props.target.name]: props.target.value })
    }

    return (
        <>
            <Sidebar name={"Profile"} >
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-lg-8 d-flex">
                                        <div className="row flex-grow">
                                            <div className="col-12 grid-margin">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <h4 className="card-title">Contact Details</h4>
                                                        <form className="forms-sample" onKeyPress={(event) => (event.key === 'Enter') ? updateProfile("profile") : ''} >
                                                            {(profileNotif.profile) && <div className={`${profileNotif.err ? "alert alert-danger" : "alert alert-success"} alert-dismissible fade show`} role="alert">
                                                                {profileNotif.message} <button
                                                                    type="button"
                                                                    className="btn-close"
                                                                    data-bs-dismiss="offcanvas"
                                                                    aria-label="Close"
                                                                    onClick={() => { setProfileNotif({}) }}
                                                                /> </div>}
                                                            <div className="form-group">
                                                                <label>Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="name"
                                                                    placeholder="Name"
                                                                    onChange={(e) => handleChange(e)}
                                                                    value={profile.name}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Email</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="email"
                                                                    placeholder="email"
                                                                    value={profile.email}
                                                                    defaultValue=""
                                                                    onChange={(e) => handleChange(e)}
                                                                />
                                                            </div>
                                                        </form>
                                                        <button className="btn btn-primary me-2" onClick={() => updateProfile()} >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 d-flex">
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
                                                                    value={profile.password}
                                                                    onChange={(e) => handleChange(e)}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <input
                                                                    type="password"
                                                                    className="form-control"
                                                                    placeholder="Re-type New Password"
                                                                    name="confirmPassword"
                                                                    defaultValue=""
                                                                    value={profile.confirmPassword}
                                                                    onChange={(e) => handleChange(e)}
                                                                />
                                                            </div>
                                                            {(profile?.confirmPassword?.length > 0 && profile.confirmPassword !== profile.password) ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                                                Password not matched with Confirm Password
                                                            </div> : ""}
                                                        </form>
                                                        <div className="mt-3">
                                                            <button className="btn btn-primary me-2" onClick={() => updatePassword()} >
                                                                Save
                                                            </button>
                                                            <button className="btn btn btn-secondary" onClick={() => setProfile({ ...profile, password: "", confirmPassword: "" })} >Reset</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    )
}
export default WithBootstrap(Profile)