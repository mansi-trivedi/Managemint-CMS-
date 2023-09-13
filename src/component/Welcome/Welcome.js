import React, { useContext, useState } from "react";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { OrgContext } from "../../context/OrganisationContext";
import Error from "../Error/Error";

function Welcome() {
    const navigate = useNavigate();
    const { setCookie, setOrgId } = useContext(OrgContext)
    const [error, setError] = useState(null)

    const handleSignIn = async (event) => {
        event.preventDefault();
        try {
            const signInEmail = document.getElementById("userEmail").value;
            const signInPassword = document.getElementById("userPassword").value;
            const payload = {
                email: signInEmail,
                password: signInPassword,
            };
            const signInResponse = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/login`,
                payload
            );
            setCookie('Id', signInResponse.data.organisation_id, { path: '/', maxAge: "3600" });
            setOrgId(signInResponse.data.organisation_id)
            localStorage.setItem('user', JSON.stringify(signInResponse.data))
            if (signInResponse.status === 200) {
                navigate(`orgs/${signInResponse.data.organisation_id}/records/allrecords`);
            }
        } catch (error) {
            setError(error)
            if (error.response?.status === 401) {
                alert("Invalid Credentials !!! Please try again.");
            } else {
                alert("Some Server Error Occured! Please Try Again.")
            }
        }
    };

    return (
        <>
            {
                error !== null ?
                    <div>
                        <Error />
                    </div>
                    :
                    <>
                        <div className="Welcome">
                            <div className="welcomeContent">
                                <div className="loginFormContent">
                                    <img src={require("../../image/managemint-logo.png")}
                                        style={{ width: "185px" }} alt="logo" />
                                    <h2>Welcome to Managemint</h2>
                                </div>
                                <form onSubmit={handleSignIn}>
                                    <div className="loginForm">
                                        <div className="form">
                                            <label className="email" htmlFor="userEmail">Email</label>
                                            <br />
                                            <input type="email" id="userEmail" className="emailInput" required />
                                        </div>

                                        <div className="form">
                                            <label className="password" htmlFor="userPassword">Password</label>
                                            <br />
                                            <input type="password" id="userPassword" className="passwordInput" required />
                                        </div>

                                        <div className="forgotPassword">
                                            <button type='submit' className="forgotPasswordButton">Login</button>
                                            <p>Forgot password?</p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="siteContent">
                                <div className="ContentData">
                                    <h3>Powering Superior Product Experiences</h3>
                                    <p>Streamline your product management process with Managemint - the user-friendly platform designed to help you efficiently manage your products. Whether you're an individual seller, a small business owner, or part of a larger enterprise, Managemint provides the tools and features you need to stay organized, track inventory, and boost sales. Join our growing community of satisfied users and take control of your product management today..</p>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    );
}

export default Welcome;