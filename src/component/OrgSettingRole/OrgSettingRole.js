import { useState } from "react";
import "../OrgSettingRole/OrgSettingRole.css";
import { Add } from "@mui/icons-material";
import { OrgContext } from "../../context/OrganisationContext";
import { useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Error from "../Error/Error";

const OrgSettingRole = () => {
  const navigate = useNavigate();
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState(null);

  /**Fetching all the existing roles from DB*/

  useEffect(() => {
    const callFn = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}`
        );
        setAllRoles(response.data.data);
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
  }, [setAllRoles]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (e.target.value.length >= 1) {
        const response = await axios.get(
          /* search all properties */
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}?search=${e.target.value}`
        );
        setAllRoles(response.data.data);
      } else {
        const allRolesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}`
        );
        setAllRoles(allRolesResponse.data.data);
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

  /**Changes status of all roles checkboxes to checked once selectAllRoles checkbox is checked */
  const handleSelectAllChange = (e) => {
    const tempList = [];
    if (e.target.checked) {
      allRoles.map((role) => {
        if (!(role.role_name === "Administrators")) {
          tempList.push(role.role_id);
        }
        return tempList;
      });
    }
    setSelectedRoles(() => tempList);
  };

  /**Changes status of checkbox and add element to list once checkbox is checked */
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedRoles([...selectedRoles, e.target.name]);
    } else {
      setSelectedRoles((previous) => {
        const newList = [...previous];
        const eleIndex = newList.indexOf(e.target.name);
        if (eleIndex !== -1) {
          newList.splice(eleIndex, 1);
        }
        return newList;
      });
    }
    document.getElementById("selectAllRoles").checked = false;
  };

  /**Handling delete of single and batch roles delete */
  const handleDeleteRoles = async () => {
    if (selectedRoles.length === 1) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}?id=${selectedRoles[0]}`
        );
        setAllRoles((previous) => {
          const newList = [...previous];
          const eleIndex = newList
            .map((role) => role.role_id)
            .indexOf(selectedRoles[0]);
          if (eleIndex !== -1) {
            newList.splice(eleIndex, 1);
          }
          return newList;
        });
        setSelectedRoles([]);
      } catch (error) {
        if (error.response.status === 403) {
          alert(error?.response?.data?.message)
        }
        else {
          setError(error)
        }
      }
    } else {
      try {
        let stringOfIds = "";
        selectedRoles.map((id) => (stringOfIds += id + ","));
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/roles/${orgId}?id=${stringOfIds}`
        );
        setSelectedRoles([]);
        setAllRoles((previous) => {
          let newList = [...previous];
          newList = newList.filter(
            (role) => !selectedRoles.includes(role.role_id)
          );
          return newList;
        });
      } catch (error) {
        setError(error);
        alert(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      {error !== null ? (
        <div className="orgSetting1">
          <Error />
        </div>
      ) : (
        <>
          <div className="User-search-div">
            <div className="searchbar">
              <input
                id="myInput"
                className="form-control me-2"
                type="text"
                placeholder="Search Roles"
                aria-label="Search"
                onChange={handleSearch}
              />
            </div>

            <div className="btn-group-roles">
              <Link
                className="userGroupLink"
                to={`/orgs/${orgId}/orgs-setting/roles/new-user-role`}
              >
                <button id="btn-add-roles">
                  <Add
                    sx={{
                      color: "white",
                      fontSize: 20,
                      margin: "0px 5px 0px 0px",
                    }}
                  />
                  Add Role
                </button>
              </Link>
              <button
                id="btn-delete-roles"
                disabled={selectedRoles.length === 0}
                onClick={handleDeleteRoles}
              >
                Delete Selected
              </button>
            </div>
          </div>
          <div className="RoleTableContent">
            <table className="RoleTable">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="roleCheckbox"
                      id="selectAllRoles"
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th id="roleNameTableHead">Role</th>
                  <th id="roleDescriptionTableHead">Description</th>
                </tr>
              </thead>
              <tbody>
                {allRoles.length !== 0 ? (
                  allRoles.map((role, key) => {
                    return (
                      <tr key={key}>
                        <td>
                          <input
                            type="checkbox"
                            className="roleCheckbox"
                            id={role.role_name}
                            name={role.role_id}
                            checked={selectedRoles.includes(role.role_id)}
                            disabled={
                              role.role_name === "Administrators" ? true : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        </td>
                        <td className={role.role_name !== "Administrators" ? "roleName" : "disableName"}><Link className={role.role_name !== "Administrators" ? "userGroupLink" : "disableLink"} to={role.role_name !== "Administrators" ? `/orgs/${orgId}/orgs-setting/roles/${role.role_id}` : null}>{role.role_name}</Link></td>
                        <td className={role.role_name !== "Administrators" ? "roleDescription" : "disableDescription"}>{role.description}</td>
                      </tr>
                    )
                  })) :
                  <tr className="noMatchedValue">
                    <td colSpan={3}>No Match Found</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </>
      )
      }
    </>
  );
};

export default OrgSettingRole;
