import { useState } from "react";
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';


const Documents = () => {
    const navigate = useNavigate()

    const closeScreen = () => {
        window.sessionStorage.removeItem("fooder_id")
        navigate("/fooders")
    }

    return (
        <>
            <Sidebar name={"Fooders"} >
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="d-flex align-items-baseline justify-content-between" >
                                    <h3 className="ukhd mb-3">Verification</h3>
                                    <button type="button" class="btn btn-danger btn-sm" onClick={closeScreen} ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>
                                </div>
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="row flex-grow">
                                            <div className="col-12 grid-margin stretch-card">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <div className="d-sm-flex justify-content-between align-items-start">
                                                            <div className="valign">
                                                                <h4 className="card-title card-title-dash mb-3">
                                                                    Upload documents
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        <form className="forms-sample">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Document Type{" "}
                                                                            <span className="text-danger">*</span>
                                                                        </label>
                                                                        <select className="form-select">
                                                                            <option selected="">
                                                                                Select Document Type
                                                                            </option>
                                                                            <option value={1}>FSSAI License</option>
                                                                            <option value={2}>PAN Card</option>
                                                                            <option value={3}>GST</option>
                                                                            <option value={4}>Menu</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="form-group">
                                                                        <label> Choose Document </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="file"
                                                                            id="formFile"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary me-2"
                                                            >
                                                                Submit
                                                            </button>
                                                            <button className="btn btn btn-secondary">
                                                                Cancel
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="row flex-grow">
                                            <div className="col-12 grid-margin stretch-card">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <div
                                                            className="accordion"
                                                            id="accordionPanelsStayOpenExample"
                                                        >
                                                            <div className="accordion-item">
                                                                <h2
                                                                    className="accordion-header"
                                                                    id="panelsStayOpen-headingOne"
                                                                >
                                                                    <button
                                                                        className="accordion-button"
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target="#panelsStayOpen-collapseOne"
                                                                        aria-expanded="false"
                                                                        aria-controls="panelsStayOpen-collapseOne"
                                                                    >
                                                                        FSSAI License
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id="panelsStayOpen-collapseOne"
                                                                    className="accordion-collapse collapse show"
                                                                    aria-labelledby="panelsStayOpen-headingOne"
                                                                >
                                                                    <div className="accordion-body">
                                                                        <span className="text-danger">
                                                                            FSSAI License files not uploaded!
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item">
                                                                <h2
                                                                    className="accordion-header"
                                                                    id="panelsStayOpen-headingTwo"
                                                                >
                                                                    <button
                                                                        className="accordion-button collapsed"
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target="#panelsStayOpen-collapseOne"
                                                                        aria-expanded="true"
                                                                        aria-controls="panelsStayOpen-collapseOne"
                                                                    >
                                                                        PAN Card
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id="panelsStayOpen-collapseTwo"
                                                                    className="accordion-collapse collapse show"
                                                                    aria-labelledby="panelsStayOpen-headingTwo"
                                                                >
                                                                    <div className="accordion-body">
                                                                        <span className="text-danger">
                                                                            PAN Card files not uploaded!
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item">
                                                                <h2
                                                                    className="accordion-header"
                                                                    id="panelsStayOpen-headingThree"
                                                                >
                                                                    <button
                                                                        className="accordion-button collapsed"
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target="#panelsStayOpen-collapseThree"
                                                                        aria-expanded="false"
                                                                        aria-controls="panelsStayOpen-collapseThree"
                                                                    >
                                                                        GST
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id="panelsStayOpen-collapseThree"
                                                                    className="accordion-collapse collapse show"
                                                                    aria-labelledby="panelsStayOpen-headingThree"
                                                                >
                                                                    <div className="accordion-body">
                                                                        <span className="text-danger">
                                                                            GST files not uploaded!
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item">
                                                                <h2
                                                                    className="accordion-header"
                                                                    id="panelsStayOpen-headingFour"
                                                                >
                                                                    <button
                                                                        className="accordion-button collapsed"
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target="#panelsStayOpen-collapsefour"
                                                                        aria-expanded="false"
                                                                        aria-controls="panelsStayOpen-collapsefour"
                                                                    >
                                                                        Menu
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id="panelsStayOpen-collapsefour"
                                                                    className="accordion-collapse collapse show"
                                                                    aria-labelledby="panelsStayOpen-headingFour"
                                                                >
                                                                    <div className="accordion-body">
                                                                        <span className="text-danger">
                                                                            Menu files not uploaded!
                                                                        </span>
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
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    )

}
export default WithBootstrap(Documents)