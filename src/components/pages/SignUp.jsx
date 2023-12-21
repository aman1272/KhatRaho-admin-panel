import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import axios from 'axios'

const SignUp = () => {
    const navigate = useNavigate();
    let accessToken = window.sessionStorage.getItem("Accesstoken");
    const [showComponent, setShowComponent] = useState(false);
    const [data, setData] = useState({ email: "", password: "", name: "", confirm_password: "" })

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, []);
    useEffect(() => {
        if (accessToken) {
            navigate('/dashboard');
        }
    }, [accessToken])

    const handleSubmit = async (e) => {
        await axios({
            url: "http://localhost:8000/signup",
            method: "POST",
            data: { data },
        })
            .then((response) => {
                console.log("sresponse when sign up", response.data)
                if (response.data.success) {
                    console.log("sign Up successfully")
                    // window.sessionStorage.setItem(
                    //     "Accesstoken", response.data.Accesstoken
                    // )
                    // navigate('/dashboard');
                }
                else {
                    // manageAlert(response.data)
                }
            })
            .catch((err) => {
                console.log("err", err);
                alert("Something went wrong")
            })
    };

    const handleChange = (props) => {
        setData({ ...data, [props.target.name]: props.target.value })

    };
    console.log("data", data)
    return (
        <>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
                />

                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Sans&family=Lato&family=Roboto&display=swap"
                    rel="stylesheet"
                />
                <link rel="stylesheet" href="css/signup.css" />
                <style
                    dangerouslySetInnerHTML={{
                        __html:
                            "\n.loginform\n{\n    position: absolute;\n  margin: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100px;\n  height: 590px;width: 430px;\n}\n"
                    }}
                />
            </Helmet>
            {showComponent ?

                <div className="background">
                    <div className="uk-width-1-1 loginform">
                        <form
                            className="uk-form-stacked formcss"
                            onKeyPress={(event) => (event.key === 'Enter') ? handleSubmit() : ''}
                        >
                            <div className="uk-width-1-1 headerddiv">
                                <div className="uk-grid">
                                    <div className="uk-width-auto">
                                        <a href="">
                                            <h2>IWCN.</h2>
                                        </a>
                                    </div>
                                    <div className="uk-width-expand uk-text-right">
                                        <Link className="uk-button uk-button-default create_btn" to="/" >
                                            Login Account
                                        </Link>
                                    </div>
                                </div>
                                <img src="https://img.freepik.com/free-vector/cute-cat-with-laptop-cartoon-vector-icon-illustration-animal-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3698.jpg?w=2000" className="logingif" />
                                <p className="smalltxt">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit{" "}
                                </p>
                            </div>
                            <h3 className="uk-text-center signinhd">USER SIGN UP</h3>
                            <span className="signinsubhd">Create An Account</span>
                            <div className="inputdiv">
                                <div className="uk-alert-danger uk-hidden" uk-alert="">
                                    <a className="uk-alert-close" uk-close="" />
                                    <p>Lorem ipsum dolor sit amet, consecte.</p>
                                </div>
                                <div className="uk-margin uk-margin-small-top">
                                    <div className="uk-inline">
                                        <i className="uk-form-icon fa fa-user-circle-o" />
                                        <input
                                            className="uk-input"
                                            type="text"
                                            placeholder="Enter Name"
                                            name="name"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="uk-margin">
                                    <div className="uk-inline">
                                        <i className="uk-form-icon fa fa-envelope" />
                                        <input
                                            className="uk-input"
                                            type="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="uk-margin">
                                    <div className="uk-inline">
                                        <i className="uk-form-icon fa fa-lock" />
                                        <input
                                            className="uk-input"
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="uk-margin">
                                    <div className="uk-inline">
                                        <i className="uk-form-icon fa fa-unlock-alt" />
                                        <input
                                            className="uk-input"
                                            type="password"
                                            name="confirm_password"
                                            placeholder="Enter your confirm password"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                {(data?.confirm_password?.length > 0 && data?.confirm_password !== data.password) ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    Password not matched with Confirm Password
                                </div> : ""}
                                <div className="uk-text-center uk-width-1-1@s">
                                    <button className="uk-button uk-button-default gbtn uk-margin-remove-top" onClick={handleSubmit} >
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                : <div class="text-center mt-5">
                    <div class="spinner-border" role="status">
                    </div>
                </div>}
        </>


    )

}
export default SignUp