import { React, useState, useEffect, useContext } from "react";
import { OrgContext } from "../../context/OrganisationContext";
import "../AddAndEditUserRole/AddAndEditUserRole.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaPencilAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import Error from "../Error/Error";

const AddAndEditRole = () => {
  const [configurations, setConfigurations] = useState(true);
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);
  const [roleDetails, setRoleDetails] = useState({});
  const [error, setError] = useState(null);
  const { roleId } = useParams();
  const navigate = useNavigate();
  const listOfEntities = [
    "Taxonomies and Validations",
    "Properties",
    "Property Groups",
    "Roles",
    "User Profiles",
  ];
  const [entityPermissions, setEntityPermissions] = useState({});
  const [useModePermissions, setUseModePermissions] = useState([]);

  const handleConfiguration = () => {
    setConfigurations(!configurations);
  };

  const handleChange = (e) => {
    try {
      const name = e.target.name;
      const value = e.target.value;
      setRoleDetails({
        ...roleDetails,
        [name]: value,
      });
    } catch (error) {
      setError({ error });
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const payload = { ...roleDetails, permissions: entityPermissions };
    try {
      if (roleId !== "new-user-role") {
        await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}/${roleId}`,
          payload
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}`,
          payload
        );
      }
      navigate(`/orgs/${orgId}/orgs-setting/roles`);
    } catch (error) {
      setError({ error });
    }
  };

  useEffect(() => {
    const getRoleById = async () => {
      try {
        if (roleId !== "new-user-role") {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}/${roleId}`
          );
          setRoleDetails(response.data.data);
          setEntityPermissions(response.data.data.permissions);
        }
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
    getRoleById();
  }, [setRoleDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  const setInitialState = () => {
    listOfEntities.forEach((entityName) => {
      setEntityPermissions((previous) => {
        return { ...previous, [entityName]: "View" };
      });
    });
  };

  useEffect(() => {
    setInitialState();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (entityName, action) => {
    setUseModePermissions([]);
    setEntityPermissions((previous) => {
      return { ...previous, [entityName]: action };
    });
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setUseModePermissions((previous) => [...previous, event.target.value]);
      setEntityPermissions((previous) => {
        return {
          ...previous,
          [event.target.name]: [...useModePermissions, event.target.value],
        };
      });
    } else {
      setUseModePermissions((previous) => {
        let tempArray = [...previous];
        let eleIndex = tempArray.indexOf(event.target.value);
        if (eleIndex !== -1) {
          tempArray.splice(eleIndex, 1);
        }

        return tempArray;
      });
      setEntityPermissions((previous) => {
        return { ...previous, [event.target.name]: useModePermissions };
      });
    }
  };

  const handleEmailClick = (userId) => {
    navigate(`/orgs/${orgId}/orgs-setting/users/${userId}`);
  };

  return (
    <>
      {error !== null ? (
        <div className="editUserRole">
          <Error />
        </div>
      ) : (
        <>
          <div className="editUserRole">
            <div className="editUserRoleTopNav">
              <div
                className={configurations ? "topNavItemActive" : "topNavItem"}
                onClick={handleConfiguration}
              >
                <p>Configurations</p>
              </div>
              <div
                className={configurations ? "topNavItem" : "topNavItemActive"}
                onClick={handleConfiguration}
              >
                <p>Users</p>
              </div>
            </div>
            {configurations ? (
              <div id="configurations">
                <div className="configurationOne">
                  <div className="editUserRoleButton">
                    <h3 className="editUserRoleHeading">
                      {roleId !== "new-user-role" ? "Edit" : "Add"} User Role
                    </h3>

                    <div className="UserRoleButton">
                      <button
                        className="editUserRoleCancelButton"
                        onClick={() => {
                          navigate(`/orgs/${orgId}/orgs-setting/roles`);
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        className="editUserRoleSaveButton"
                        type="submit"
                        form="role-details-form"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <form id="role-details-form" onSubmit={handleSave}>
                    <div className="editUserRoleForm">
                      <div className="userRoleTitle">
                        <label className="userRoleTitleLabel">Role Title:</label>
                        <br />
                        <input
                          className="userRoleTitleInput"
                          name="role_name"
                          defaultValue={
                            roleId !== "new-user-role" ? roleDetails.role_name : null
                          }
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="userRoleDescription">
                        <label className="userRoleDescriptionLabel">
                          Description:
                        </label>
                        <br />
                        <textarea
                          style={{
                            height: "80px",
                            width: "60%",
                            borderRadius: "5px",
                            border: "1px solid rgb(187, 187, 187)",
                            paddingLeft: "5px",
                          }}
                          name="description"
                          className="userRoleDescriptionInput"
                          defaultValue={
                            roleId !== "new-user-role"
                              ? roleDetails.description
                              : null
                          }
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="configurationTwo">
                  <div className="div-table">
                    <table>
                      <thead>
                        <tr className="tr-head">
                          <th className="th-title">Application Permission</th>
                          <th className="th-icon">Hidden</th>
                          <th className="th-icon">View</th>
                          <th className="th-icon">Use</th>
                          <th className="th-icon">Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listOfEntities.map((entityName, key) => {
                          return (
                            <tr key={key}>
                              <td className="entity-name">
                                {entityName}
                                {entityPermissions[entityName] instanceof
                                  Array ? (
                                  <div className="use-permission-major-div">
                                    <div className="use-permission-checkbox-div">
                                      <div>
                                        <input
                                          type="checkbox"
                                          name={entityName}
                                          value={"Create"}
                                          checked={
                                            entityPermissions[
                                              entityName
                                            ].includes("Create")
                                              ? true
                                              : false
                                          }
                                          onChange={handleCheckboxChange}
                                        />{" "}
                                        Create{" "}
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          name={entityName}
                                          value={"Update"}
                                          checked={
                                            entityPermissions[
                                              entityName
                                            ].includes("Update")
                                              ? true
                                              : false
                                          }
                                          onChange={handleCheckboxChange}
                                        />{" "}
                                        Update{" "}
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          name={entityName}
                                          value={"Delete"}
                                          checked={
                                            entityPermissions[
                                              entityName
                                            ].includes("Delete")
                                              ? true
                                              : false
                                          }
                                          onChange={handleCheckboxChange}
                                        />{" "}
                                        Delete{" "}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </td>
                              <td
                                className={
                                  entityPermissions[entityName] === "Hidden"
                                    ? "td-icon-selected"
                                    : "td-icon"
                                }
                                name="Hidden"
                                onClick={() =>
                                  handleClick(entityName, "Hidden")
                                }
                              >
                                <FaEyeSlash size={"1.1em"} />
                              </td>
                              <td
                                className={
                                  entityPermissions[entityName] === "View"
                                    ? "td-icon-selected"
                                    : "td-icon"
                                }
                                name="View"
                                onClick={() => handleClick(entityName, "View")}
                              >
                                <FaEye size={"1.1em"} />
                              </td>
                              <td
                                className={
                                  entityPermissions[entityName] instanceof Array
                                    ? "td-icon-selected"
                                    : "td-icon"
                                }
                                name="Use"
                                onClick={() => handleClick(entityName, [])}
                              >
                                <FaPencilAlt size={"1.1em"} />
                              </td>
                              <td
                                className={
                                  entityPermissions[entityName] === "Manage"
                                    ? "td-icon-selected"
                                    : "td-icon"
                                }
                                name="Manage"
                                onClick={() =>
                                  handleClick(entityName, "Manage")
                                }
                              >
                                <IoSettings size={"1.1em"} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div id="users">
                <div className="all-user-table">
                  <table>
                    <thead>
                      <tr className="all-user-thead-tr">
                        <th className="all-user-email-th">Email</th>
                        <th className="all-user-fullname-th">FullName</th>
                        <th className="all-user-last-active-th">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="all-user-tbody">
                      {roleDetails.users &&
                        roleDetails.users.map((user, key) => {
                          return (
                            <tr key={key}>
                              <td
                                className="all-user-email-td"
                                onClick={() => handleEmailClick(user.user_id)}
                              >
                                {user.email}
                              </td>
                              <td>{user.first_name + " " + user.last_name}</td>
                              <td>{user.last_active_time}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div >
        </>
      )
      }
    </>
  );
};

export default AddAndEditRole;
