import React, { useState, useEffect, useContext } from "react";
import "./OrgSettingUserGroup.css";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { OrgContext } from "../../context/OrganisationContext";
import { Link, useNavigate } from "react-router-dom";
import Error from "../Error/Error";

const OrgSettingUserGroup = () => {
  const [error, setError] = useState(null);
  const [groupDetail, setGroupDetail] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const navigate = useNavigate();
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  useEffect(() => {
    const callFn = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}`
        );
        setGroupDetail(response.data.data);
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
  }, [setGroupDetail]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectAllChange = (e) => {
    const tempList = [];
    if (e.target.checked) {
      groupDetail.map((group) => {
        tempList.push(group.group_id);
        return tempList;
      });
    }
    setSelectedGroups((prev) => tempList);
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedGroups([...selectedGroups, e.target.name]);
    } else {
      setSelectedGroups((previous) => {
        const newList = [...previous];
        const eleIndex = newList.indexOf(e.target.name);
        if (eleIndex !== -1) {
          newList.splice(eleIndex, 1);
        }
        return newList;
      });
    }
    document.getElementById("selectAllCroups").checked = false;
  };

  const handleDeleteGroups = async () => {
    if (selectedGroups.length === 1) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}?id=${selectedGroups[0]}`
        );
        setGroupDetail((previous) => {
          const newList = [...previous];
          const eleIndex = newList
            .map((group) => group.group_id)
            .indexOf(selectedGroups[0]);
          if (eleIndex !== -1) {
            newList.splice(eleIndex, 1);
          }
          return newList;
        });
        setSelectedGroups([]);
      } catch (error) {
        setError(error);
        alert(error?.response?.data?.message);
      }
    } else {
      try {
        let stringOfIds = "";
        selectedGroups.map((id) => (stringOfIds += id + ","));
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}?id=${stringOfIds}`
        );
        setSelectedGroups([]);
        setGroupDetail((previous) => {
          let newList = [...previous];
          newList = newList.filter(
            (group) => !selectedGroups.includes(group.group_id)
          );
          return newList;
        });
      } catch (error) {
        setError(error);
      }
    }
  };

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (e.target.value.length >= 1) {
        const response = await axios.get(
          /* search all properties */
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}?search=${e.target.value}`
        );
        setGroupDetail(response.data.data);
      } else {
        const allRolesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}`
        );
        setGroupDetail(allRolesResponse.data.data);
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
        <div className="OrgSettingGroup">
          <Error />
        </div>
      ) : (
        <>
          <div className="OrgSettingGroup">
            <div className="User-search-div">
              <div className="searchbar">
                <input
                  id="myInput"
                  className="form-control me-2"
                  type="text"
                  placeholder="Search User Group"
                  aria-label="Search"
                  onChange={handleSearch}
                />
              </div>
              <div className="btn-group-groups">
                <Link
                  className="userGroupLink"
                  to={`/orgs/${orgId}/orgs-setting/userGroup/new-user-group`}
                >
                  <button
                    type="button"
                    id="button-action"
                    className="addUserGroupButton"
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
                </Link>
                <button
                  id="btn-delete-groups"
                  disabled={selectedGroups.length === 0}
                  onClick={handleDeleteGroups}
                >
                  Delete Selected
                </button>
              </div>
            </div>
            <div className="UserGroupTableContent">
              <table className="UserGroupTable">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="groupCheckbox"
                        id="selectAllCroups"
                        onChange={handleSelectAllChange}
                      />
                    </th>
                    <th>User Group</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {groupDetail.length !== 0 ? (
                    groupDetail.map((item, key) => (
                      <tr key={key}>
                        <td>
                          <input
                            type="checkbox"
                            className="groupCheckbox"
                            id={item.group_name}
                            name={item.group_id}
                            checked={selectedGroups.includes(item.group_id)}
                            onChange={handleCheckboxChange}
                          />
                        </td>
                        <td>
                          <Link
                            className="userGroupLink"
                            to={`/orgs/${orgId}/orgs-setting/userGroup/${item.group_id}`}
                          >
                            {item.group_name}
                          </Link>
                        </td>
                        <td>{item.Description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="noMatchedValue">
                      <td colSpan={3}>No Match Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrgSettingUserGroup;
