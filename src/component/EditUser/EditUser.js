import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditUser.css";
import { Avatar } from "@mui/material";
import { Add } from "@mui/icons-material";
import { OrgContext } from "../../context/OrganisationContext";
import axios from "axios";
import Capitalize from "../../utils/Capitalize";
import StringAvatar from "../../utils/StringAvatar";
import Error from "../Error/Error";

const EditUser = () => {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState({});
  const { orgId } = useContext(OrgContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [selectRole, setSelectRole] = useState([]);
  const [selectGroup, setSelectGroup] = useState([]);
  const [allRole, setAllRole] = useState([]);
  const [allGroup, setAllGroup] = useState([]);
  const [selectDeleteRole, setSelectDeleteRole] = useState([]);
  const [selectDeleteGroup, setSelectDeleteGroup] = useState([]);

  useEffect(() => {
    const callFn = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}/${userId}`
        );
        setUserDetail(response.data.data);
        response.data.data.roles.forEach((role) => {
          setSelectRole((prev) => [...prev, role.role_name]);
        });
        response.data.data.groups.forEach((group) => {
          setSelectGroup((prev) => [...prev, group.group_name]);
        });
        const roleResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}`
        );
        setAllRole(roleResponse.data.data);
        const groupResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}`
        );
        setAllGroup(groupResponse.data.data);
      } catch (error) {
        setError({ error });
        if (error.response?.status === 401) {
          alert("Session Expired! Please Login Again.");
          navigate("/");
        }
      }
    };
    callFn();
  }, [setUserDetail, setSelectRole, setSelectGroup]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectAllRole = (e) => {
    if (e.target.checked) {
      const allSelectedRole = allRole.map((role) => role.role_name);
      setSelectRole(allSelectedRole);
    } else {
      setSelectRole([]);
    }
  };

  const handleSelectRole = (e, roleName) => {
    if (e.target.checked) {
      setSelectRole([...selectRole, roleName]);
    } else {
      setSelectRole(selectRole.filter((item) => item !== roleName));
    }
  };

  const handleRole = async (e) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}/${userId}`,
        {
          roles: selectRole,
        }
      );
      window.location.reload();
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteAllRole = (e) => {
    if (e.target.checked) {
      const allSelectedRole = selectRole.map((role) => role);
      setSelectDeleteRole(allSelectedRole);
    } else {
      setSelectDeleteRole([]);
    }
  };

  const handleDeleteRole = (e, roleName) => {
    if (e.target.checked) {
      setSelectDeleteRole([...selectDeleteRole, roleName]);
    } else {
      setSelectDeleteRole(selectDeleteRole.filter((item) => item !== roleName));
    }
  };

  const handleSaveDeleteRole = async () => {
    try {
      selectDeleteRole.forEach((role) => {
        const eleIndex = selectRole.findIndex(
          (selectRole) => selectRole === role
        );
        selectRole.splice(eleIndex, 1);
      });
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}/${userId}`,
        {
          roles: selectRole,
        }
      );
      window.location.reload();
    } catch (error) {
      setError(error);
    }
  };

  const handleSelectAllGroup = (e) => {
    if (e.target.checked) {
      const allSelectedGroup = allGroup.map((group) => group.group_name);
      setSelectGroup(allSelectedGroup);
    } else {
      setSelectGroup([]);
    }
  };

  const handleSelectGroup = (e, groupName) => {
    if (e.target.checked) {
      setSelectGroup([...selectGroup, groupName]);
    } else {
      setSelectGroup(selectGroup.filter((item) => item !== groupName));
    }
  };

  const handleGroup = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}/${userId}`,
        {
          groups: selectGroup,
        }
      );
      window.location.reload();
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteAllGroup = (e) => {
    if (e.target.checked) {
      const allSelectedGroup = selectGroup.map((group) => group);
      setSelectDeleteGroup(allSelectedGroup);
    } else {
      setSelectDeleteGroup([]);
    }
  };

  const handleDeleteGroup = (e, groupName) => {
    if (e.target.checked) {
      setSelectDeleteGroup([...selectDeleteGroup, groupName]);
    } else {
      setSelectDeleteGroup(
        selectDeleteGroup.filter((item) => item !== groupName)
      );
    }
  };

  const handleSaveDeleteGroup = async () => {
    try {
      selectDeleteGroup.forEach((group) => {
        const eleIndex = selectGroup.findIndex(
          (selectGroup) => selectGroup === group
        );
        selectGroup.splice(eleIndex, 1);
      });
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}/${userId}`,
        {
          groups: selectGroup,
        }
      );
      window.location.reload();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      {error !== null ? (
        <div className="userDetails">
          <Error />
        </div>
      ) : (
        <>
          <div className="userDetails">
            <div className="user_name">
              {userDetail.first_name !== undefined ? (
                <>
                  <Avatar
                    {...StringAvatar(
                      `${userDetail.first_name} ${userDetail.last_name}`
                    )}
                  />
                  <h4 className="name">
                    {Capitalize(
                      `${userDetail.first_name} ${userDetail.last_name}`
                    )}
                  </h4>
                </>
              ) : null}
            </div>
            <div className="user-details">
              <div className="detail">
                <p className="heading">Firstname</p>
                <p>{userDetail.first_name}</p>
              </div>
              <div className="detail">
                <p className="heading">Lastname</p>
                <p>{userDetail.last_name}</p>
              </div>
              <div className="detail">
                <p className="heading">Email</p>
                <p>{userDetail.email}</p>
              </div>
              <div className="detail">
                <p className="heading">last Active</p>
                <p>{userDetail.last_active_time}</p>
              </div>
            </div>
            <div className="roleandgroup">
              <div className="userRole">
                <div className="roleHead">
                  <h5>Roles</h5>
                  <div className="roleButton">
                    <div className="btnEditGroup">
                      <button
                        type="button"
                        className="selectedButton"
                        onClick={handleSaveDeleteRole}
                        disabled={selectDeleteRole.length === 0 ? true : false}
                      >
                        Remove Selected
                      </button>
                      <button
                        type="button"
                        className="addGroupButton"
                        data-bs-toggle="modal"
                        data-bs-target="#addRoleModal"
                      >
                        <Add
                          sx={{
                            color: "white",
                            fontSize: 20,
                            margin: "0px 5px 0px 0px",
                          }}
                        />
                        Add Role
                      </button>
                      <div
                        className="modal fade"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="addRoleModalLabel"
                        aria-hidden="true"
                        id="addRoleModal"
                      >
                        <div className="modal-dialog modal-lg">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="addRoleModalLabel"
                              >
                                Add Role
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="AllRoleTableContent">
                                <table className="AllRoleTable">
                                  <thead>
                                    <tr>
                                      <th>
                                        <input
                                          type="checkbox"
                                          className="AllCheckbox"
                                          id="selectAllGroups"
                                          onChange={handleSelectAllRole}
                                        />
                                      </th>
                                      <th>User Group</th>
                                      <th>Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allRole.map((role) => {
                                      if (
                                        !userDetail.roles.some(
                                          (item) =>
                                            item.role_name === role.role_name
                                        )
                                      ) {
                                        return (
                                          <tr key={role.role_id}>
                                            <td>
                                              <input
                                                type="checkbox"
                                                className="AllCheckbox"
                                                id={role.role_name}
                                                name={role.role_id}
                                                onChange={(e) =>
                                                  handleSelectRole(
                                                    e,
                                                    role.role_name
                                                  )
                                                }
                                                checked={selectRole.includes(
                                                  role.role_name
                                                )}
                                              />
                                            </td>
                                            <td>{role.role_name}</td>
                                            <td>{role.description}</td>
                                          </tr>
                                        );
                                      } else {
                                        return (
                                          <tr key={role.role_id}>
                                            <td>
                                              <input
                                                type="checkbox"
                                                className="AllCheckbox"
                                                id={role.role_name}
                                                name={role.role_id}
                                                checked={true}
                                                disabled
                                              />
                                            </td>
                                            <td style={{ color: "#C6C6C6 " }}>
                                              {role.role_name}
                                            </td>
                                            <td style={{ color: "#C6C6C6 " }}>
                                              {role.description}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                </table>
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
                                  onClick={handleRole}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr
                  className="line"
                  style={{ borderBottom: "1px solid grey" }}
                />
                <div className="roleTableContent">
                  <table className="roleTable">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            id="selectAll"
                            className="AllCheckbox"
                            onChange={handleDeleteAllRole}
                          />
                        </th>
                        <th>Role</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(userDetail).length !== 0
                        ? userDetail.roles.map((role) => (
                            <tr key={role.role_id}>
                              <td>
                                <input
                                  type="checkbox"
                                  id="selectAll"
                                  className="AllCheckbox"
                                  onChange={(e, roleName) =>
                                    handleDeleteRole(e, role.role_name)
                                  }
                                  checked={selectDeleteRole.includes(
                                    role.role_name
                                  )}
                                />
                              </td>
                              <td>{role.role_name}</td>
                              <td>{role.description}</td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
              <br></br>
              <br></br>
              <div className="userGroup">
                <div className="groupHead">
                  <h5>User Groups</h5>
                  <div className="groupButton">
                    <div className="btnEditGroup">
                      <button
                        type="button"
                        className="selectedButton"
                        disabled={selectDeleteRole.length === 0 ? true : false}
                        onClick={handleSaveDeleteGroup}
                      >
                        Remove Selected
                      </button>
                      <button
                        type="button"
                        className="addGroupButton"
                        data-bs-toggle="modal"
                        data-bs-target="#addGroupModal"
                      >
                        <Add
                          sx={{
                            color: "white",
                            fontSize: 20,
                            margin: "0px 5px 0px 0px",
                          }}
                        />
                        Add User Group
                      </button>
                      <div
                        className="modal fade"
                        id="addGroupModal"
                        tabIndex="-1"
                        aria-labelledby="addGroupModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-lg">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="addGroupModalLabel"
                              >
                                Add User Group
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="AllUserGroupTableContent">
                                <table className="AllUserGroupTable">
                                  <thead>
                                    <tr>
                                      <th>
                                        <input
                                          type="checkbox"
                                          className="AllCheckbox"
                                          id="selectAllCroups"
                                          onChange={handleSelectAllGroup}
                                        />
                                      </th>
                                      <th>User Group</th>
                                      <th>Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allGroup.map((group) => {
                                      if (
                                        !userDetail.groups.some(
                                          (item) =>
                                            item.group_name === group.group_name
                                        )
                                      ) {
                                        return (
                                          <tr key={group.group_id}>
                                            <td>
                                              <input
                                                type="checkbox"
                                                className="AllCheckbox"
                                                id={group.group_name}
                                                name={group.group_id}
                                                checked={selectGroup.includes(
                                                  group.group_name
                                                )}
                                                onChange={(e) =>
                                                  handleSelectGroup(
                                                    e,
                                                    group.group_name
                                                  )
                                                }
                                              />
                                            </td>
                                            <td>{group.group_name}</td>
                                            <td>{group.Description}</td>
                                          </tr>
                                        );
                                      } else {
                                        return (
                                          <tr key={group.group_id}>
                                            <td>
                                              <input
                                                type="checkbox"
                                                className="AllCheckbox"
                                                id={group.group_name}
                                                name={group.group_id}
                                                checked={true}
                                                disabled
                                              />
                                            </td>
                                            <td style={{ color: "#C6C6C6 " }}>
                                              {group.group_name}
                                            </td>
                                            <td style={{ color: "#C6C6C6 " }}>
                                              {group.Description}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                </table>
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
                                  onClick={handleGroup}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr
                  className="line"
                  style={{ borderBottom: "1px solid grey" }}
                />
                <div className="groupTableContent">
                  <table className="groupTable">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            id="selectAll"
                            className="AllCheckbox"
                            onChange={handleDeleteAllGroup}
                          />
                        </th>
                        <th>User Group</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(userDetail).length !== 0
                        ? userDetail.groups.map((group) => (
                            <tr key={group.group_id}>
                              <td>
                                <input
                                  type="checkbox"
                                  id="selectAll"
                                  className="AllCheckbox"
                                  onChange={(e) =>
                                    handleDeleteGroup(e, group.group_name)
                                  }
                                  checked={selectDeleteGroup.includes(
                                    group.group_name
                                  )}
                                />
                              </td>
                              <td>{group.group_name}</td>
                              <td>{group.Description}</td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EditUser;
