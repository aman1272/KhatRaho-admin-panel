import { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import WithBootstrap from '../WithBootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const EditMenu = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", tags: "", });
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [fooders, setFooders] = useState([]);

  const navigate = useNavigate()
  const id = window.sessionStorage.getItem('menuId')

  useEffect(() => {
    if (id) {
      getMenu()
    } else {
      getFooders()
    }
    const timeoutId = setTimeout(() => {
      setShowComponent(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

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

  const getMenu = async () => {
    try {
      const response = await axios({
        url: "http://localhost:8000/menu",
        method: "GET",
        headers: {
          id
        }
      })
      const { description, name, status, tags } = response.data.data[0]
      setFormData({ description, name });
      setTags(
        tags ? tags.split(", ") : []
      );
      setIsChecked(status === 1 ? true : false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const closeScreen = () => {
    window.sessionStorage.removeItem("menuId")
    navigate("/menus")
  }


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTagClick = (tagIndex) => {
    const newTags = [...tags];
    newTags.splice(tagIndex, 1);
    setTags(newTags);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitMenuData = async (e) => {
    const currUrl = id ? "http://localhost:8000/edit/menu" : "http://localhost:8000/add/menu"
    const currMethod = id ? "PUT" : "POST"
    const data = JSON.stringify({
      name: formData.name,
      tags: tags.join(", "),
      description: formData.description,
      fooder_id: formData.fooder_id,
      status: isChecked ? 1 : 0,
    });
    try {
      const response = await axios({
        method: currMethod,
        url: currUrl,
        headers: {
          id
        },
        data: { data },
      });

      if (!response.error) {
        closeScreen()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };




  return (

    <Sidebar name={"Menus"}>
      {
        showComponent ?
          < div className="main-panel" >
            <div className="content-wrapper">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="ukhd mb-3">Category/Menu</h3>
                  <div className="row flex-grow">
                    <div className="col-12 grid-margin stretch-card">
                      <div className="card card-rounded">
                        <div className="card-body">
                          <div className="d-sm-flex justify-content-between align-items-start">
                            <div className="vsalign">
                              <h4 className="card-title card-title-dash">
                                Add Category/ Menus
                              </h4>
                            </div>
                            <button type="button" class="btn btn-danger btn-sm" onClick={closeScreen}  ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>
                          </div>
                          <form className="forms-sample" onKeyPress={(event) => (event.key === 'Enter') ? submitMenuData() : ''} >
                            {(id) && <div className="form-group col-12">
                              <label>
                                Menu Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Ener Menu Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>}
                            {(!id) && <div className="row">
                              <div className="form-group col-6">
                                <label>
                                  Menu Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Ener Menu Name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="form-group col-6">
                                <label> Fooder </label>
                                <select className="form-select" name="fooder_id" onChange={(e) => handleChange(e, "select")} >
                                  <option value="" className="d-none" selected="">
                                    Select Type
                                  </option>
                                  {
                                    fooders.map((fooder, index) => {
                                      return (
                                        <option value={fooder.fooder_id} kry={index} >{fooder.name}</option>
                                      )
                                    })
                                  }

                                </select>
                              </div>
                            </div>}
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
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                className="form-control"
                                name="description"
                                placeholder="Enter Description"
                                value={formData.description}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group togglecss">
                              <label>Status</label>
                              <div
                                className={`button r ${isChecked ? "active" : ""
                                  }`}
                                id="button-1"
                              >
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  checked={isChecked}
                                  onChange={handleCheckboxChange}
                                />
                                <div className="knobs"></div>
                                <div className="layer"></div>
                              </div>
                            </div>
                          </form>
                          <button type="submit" className="btn btn-warning me-2" onClick={submitMenuData} >
                            Submit
                          </button>
                          <button onClick={closeScreen} className="btn btn btn-secondary">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
          : <div class="text-center mt-5">
            <div class="spinner-border" role="status">
            </div>
          </div>
      }
    </Sidebar >
  );
};

export default WithBootstrap(EditMenu);
