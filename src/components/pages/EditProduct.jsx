import { useState, useEffect } from "react";
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";

const EditProduct = () => {
    const navigate = useNavigate()
    const [tags, setTags] = useState([]);
    const [fooders, setFooders] = useState([]);
    const [menus, setMenus] = useState([]);
    const [showComponent, setShowComponent] = useState(false);
    const [formData, setFormData] = useState({});
    const [inputValue, setInputValue] = useState("");

    const id = window.sessionStorage.getItem('productId')

    const closeScreen = () => {
        window.sessionStorage.removeItem("productId")
        navigate("/products")
    }

    useEffect(() => {
        if (id) {
            getProduct()
        } else {
            getFooders()
        }
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        getMenu()
    }, [formData.fooder_id]);


    const getFooders = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/fooders",
                method: "GET",
                headers: {
                    showFoodersName: true
                }
            })
            if (!response.data.error) {
                setFooders(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const getProduct = async () => {
        const url = "http://localhost:8000/fooders/products"
        try {
            const response = await axios({
                url: url,
                method: "GET",
                headers: {
                    fooder_id: id,
                    editproduct: true
                }
            })
            console.log('res', response.data)
            setFormData({
                menu_id: response?.data?.data[0]?.menu_id,
                product_name: response?.data?.data[0]?.product_name,
                price: response?.data?.data[0]?.price,
                proprice: response?.data?.data[0]?.proprice,
                status: response?.data?.data[0]?.status === 1 ? true : false,
                picture: response?.data?.data[0]?.picture,
                product_type: response?.data?.data[0]?.product_type,
                top_rated: response?.data?.data[0]?.top_rated === 1 ? true : false,
                best_seller: response?.data?.data[0]?.best_seller === 1 ? true : false,
                most_ordered:
                    response?.data?.data[0]?.most_ordered === 1 ? true : false,
                preparation_time: response?.data?.data[0]?.preparation_time,
                description: response?.data?.data[0]?.description,
                variant1: response?.data?.data[0]?.variant1 || "",
                variant2: response?.data?.data[0]?.variant2 || "",
                variant3: response?.data?.data[0]?.variant3 || "",
                variant4: response?.data?.data[0]?.variant4 || "",
            })
            setTags(
                response.data.data[0].tags
                    ? response.data.data[0].tags.split(", ")
                    : []
            );
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getMenu = async () => {
        try {
            const response = await axios({
                url: "http://localhost:8000/menu",
                method: "GET",
                headers: {
                    fooder_id: formData.fooder_id,
                    showmenus: true
                }
            })
            console.log('res', response.data)
            if (!response.data?.error) {
                if (!response.data?.data?.length) { }
                setMenus(response.data.data)
            } else {

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleTagClick = (tagIndex) => {
        const newTags = [...tags];
        newTags.splice(tagIndex, 1);
        setTags(newTags);
    };


    const handleChange = (event, type, checkValue) => {
        const { name, value } = event.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checkValue });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    console.log("formdata", formData)

    const handleInputKeyPress = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const prepTime = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

    return (
        <>
            <Sidebar name={"Products"} >
                {showComponent ?
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h3 className="ukhd mb-3">Products</h3>
                                    <div className="row flex-grow">
                                        <div className="col-12 grid-margin stretch-card">
                                            <div className="card card-rounded">
                                                <div className="card-body">
                                                    <div className="d-sm-flex justify-content-between align-items-start">
                                                        <div className="valign">
                                                            <h4 className="card-title card-title-dash">
                                                                {(id) ? "Edit" : "Add"} Dishes/Products
                                                            </h4>
                                                        </div>
                                                        <button type="button" class="btn btn-danger btn-sm" onClick={closeScreen}  ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>

                                                    </div>
                                                    <form className="forms-sample">
                                                        <div className="row">
                                                            {(!id) && <div className="form-group col-3">
                                                                <label> Fooder </label>
                                                                <select className="form-select" name="fooder_id" onChange={(e) => handleChange(e)} >
                                                                    <option value="" className="d-none" selected="">
                                                                        Select Type
                                                                    </option>
                                                                    {
                                                                        fooders.map((fooder, index) => {
                                                                            return (
                                                                                <option value={fooder.fooder_id} key={index} >{fooder.name}</option>
                                                                            )
                                                                        })
                                                                    }

                                                                </select>
                                                            </div>}
                                                            <div className={id ? "col-4" : "col-3"}>
                                                                <div className="form-group">
                                                                    <label>
                                                                        Menu/Category <span className="text-danger">*</span>
                                                                    </label>
                                                                    <select className="form-select" name="menu_id" onChange={(e) => handleChange(e)} >
                                                                        <option value={formData.menu_id} selected={formData.menu_name} >
                                                                            {(formData.menu) ? `${formData.menu}` : " Select Menu/Category"}
                                                                        </option>
                                                                        {
                                                                            menus.map((menu, index) => {
                                                                                return (
                                                                                    <option value={menu.id} key={index} >{menu.name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                        {
                                                                            !menus.length &&
                                                                            <option value={0} >No menu available</option>
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className={id ? "col-4" : "col-3"}>
                                                                <div className="form-group">
                                                                    <label>
                                                                        {" "}
                                                                        Name <span className="text-danger">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Ener Menu Name"
                                                                        name="product_name"
                                                                        value={formData.product_name}
                                                                        onChange={(e) => handleChange(e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className={id ? "col-4" : "col-3"}>
                                                                <div className="form-group">
                                                                    <label>
                                                                        Dish Type <span className="text-danger">*</span>
                                                                    </label>
                                                                    <select className="form-select" name="product_type" onChange={(e) => handleChange(e)} >
                                                                        <option selected={formData.product_type} >
                                                                            {(formData.product_type == 0) ? "Veg" : (formData.product_type == 1) ? "Non-Veg" : "Select Dish Type"}
                                                                        </option>
                                                                        <option value={0}>Veg</option>
                                                                        <option value={1}>Non-Veg</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Time for preparation{" "}
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                    <select className="form-select" name="preparation_time" onChange={(e) => handleChange(e)} >
                                                                        <option selected={formData.preparation_time} >
                                                                            {(formData.preparation_time) ? `${formData.preparation_time}` : " Select Time for preparation"}
                                                                        </option>
                                                                        <option value="5">5</option>
                                                                        <option value="10">10</option>
                                                                        <option value="15">15</option>
                                                                        <option value="20">20</option>
                                                                        <option value="25">25</option>
                                                                        <option value="5">30</option>
                                                                        <option value="15">35</option>
                                                                        <option value="20">40</option>
                                                                        <option value="25">45</option>
                                                                        <option value="5">50</option>
                                                                        <option value="15">55</option>
                                                                        <option value="20">60</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Price <span className="text-danger">*</span>
                                                                    </label>
                                                                    <div className="input-group">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Price"
                                                                            name="price"
                                                                            value={formData.price}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                        <span className="input-group-text">$</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="form-group">
                                                                    <label>Promo Price </label>
                                                                    <div className="input-group">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Promo Price"
                                                                            name="proprice"
                                                                            value={formData.proprice}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                        <span className="input-group-text">$</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="form-group">
                                                                    <label>Rank</label>
                                                                    <div className="d-flex" >
                                                                        <div className="form-check form-check-inline">
                                                                            <input
                                                                                className="form-check-input m-0"
                                                                                type="checkbox"
                                                                                name="top_rated"
                                                                                checked={formData.top_rated}
                                                                                onChange={(e) => handleChange(e, "checkbox", e.target.checked)}
                                                                            />
                                                                            <label className="form-check-label">
                                                                                Top Rated
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline">
                                                                            <input
                                                                                className="form-check-input m-0"
                                                                                type="checkbox"
                                                                                name="best_seller"
                                                                                checked={formData.best_seller}
                                                                                onChange={(e) => handleChange(e, "checkbox", e.target.checked)}
                                                                            />
                                                                            <label className="form-check-label">
                                                                                Most Ordered
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline">
                                                                            <input
                                                                                className="form-check-input m-0"
                                                                                type="checkbox"
                                                                                name="most_ordered"
                                                                                checked={formData.most_ordered}
                                                                                onChange={(e) => handleChange(e, "checkbox", e.target.checked)}
                                                                            />
                                                                            <label className="form-check-label">
                                                                                Best Seller
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="form-group togglecss">
                                                                    <label>Status</label>
                                                                    <div
                                                                        className={`button r ${(formData.status) ? "active" : ""
                                                                            }`}
                                                                        id="button-1"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkbox"
                                                                            checked={formData.status}
                                                                            name="status"
                                                                            onChange={(e) => handleChange(e, "checkbox", e.target.checked)}
                                                                        />
                                                                        <div className="knobs"></div>
                                                                        <div className="layer"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Tags
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                    <div id="tags">
                                                                        {tags.map((tag, index) => (
                                                                            <span
                                                                                key={index}
                                                                                onClick={() => handleTagClick(index)}
                                                                            >
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                        <input
                                                                            type="text"
                                                                            className=""
                                                                            value={inputValue}
                                                                            placeholder="Add a tag"
                                                                            onChange={handleInputChange}
                                                                            onKeyDown={handleInputKeyPress}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label>Description</label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        name="description"
                                                                        placeholder="Enter Description"
                                                                        defaultValue={""}
                                                                        value={formData.description}
                                                                        onChange={(e) => handleChange(e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                {formData.picture ? (
                                                                    <img
                                                                        src={formData.picture}
                                                                        alt="Product Img"
                                                                        style={{ width: "20%" }}
                                                                    />
                                                                ) : (
                                                                    ""
                                                                )}
                                                                <div className="form-group">
                                                                    <label> Choose Dish Image </label>
                                                                    <input
                                                                        className="form-control h-100"
                                                                        type="file"
                                                                        id="formFile"
                                                                        onChange={(e) =>
                                                                            setFormData({ ...formData, picture: e.target.files[0] })
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button type="submit" className="btn btn-warning me-2">
                                                            Submit
                                                        </button>
                                                        <button className="btn btn btn-secondary">Cancel</button>
                                                    </form>
                                                    {(id) &&
                                                        <>
                                                            <h4 className="card-title card-title-dash mt-5">
                                                                Manage Product Variants and Price
                                                            </h4>
                                                            <form className="forms-sample mt-2">
                                                                <div className="row">
                                                                    <div className="col">
                                                                        <div className="form-group">
                                                                            <label> Variant Name 1 </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Enter Variant Name 1"
                                                                                name="variant1"
                                                                                value={formData.variant1}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="form-group">
                                                                            <label> Variant Name 2 </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Enter Variant Name 2"
                                                                                name="variant2"
                                                                                value={formData.variant2}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="form-group">
                                                                            <label> Variant Name 3 </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Enter Variant Name 3"
                                                                                name="variant3"
                                                                                value={formData.variant3}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="form-group">
                                                                            <label> Variant Name 4 </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Enter Variant Name 4"
                                                                                name="variant4"
                                                                                value={formData.variant4}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button type="submit" className="btn btn-warning me-2">
                                                                    Submit
                                                                </button>
                                                                <button className="btn btn btn-secondary">Cancel</button>
                                                            </form>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>
                }
            </Sidebar>
        </>
    )
}
export default WithBootstrap(EditProduct)