import React, { useState, useEffect, useContext } from "react";
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import "./PropertyGroup.css";
import axios from "axios";
import Error from "../Error/Error";
import { useNavigate } from "react-router-dom";
import { OrgContext } from "../../context/OrganisationContext";
// CONSTANTS
const GROUP_PROPERTY_NAME = "property_group_name";

const PropertyGroup = () => {
  const navigate = useNavigate();
  const [paginationData, setPaginationData] = useState({});

  const [propertyGroup, setPropertyGroup] = useState({
    property_group_name: "",
  });

  const [propertyGroupList, setPropertyGroupList] = useState([]);

  const [error, setError] = useState(null);
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  useEffect(() => {
    const callFn = async () => {
      try {
        const response = await axios.get(
          /* getting all property groups */
          `${process.env.REACT_APP_BASE_URL}/api/property-groups/${orgId}`
        );
        setPropertyGroupList(response.data.data);
        setPaginationData(response.data.meta_data);
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
  }, [setPropertyGroupList, setPaginationData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (e.target.value.length >= 1) {
        /* search from all property groups */
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/property-groups/${orgId}?search=${e.target.value}`
        );
        setPropertyGroupList(response.data.data);
        setPaginationData(response.data.meta_data);
      } else {
        const response = await axios.get(
          /* getting all property groups */
          `${process.env.REACT_APP_BASE_URL}/api/property-groups/${orgId}`
        );
        setPropertyGroupList(response.data.data);
        setPaginationData(response.data.meta_data);
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

  const handleEditChange = (event) => {
    try {
      const { name, value } = event.target;
      setPropertyGroupList((previousList) => {
        const newList = [...previousList];
        /** finding element index in an array */
        const eleIndex = previousList.findIndex(
          (v) => v.property_group_name === name
        );
        /** replacing text content within item */
        newList[eleIndex][GROUP_PROPERTY_NAME] = value;
        return newList;
      });
      setPropertyGroup(value);
    } catch (error) {
      setError({ error });
    }
  };

  const handleChange = (event) => {
    try {
      setPropertyGroup({ property_group_name: event.target.value });
    } catch (error) {
      setError({ error });
    }
  };

  const handleSubmit = async (e) => {
    try {
      if (propertyGroup !== "") {
        await axios({
          method: "POST",
          /* adding property groups */
          url: `${process.env.REACT_APP_BASE_URL}/api/property-groups/${orgId}`,
          data: propertyGroup,
        });
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

  const handleDelete = async (pgroupId) => {
    try {
      await axios.delete(
        /* deleting property group by its id */
        `${process.env.REACT_APP_BASE_URL}/api/property-groups/${orgId}/${pgroupId}`
      );
      window.location.reload(true);
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

  const handleEdit = async (editPropertyGroupId) => {
    try {
      await axios({
        method: "PATCH",
        url:
          /* edit property group */
          `${process.env.REACT_APP_BASE_URL}/api/property-groups/${orgId}/${editPropertyGroupId}`,
        data: {
          property_group_name: propertyGroup,
        },
      });
      window.location.reload(true);
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

  //handling pagination here using API
  const handlePagination = async (url) => {
    try {
      /* getting next page url from meta data */
      const response = await axios.get(url);
      setPropertyGroupList(response.data.data);
      setPaginationData(response.data.meta_data);
    } catch (error) {
      setError({ error });
    }
  };

  return (
    <>
      {error !== null ? (
        <div className="propertyGroupContent">
          <Error />
        </div>
      ) : (
        <>
          <div className="propertyGroupContent">
            <div className="contentHeadGroup">
              <p className="contentHeadGrouptitle1">Property Groups</p>
              <p className="contentHeadGrouptitle2">
                Manage property groups for your organization
              </p>
            </div>
            <div className="searchbar-buttons-div">
              <div className="searchbar">
                <input
                  id="myInput"
                  className="form-control me-2"
                  type="text"
                  placeholder="Search Property Groups"
                  aria-label="Search"
                  onChange={handleSearch}
                />
              </div>
              <button
                className="propertyGroupbutton"
                data-bs-toggle="modal"
                data-bs-target="#addPropertyGroupModal"
              >
                <Add
                  sx={{
                    color: "white",
                    fontSize: 20,
                    margin: "0px 5px 0px 0px",
                  }}
                />
                Create Property Group
              </button>
            </div>
            <div className="propertyTableContent">
              <table className="propertyTable">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {propertyGroupList.length !== 0 ? (
                    propertyGroupList.map((val, key) => {
                      key = key + paginationData.from_record_number;
                      return (
                        <React.Fragment key={key}>
                          <tr>
                            <td>{key}</td>
                            <td>{val.property_group_name}</td>
                            <td>
                              <Edit
                                sx={{
                                  color: "rgb(74, 124, 210)",
                                  cursor: "pointer",
                                }}
                                data-bs-toggle="modal"
                                data-bs-target={"#Modal" + key}
                              />
                              <div
                                className="modal fade"
                                id={"Modal" + key}
                                tabIndex="-1"
                                aria-labelledby={"Modal" + key}
                                aria-hidden="true"
                              >
                                <div className="modal-dialog modal-dialog-centered">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h3
                                        className="modal-title fs-5"
                                        id={"Modal" + key}
                                      >
                                        Edit Property Group
                                      </h3>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="editGroupName">
                                        <label>Property Group Name</label>
                                        <br />
                                        <input
                                          id="PropertyGroupName"
                                          name={val.property_group_name}
                                          className="PropertyGroupInput"
                                          value={val.property_group_name}
                                          onChange={handleEditChange}
                                          style={{
                                            width: "100%",
                                            paddingLeft: "10px",
                                            marginTop: "5px",
                                          }}
                                        />
                                      </div>
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
                                        onClick={() =>
                                          handleEdit(val.property_group_id)
                                        }
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <Delete
                                sx={{
                                  color: "rgb(74, 124, 210)",
                                  cursor: "pointer",
                                }}
                                data-bs-toggle="modal"
                                data-bs-target={
                                  "#PropertyGroupDeleteModal" + key
                                }
                              />
                              <div
                                className="modal fade deletePropertyModal"
                                id={"PropertyGroupDeleteModal" + key}
                                tabIndex="-1"
                                aria-labelledby={
                                  "PropertyGroupDeleteModal" + key
                                }
                                aria-hidden="true"
                              >
                                <div className="modal-dialog modal-dialog-centered">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h3
                                        className="modal-title fs-5"
                                        id={"PropertyGroupDeleteModal" + key}
                                      >
                                        Delete Property Group
                                      </h3>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="deleteGroupModalBody">
                                        <div className="Delete">
                                          <h5 className="Deletehead1">
                                            Delete -
                                          </h5>
                                          <h5 className="Deletehead2">
                                            {val.property_group_name}
                                          </h5>
                                        </div>
                                        <p className="DeletePara">
                                          * All the references will be lost if
                                          you delete this item.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        data-bs-dismiss="modal"
                                      >
                                        No, take me back
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                          handleDelete(val.property_group_id)
                                        }
                                        data-bs-dismiss="modal"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr className="noMatchedValue">
                      <td colSpan={4}>No Match Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <div className="pagination-div">
                <div className="pagination-details-div">
                  Showing{" "}
                  <span className="pagination-numbers">
                    {paginationData.total_records
                      ? paginationData.from_record_number
                      : 0}{" "}
                  </span>
                  - {""}
                  <span className="pagination-numbers">
                    {paginationData.to_record_number
                      ? paginationData.to_record_number
                      : 0}{" "}
                  </span>
                  of{" "}
                  <span className="pagination-numbers">
                    {paginationData.total_records
                      ? paginationData.total_records
                      : 0}{" "}
                  </span>
                </div>
                <div className="pagination-buttons-div">
                  <button
                    className={
                      paginationData.previous_page
                        ? "pagination-button"
                        : "pagination-button-disabled"
                    }
                    disabled={
                      paginationData.previous_page !== "" ? false : true
                    }
                    onClick={() =>
                      handlePagination(paginationData.previous_page)
                    }
                  >
                    <TbPlayerTrackPrevFilled />
                  </button>
                  <button className="pagination-button-currentPage" disabled>
                    {paginationData.current_page
                      ? paginationData.current_page
                      : 1}
                  </button>
                  <button
                    className={
                      paginationData.next_page
                        ? "pagination-button"
                        : "pagination-button-disabled"
                    }
                    disabled={paginationData.next_page !== "" ? false : true}
                    onClick={() => handlePagination(paginationData.next_page)}
                  >
                    <TbPlayerTrackNextFilled />
                  </button>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="addPropertyGroupModal"
              tabIndex="-1"
              aria-labelledby="addPropertyGroupModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-5"
                      id="addPropertyGroupModalLabel"
                    >
                      Create Property Group
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
                      <div className="mb-1 propertyGroupDivision">
                        <label htmlFor="name" className="form-label label-name">
                          Property Group Name
                        </label>
                        <input
                          type="text"
                          name="property_group_name"
                          onChange={handleChange}
                          className="form-control form-control-sm"
                          id="name"
                          required
                        />
                      </div>

                      <div className="modal-footer m-footer">
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
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr></hr>
        </>
      )}
    </>
  );
};

export default PropertyGroup;
