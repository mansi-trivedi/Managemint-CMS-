import React, { useState, useEffect, useContext } from "react";
import "./Property.css";
import { Add, Delete, Visibility } from "@mui/icons-material";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Error from "../Error/Error";
import { usePropertyGroups } from "../../context/ApiDataContext";
import { OrgContext } from "../../context/OrganisationContext";

const Property = () => {
  const navigate = useNavigate();
  /** Accessing the usePropertyGroup Custom Hook which provides the list of all the property groups.*/
  const propertyGroupsList = usePropertyGroups();
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  const [property, setProperty] = useState({
    name: "",
    dataType: "",
    propertyGroup: "",
    required: false,
    localized: false,
  });

  const [propertyList, setPropertyList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const callFn = async () => {
      /* getting all properties by pagination */
      try {
        const response = await axios({
          method: "GET",
          url: `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}`,
        });
        setPropertyList(response.data.data);
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
  }, [setPropertyList, setPaginationData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    try {
      const name = e.target.name;
      const value = e.target.value;
      if (e.target.type === "checkbox") {
        setProperty({
          ...property,
          [name]: !property[name],
        });
      } else {
        setProperty({
          ...property,
          [name]: value,
        });
      }
    } catch (error) {
      setError({ error });
    }
  };

  const handleDelete = async (fieldId) => {
    try {
      await axios.delete(
        /* deleting particular property by its field id */
        `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}?field_id=${fieldId}`
      );
      window.location.reload(true);
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

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (e.target.value.length >= 1) {
        const response = await axios.get(
          /* search all properties */
          `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}?search=${e.target.value}`
        );
        setPropertyList(response.data.data);
        setPaginationData(response.data.meta_data);
      } else {
        const response = await axios({
          method: "GET",
          url: `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}`,
        });
        setPropertyList(response.data.data);
        setPaginationData(response.data.meta_data);
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

  const handleSubmit = async (e) => {
    try {
      const payload = {
        field_name: property.name,
        is_required: property.required,
        localization_required: property.localized,
        field_type: property.dataType,
        property_group_name: property.propertyGroup,
      };

      await axios(
        /* add property */
        `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}`,
        {
          method: "POST",
          data: payload,
        }
      );
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

  //handling pagination here using API
  const handlePagination = async (url) => {
    try {
      /* getting next page url from meta data */
      const response = await axios.get(url);
      setPropertyList(response.data.data);
      setPaginationData(response.data.meta_data);
    } catch (error) {
      setError({ error });
    }
  };

  return (
    <>
      {error !== null ? (
        <div className="PropertyContent">
          <Error />
        </div>
      ) : (
        <>
          <div className="PropertyContent">
            <div className="contentHead">
              <p className="contentHeadtitle1">Properties</p>
              <p className="contentHeadtitle2">
                Manage properties for your organization
              </p>
            </div>
            <div className="search-div">
              <div className="searchbar">
                <input
                  id="myInput"
                  className="form-control me-2"
                  type="text"
                  placeholder="Search Properties"
                  aria-label="Search"
                  onChange={handleSearch}
                />
              </div>
              <div className="btn-group">
                <button
                  type="button"
                  className="actionButton"
                  data-bs-toggle="modal"
                  data-bs-target="#addPropertyModal"
                >
                  <Add
                    sx={{
                      color: "white",
                      fontSize: 20,
                      margin: "0px 5px 0px 0px",
                    }}
                  />
                  Add Property
                </button>
                <div
                  className="modal fade"
                  id="addPropertyModal"
                  tabIndex="-1"
                  aria-labelledby="addPropertyModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="addPropertyModalLabel"
                        >
                          Add Property
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
                          <div className="mb-1">
                            <label
                              htmlFor="name"
                              className="form-label label-name"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              onChange={handleChange}
                              className="form-control form-control-sm"
                              id="name"
                              required
                            />
                          </div>
                          <label
                            htmlFor="dataType"
                            className="form-label label-name"
                          >
                            Data Type
                          </label>
                          <select
                            className="form-select mb-2 form-select-sm"
                            aria-label="Default select example"
                            name="dataType"
                            id="dataTypeSelectBox"
                            onChange={handleChange}
                            required
                            onClick={() => {
                              document
                                .getElementById("dataTypeSelectBox")
                                .blur();
                            }}
                            onFocus={() =>
                              (document.getElementById(
                                "dataTypeSelectBox"
                              ).size = 3)
                            }
                            onBlur={() =>
                              (document.getElementById(
                                "dataTypeSelectBox"
                              ).size = 1)
                            }
                          >
                            <option value="" hidden>
                              Choose a Data Type
                            </option>
                            <option value="String">String</option>
                            <option value="Picklist">Picklist/Category</option>
                            <option value="Number">Number</option>
                            <option value="Boolean">Yes/No</option>
                            <option value="RichText">Rich Text</option>
                            <option value="Html">HTML</option>
                            <option value="Link">Link</option>
                          </select>

                          <label
                            htmlFor="dataType"
                            className="form-label label-name"
                          >
                            Property Group
                          </label>

                          {/* select box */}
                          <div
                            style={{
                              maxHeight: "100px",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <select
                              className="form-select mb-3 form-select-sm"
                              aria-label="Default select example"
                              id="propertyGroupSelectBox"
                              name="propertyGroup"
                              onChange={handleChange}
                              onClick={() => {
                                document
                                  .getElementById("propertyGroupSelectBox")
                                  .blur();
                              }}
                              onFocus={() =>
                                (document.getElementById(
                                  "propertyGroupSelectBox"
                                ).size = 3)
                              }
                              onBlur={() =>
                                (document.getElementById(
                                  "propertyGroupSelectBox"
                                ).size = 1)
                              }
                              required
                            >
                              <option value="" hidden>
                                Choose a Property Group
                              </option>
                              {propertyGroupsList &&
                                propertyGroupsList.map((propertyGroup) => {
                                  return (
                                    <option
                                      value={propertyGroup.property_group_name}
                                      key={propertyGroup.property_group_id}
                                    >
                                      {propertyGroup.property_group_name}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>

                          <div className="mb-1 form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="required"
                              name="required"
                              value={property.required}
                              onChange={handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="required"
                            >
                              Required
                            </label>
                          </div>
                          <div className="mb-1 form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="localized"
                              name="localized"
                              onChange={handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="localized"
                            >
                              Localized
                            </label>
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
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="propertyTableContent">
              <table className="propertyTable">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Data Type</th>
                    <th>Property Group</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {propertyList.length !== 0 ? (
                    propertyList.map((val, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + paginationData.from_record_number}</td>
                          <td>{val.field_name}</td>
                          <td>{val.field_type}</td>
                          <td>{val.property_group_name}</td>
                          <td>
                            <Link
                              to={`/orgs/${orgId}/property/${val.field_id}`}
                            >
                              <Visibility
                                sx={{
                                  color: "rgb(74, 124, 210)",
                                  cursor: "pointer",
                                }}
                              />
                            </Link>
                          </td>
                          <td>
                            <Delete
                              sx={{
                                color: "rgb(74, 124, 210)",
                                cursor: "pointer",
                              }}
                              data-bs-toggle="modal"
                              data-bs-target={"#PropertyDeleteModal" + key}
                            />
                            <div
                              className="modal fade deletePropertyModal"
                              id={"PropertyDeleteModal" + key}
                              tabIndex="-1"
                              aria-labelledby={"PropertyDeleteModal" + key}
                              aria-hidden="true"
                            >
                              <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h3
                                      className="modal-title fs-5"
                                      id={"PropertyDeleteModal" + key}
                                    >
                                      Delete Property
                                    </h3>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="Delete">
                                      <h5 className="Deletehead1">Delete -</h5>
                                      <h5 className="Deletehead2">
                                        {val.field_name}
                                      </h5>
                                    </div>
                                    <p className="DeletePara">
                                      * All the references will be lost if you
                                      delete this item.
                                    </p>
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
                                      onClick={() => handleDelete(val.field_id)}
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
          </div>
        </>
      )}
    </>
  );
};

export default Property;
