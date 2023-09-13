import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logout, Person2, ExpandMore, PeopleAlt } from "@mui/icons-material";
import Flag from "react-flagkit";
import "./TopNav.css";
import axios from "axios";
import { OrgContext } from "../../context/OrganisationContext";
import { Avatar } from "@mui/material";
import Capitalize from "../../utils/Capitalize";
import StringAvatar from "../../utils/StringAvatar";
import Error from "../Error/Error";

const TopNav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { removeCookie, orgId, setOrgId } = useContext(OrgContext);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/logout`
      );
      if (response.status === 200) {
        removeCookie("Id", { path: "/" });
        setOrgId({});
        localStorage.removeItem("user");
        navigate("/");
      }
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId({});
        navigate("/");
      } else {
        alert("Some error occured!!! Please try again.");
      }
    }
  };

  return (
    <>
      {error !== null ? (
        <div>
          <Error />
        </div>
      ) : (
        <>
          <div className="header">
            <div className="logo">
              <Link to={`/orgs/${orgId}/records/allrecords`}>
                <img
                  src={require("../../image/managemint-logo.png")}
                  alt="Logo"
                  height={48}
                  weight={48}
                />
              </Link>
            </div>

            <div
              className="more"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <span>More</span>
              <ExpandMore />
              {isMoreOpen && (
                <div className="moreDropdown">
                  <Link className="_item" to={`/orgs/${orgId}/property`}>
                    <div>
                      <svg
                        className="_item_icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                      >
                        <g fill="#000">
                          <path d="M49.493 9.023c-22.35 0-40.47 18.119-40.47 40.47s18.121 40.471 40.47 40.471c22.351 0 40.471-18.12 40.471-40.471 0-22.351-18.12-40.47-40.471-40.47zm0 75.883c-19.523 0-35.412-15.889-35.412-35.413 0-19.525 15.888-35.412 35.412-35.412s35.413 15.886 35.413 35.412c0 19.525-15.888 35.413-35.413 35.413z"></path>
                          <path d="M49.493 19.141c-16.762 0-30.353 13.588-30.353 30.353 0 16.768 13.59 30.354 30.353 30.354s30.354-13.586 30.354-30.354c0-16.765-13.591-30.353-30.354-30.353zm3.863 34.144h-5.053V64.67h-8.928V30.331H53.04c7.376 0 12.479 3.416 12.479 11.295 0 8.106-4.373 11.659-12.163 11.659z"></path>
                          <path d="M49.805 37.526h-1.501v8.561h1.501c3.235 0 6.422 0 6.422-4.189 0-4.326-2.96-4.372-6.422-4.372z"></path>
                        </g>
                      </svg>
                    </div>
                    <div className="_item-title">Properties</div>
                  </Link>

                  <Link className="_item" to={`/orgs/${orgId}/property-groups`}>
                    <svg
                      className="_item_icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                    >
                      <path
                        fill="#FFF"
                        d="M59.678 11.72c-20.162 0-36.508 16.343-36.508 36.506 0 20.168 16.346 36.508 36.508 36.508 20.161 0 36.506-16.34 36.506-36.508 0-20.163-16.345-36.506-36.506-36.506z"
                      ></path>
                      <path
                        fill="#000"
                        d="M59.806 9.023c-21.721 0-39.333 17.61-39.333 39.333 0 21.722 17.612 39.333 39.333 39.333 21.724 0 39.334-17.611 39.334-39.333 0-21.723-17.611-39.333-39.334-39.333zm0 73.751c-18.974 0-34.416-15.442-34.416-34.418 0-18.977 15.442-34.417 34.416-34.417 18.978 0 34.419 15.439 34.419 34.417 0 18.976-15.442 34.418-34.419 34.418z"
                      ></path>
                      <path
                        fill="#000"
                        d="M59.806 18.856c-16.29 0-29.5 13.206-29.5 29.5 0 16.296 13.209 29.5 29.5 29.5 16.293 0 29.501-13.204 29.501-29.5 0-16.294-13.208-29.5-29.501-29.5z"
                      ></path>
                      <g>
                        <path
                          fill="#FFF"
                          d="M49.958 11.72c-20.16 0-36.507 16.343-36.507 36.506 0 20.168 16.347 36.508 36.507 36.508 20.162 0 36.507-16.34 36.507-36.508 0-20.163-16.346-36.506-36.507-36.506z"
                        ></path>
                        <path
                          fill="#000"
                          d="M50.087 9.023c-21.722 0-39.333 17.61-39.333 39.333 0 21.722 17.612 39.333 39.333 39.333 21.723 0 39.333-17.611 39.333-39.333 0-21.723-17.609-39.333-39.333-39.333zm0 73.751c-18.975 0-34.417-15.442-34.417-34.418 0-18.977 15.441-34.417 34.417-34.417s34.418 15.439 34.418 34.417c.001 18.976-15.443 34.418-34.418 34.418z"
                        ></path>
                        <path
                          fill="#000"
                          d="M50.087 18.856c-16.291 0-29.5 13.206-29.5 29.5 0 16.296 13.209 29.5 29.5 29.5 16.292 0 29.5-13.204 29.5-29.5.001-16.294-13.207-29.5-29.5-29.5z"
                        ></path>
                      </g>
                      <g>
                        <path
                          fill="#000"
                          d="M40.333 9.023C18.612 9.023 1 26.633 1 48.356c0 21.722 17.612 39.333 39.333 39.333 21.722 0 39.334-17.611 39.334-39.333 0-21.723-17.612-39.333-39.334-39.333zm0 73.751c-18.975 0-34.417-15.442-34.417-34.418 0-18.977 15.441-34.417 34.417-34.417s34.418 15.439 34.418 34.417c0 18.976-15.442 34.418-34.418 34.418z"
                        ></path>
                        <path
                          fill="#FFF"
                          d="M40.482 18.856c-16.291 0-29.5 13.206-29.5 29.5 0 16.296 13.209 29.5 29.5 29.5 16.292 0 29.5-13.204 29.5-29.5-.001-16.294-13.208-29.5-29.5-29.5z"
                        ></path>
                        <path
                          fill="#FFF"
                          d="M40.742 13.795c-19.229 0-34.82 15.588-34.82 34.82 0 19.235 15.591 34.821 34.82 34.821S75.564 67.85 75.564 48.615c-.001-19.232-15.593-34.82-34.822-34.82z"
                        ></path>
                        <path
                          fill="#000"
                          d="M40.333 18.856c-16.292 0-29.5 13.206-29.5 29.5 0 16.296 13.208 29.5 29.5 29.5 16.291 0 29.501-13.204 29.501-29.5 0-16.294-13.21-29.5-29.501-29.5zm3.755 33.186h-4.911v11.064H30.5V29.732h13.28c7.167 0 12.129 3.319 12.129 10.978 0 7.879-4.25 11.332-11.821 11.332z"
                        ></path>
                        <path
                          fill="#000"
                          d="M40.636 36.725h-1.459v8.321h1.459c3.145 0 6.241 0 6.241-4.072 0-4.204-2.877-4.249-6.241-4.249z"
                        ></path>
                      </g>
                    </svg>
                    <div className="_item-title">Property Group</div>
                  </Link>
                </div>
              )}
            </div>
            <div
              className="translation"
              onMouseEnter={() => setIsTranslateOpen(true)}
              onMouseLeave={() => setIsTranslateOpen(false)}
            >
              <Flag country="US" size={35} sx={{ border: "2px solid blue" }} />
              {isTranslateOpen && (
                <div className="translateDropdown">
                  <div className="translateLink">
                    <Flag country="US" fontSize="small" />
                    <span style={{ fontSize: "smaller", fontWeight: "500" }}>
                      English(US)-en-US
                    </span>
                  </div>
                  <div className="translateLink">
                    <Flag country="CA" fontSize="small" />
                    <span style={{ fontSize: "smaller", fontWeight: "500" }}>
                      English(CA)-en-CA
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div
              className="userProfile"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <Avatar
                {...StringAvatar(`${user.first_name} ${user.last_name}`)}
              />
              <span className="userName">
                {Capitalize(`${user.first_name} ${user.last_name}`)}
              </span>
              {isProfileOpen && (
                <div className="profiledropDown">
                  <div className="profile">
                    <Link
                      to={`/orgs/51098890-f1e8-469c-87e2-d5693d1a372e/profile`}
                    >
                      <button className="profileLink">
                        <Person2 sx={{ color: "black" }} />
                        <span>My Profile</span>
                      </button>
                    </Link>
                  </div>
                  <div className="profile">
                    <Link to={`/orgs/${orgId}/orgs-setting/users`}>
                      <button className="CompanyLink">
                        <PeopleAlt sx={{ color: "black" }} />
                        <span>My Company</span>
                      </button>
                    </Link>
                  </div>
                  <div className="profile">
                    <button className="logoutButton" onClick={handleLogout}>
                      <Logout sx={{ color: "black" }} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TopNav;
