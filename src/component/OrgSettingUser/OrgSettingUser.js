import React, { useState, useEffect, useContext } from "react";
import "./OrgSettingUser.css";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { OrgContext } from "../../context/OrganisationContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Error from "../Error/Error";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";

const OrgSettingUser = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    roles: [],
    groups: [],
  });

  const [allUser, setAllUser] = useState([]);
  const [usersMetaData, setUsersMetaData] = useState({});
  const [allRole, setAllRole] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);
  const navigate = useNavigate();

  useEffect(() => {
    const callFn = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}`
        );
        setAllUser(response.data.data);
        setUsersMetaData(response.data.meta_data);
        const roleResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}`
        );
        setAllRole(roleResponse.data.data);
      } catch (error) {
        setError({ error });
        if (error.response?.status === 401) {
          alert("Session Expired! Please Login Again.");
          removeCookie("Id", { path: "/" });
          setOrgId("");
          navigate("/");
        }
      }
    };
    callFn();
  }, [setAllUser]); // eslint-disable-line react-hooks/exhaustive-deps

  //handling pagination here using API
  const handlePagination = async (url) => {
    try {
      /* getting next page url from meta data */
      const response = await axios.get(url);
      setAllUser(response.data.data);
      setUsersMetaData(response.data.meta_data);
    } catch (error) {
      setError({ error });
    }
  };

  /**To handle changes in fields of user registration form */
  const handleChange = (e) => {
    try {
      const name = e.target.name;
      const value = e.target.value;
      if (e.target.name === "roles") {
        setUser({
          ...user,
          [name]: [value],
        });
      } else {
        setUser({
          ...user,
          [name]: value,
        });
      }
    } catch (error) {
      setError({ error });
    }
  };

  /**Registers a new user */
  const handleSubmit = async (e) => {
    try {
      await axios(
        `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}`,
        {
          method: "POST",
          data: user,
        }
      );
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId("");
        navigate("/");
      }
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 1) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}?id=${selectedUsers[0]}`
        );
        setAllUser((previous) => {
          const newList = [...previous];
          const eleIndex = newList
            .map((user) => user.user_id)
            .indexOf(selectedUsers[0]);
          if (eleIndex !== -1) {
            newList.splice(eleIndex, 1);
          }
          return newList;
        });
        setSelectedUsers([]);
      } catch (error) {
        setError(error);
        alert(error?.response?.data?.message);
      }
    } else {
      try {
        let stringOfIds = "";
        selectedUsers.map((id) => (stringOfIds += id + ","));
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}?id=${stringOfIds}`
        );
        setSelectedUsers([]);
        setAllUser((previous) => {
          let newList = [...previous];
          newList = newList.filter(
            (user) => !selectedUsers.includes(user.user_id)
          );
          return newList;
        });
      } catch (error) {
        setError(error);
      }
    }
  };

  const handleSelectAllChange = (e) => {
    const tempList = [];
    if (e.target.checked) {
      allUser.map((user) => {
        tempList.push(user.user_id);
        return tempList;
      });
    }
    setSelectedUsers((prev) => tempList);
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, e.target.name]);
    } else {
      setSelectedUsers((previous) => {
        const newList = [...previous];
        const eleIndex = newList.indexOf(e.target.name);
        if (eleIndex !== -1) {
          newList.splice(eleIndex, 1);
        }
        return newList;
      });
    }
    document.getElementById("selectAllUsers").checked = false;
  };

  /** Handles search for user whenever 3 or more letters are in search bar */
  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (e.target.value.length >= 1) {
        const response = await axios.get(
          /* search all properties */
          `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}?search=${e.target.value}`
        );
        setAllUser(response.data.data);
        setUsersMetaData(response.data.meta_data);
      }
    } catch (error) {
      setError({ error });
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId({});
        navigate("/");
      }
    }
  };

  return (
    <>
      {error !== null ? (
        <div className="OrgSetting">
          <Error />
        </div>
      ) : (
        <>
          <div className="OrgSetting">
            <div className="User-search-div">
              <div className="searchbar">
                <input
                  id="myInput"
                  className="form-control me-2"
                  type="text"
                  placeholder="Search User"
                  aria-label="Search"
                  onChange={handleSearch}
                />
              </div>
              <div className="btn-group-users">
                <button
                  type="button"
                  id="button-action"
                  className="addUserButton"
                  data-bs-toggle="modal"
                  data-bs-target="#addUserModal"
                >
                  <Add
                    sx={{
                      color: "white",
                      fontSize: 20,
                      margin: "0px 5px 0px 0px",
                    }}
                  />
                  Add Users
                </button>
                <div
                  className="modal fade"
                  id="addUserModal"
                  tabIndex="-1"
                  aria-labelledby="addUserModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="addUserModalLabel">
                          Add User to Managemint
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-2">
                            <label
                              htmlFor="userFirstName"
                              className="form-label label-name"
                            >
                              Firstname:
                            </label>
                            <input
                              id="userFirstName"
                              name="first_name"
                              type="text"
                              className="form-control form-control-sm userFirstNameInput"
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label
                              htmlFor="userLastName"
                              className="form-label label-name"
                            >
                              Lastname:
                            </label>
                            <input
                              id="userLastName"
                              name="last_name"
                              type="text"
                              className="form-control form-control-sm userLastNameInput"
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label
                              htmlFor="userEmail"
                              className="form-label label-name"
                            >
                              Email:
                            </label>
                            <input
                              id="userEmail"
                              name="email"
                              type="text"
                              className="form-control form-control-sm userEmailInput"
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label
                              htmlFor="userPassword"
                              className="form-label label-name"
                            >
                              Password:
                            </label>
                            <input
                              id="userPassword"
                              name="password"
                              type="password"
                              className="form-control form-control-sm userPasswordInput"
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label
                              htmlFor="userRole"
                              className="form-label label-name"
                            >
                              Role
                            </label>
                            <select
                              className="form-select mb-2 form-select-sm"
                              aria-label="Default select example"
                              name="roles"
                              id="userRoleSelectBox"
                              onChange={handleChange}
                              required
                              onClick={() => {
                                document
                                  .getElementById("userRoleSelectBox")
                                  .blur();
                              }}
                              onFocus={() =>
                                (document.getElementById(
                                  "userRoleSelectBox"
                                ).size = 3)
                              }
                              onBlur={() =>
                                (document.getElementById(
                                  "userRoleSelectBox"
                                ).size = 1)
                              }
                            >
                              <option value="" hidden>
                                Choose a role for user
                              </option>
                              {allRole.map((role) => {
                                return (
                                  <option
                                    key={role.role_id}
                                    value={role.role_name}
                                  >
                                    {role.role_name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary btn-sm"
                              onClick={handleSubmit}
                            >
                              Add User
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  id="btn-delete-users"
                  disabled={selectedUsers.length === 0}
                  onClick={handleDeleteUsers}
                >
                  Delete Selected
                </button>
              </div>
            </div>
            <div className="UsersTableContent">
              <table className="UsersTable">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="usersCheckbox"
                        id="selectAllUsers"
                        onChange={handleSelectAllChange}
                      />
                    </th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Groups</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allUser.map((val, key) => {
                    return (
                      <tr key={key}>
                        <td>
                          <input
                            type="checkbox"
                            className="usersCheckbox"
                            id={val.email}
                            name={val.user_id}
                            checked={selectedUsers.includes(val.user_id)}
                            onChange={handleCheckboxChange}
                          />
                        </td>
                        <td>
                          <Link
                            className="userLink"
                            to={`/orgs/${orgId}/orgs-setting/users/${val.user_id}`}
                          >
                            {val.email}
                          </Link>
                        </td>
                        <td>
                          {val.roles.map((role) => {
                            return (
                              <span className="NameSpan">
                                {role["role_name"]}
                              </span>
                            );
                          })}
                        </td>
                        <td>
                          {val.groups.map((group) => {
                            return (
                              <span className="NameSpan">
                                {group["group_name"]}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="users-page-pagination">
              <div className="pagination-div">
                <div className="pagination-details-div">
                  Showing{" "}
                  <span className="pagination-numbers">
                    {usersMetaData.total_records
                      ? usersMetaData.from_record_number
                      : 0}{" "}
                  </span>
                  - {""}
                  <span className="pagination-numbers">
                    {usersMetaData.to_record_number
                      ? usersMetaData.to_record_number
                      : 0}{" "}
                  </span>
                  of{" "}
                  <span className="pagination-numbers">
                    {usersMetaData.total_records
                      ? usersMetaData.total_records
                      : 0}{" "}
                  </span>
                </div>
                <div className="pagination-buttons-div">
                  <button
                    className={
                      usersMetaData.previous_page
                        ? "pagination-button"
                        : "pagination-button-disabled"
                    }
                    disabled={usersMetaData.previous_page !== "" ? false : true}
                    onClick={() =>
                      handlePagination(usersMetaData.previous_page)
                    }
                  >
                    <TbPlayerTrackPrevFilled />
                  </button>
                  <button className="pagination-button-currentPage" disabled>
                    {usersMetaData.current_page
                      ? usersMetaData.current_page
                      : 1}
                  </button>
                  <button
                    className={
                      usersMetaData.next_page
                        ? "pagination-button"
                        : "pagination-button-disabled"
                    }
                    disabled={usersMetaData.next_page !== "" ? false : true}
                    onClick={() => handlePagination(usersMetaData.next_page)}
                  >
                    <TbPlayerTrackNextFilled />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrgSettingUser;
