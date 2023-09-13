import React, { useEffect, useState, useContext } from "react";
import "./ShowProperty.css";
import { Edit, Save, Delete, Cancel } from "@mui/icons-material";
import { AiFillDelete } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Error from "../Error/Error";
import { usePropertyGroups } from "../../context/ApiDataContext";
import { OrgContext } from "../../context/OrganisationContext";

const ShowProperty = () => {
  /** Accessing the usePropertyGroup Custom Hook which provides the list of all the property groups.*/
  const propertyGroupsList = usePropertyGroups();

  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [editTrue, setEditTrue] = useState(false);
  const [property, setProperty] = useState({});
  const [error, setError] = useState(null);
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);
  const [optionButtonSelected, setOptionButtonSelected] = useState();

  const handleChange = (e) => {
    try {
      if (e.target.type === "select-one" && (e.target.name === "localization_required" || e.target.name === "is_required")) {
        const name = e.target.name;
        const value = e.target.value === 'true' ? true : false
        setProperty({
          ...property,
          [name]: value,
        });
      }
      else {
        const name = e.target.name;
        const value = e.target.value;
        setProperty({
          ...property,
          [name]: value,
        });
      }
    } catch (error) {
      setError({ error });
    }
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        /* edit property by its id */
        `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}?field_id=${propertyId}`,
        property
      );
      setEditTrue(false);
      window.location.reload(true);
    } catch (error) {
      setEditTrue(true);
      setError({ error });
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId("");
        navigate("/");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        /* deleting property by its id */
        `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}?field_id=${propertyId}`
      );
      navigate(`/orgs/${orgId}/property`);
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

  const handleOptionButtonClick = (e) => {
    setOptionButtonSelected(e.target.name);
  };

  /** Fetching the property data by ID */
  useEffect(() => {
    const getPropertyData = async () => {
      try {
        const propertyDataResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}?field_id=${propertyId}`
        );
        setProperty(propertyDataResponse.data.data);
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
    getPropertyData();
  }, [setProperty]); // eslint-disable-line react-hooks/exhaustive-deps

  const [payloadz, setPayloadz] = useState({});
  const [listOfValues, setListOfValues] = useState([]);
  const handleNewValueModalDataChange = (e) => {
    setPayloadz({ ...payloadz, [e.target.name]: e.target.value });
  };

  const handleNewValueModal = () => {
    setListOfValues([...listOfValues, payloadz]);
  };

  const handlePicklistValueDelete = (entry) => {
    setListOfValues((previous) => {
      let newList = [...previous];
      newList = newList.filter((value) => entry.ID !== value.ID);
      return newList;
    });
  };

  const handleEditedPicklistValue = () => {
    console.log(payloadz);
    // setListOfValues((previous) => {
    //   let newList = [...previous]
    //   newList.map((value) => {
    //     if (value.ID === entry.ID) {
    //       value.Name = updatedName
    //     }
    //   })
    // })
  };

  return (
    <>
      {error !== null ? (
        <div className="show-property-page-div">
          <Error />
        </div>
      ) : (
        <>
          <div className="show-property-page-div">
            <div className="show-property-head">
              <div>
                <h4>
                  <span>Property-Details</span>
                </h4>
              </div>

              <div className="show-property-button-div">
                {editTrue ? (
                  <button
                    className="editSave"
                    style={{ fontWeight: "500" }}
                    onClick={handleSave}
                    type="submit"
                  >
                    <Save
                      sx={{
                        color: "rgb(74, 124, 210)",
                        fontSize: 20,
                        marginRight: "3px",
                      }}
                    />
                    Save
                  </button>
                ) : (
                  <button
                    className="editSave"
                    onClick={() => setEditTrue(true)}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      fontWeight: "500",
                    }}
                  >
                    <Edit
                      sx={{
                        color: "rgb(74, 124, 210)",
                        fontSize: 20,
                        marginRight: "3px",
                      }}
                    />
                    Edit
                  </button>
                )}
                {editTrue ? (
                  <button
                    className="deleteCancel"
                    onClick={() => {
                      setEditTrue(false);
                      window.location.reload(true);
                    }}
                    style={{ fontWeight: "500" }}
                  >
                    <Cancel
                      sx={{
                        color: "white",
                        fontSize: 20,
                        marginRight: "3px",
                      }}
                    />
                    Cancel
                  </button>
                ) : (
                  <button
                    className="deleteCancel"
                    style={{ fontWeight: "500" }}
                    data-bs-toggle="modal"
                    data-bs-target={"#PropertyDeleteModal"}
                  >
                    <Delete
                      sx={{
                        color: "white",
                        fontSize: 20,
                        marginRight: "3px",
                      }}
                    />
                    Delete
                  </button>
                )}
                <div
                  className="modal fade deletePropertyModal"
                  id={"PropertyDeleteModal"}
                  tabIndex="-1"
                  aria-labelledby={"PropertyDeleteModal"}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3
                          className="modal-title fs-5"
                          id={"PropertyDeleteModal"}
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
                            {property.field_name}
                          </h5>
                        </div>
                        <p className="DeletePara">
                          * All the references will be lost if you delete this
                          item.
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
                          onClick={handleDelete}
                          data-bs-dismiss="modal"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="show-property-page-content">
              <div className="show-property-page-options-buttons">
                <div className="option-button-secondary-div">
                  <button
                    className={
                      optionButtonSelected === "Settings"
                        ? "btn option-buttons-selected"
                        : "btn option-buttons"
                    }
                    name="Settings"
                    onClick={handleOptionButtonClick}
                  >
                    Settings
                  </button>
                  {property.field_type === "Picklist" && (
                    <button
                      className={
                        optionButtonSelected === "Values"
                          ? "btn option-buttons-selected"
                          : "btn option-buttons"
                      }
                      name="Values"
                      onClick={handleOptionButtonClick}
                      disabled={property.field_type !== "Picklist"}
                    >
                      Values
                    </button>
                  )}
                  {/* <button className={optionButtonSelected === "Security" ? "btn option-buttons-selected" : "btn option-buttons"} name="Security" onClick={handleOptionButtonClick} disabled>Security</button> */}
                </div>
              </div>
              <h4>Property Configuration </h4>
              <h6>ID - {property.field_name}</h6>
              {optionButtonSelected === "Values" ? (
                <div>
                  <div className="values-head-div">
                    <div>
                      Children of{" "}
                      <span style={{ fontWeight: "500", paddingLeft: "0px" }}>
                        {property.field_name}
                      </span>
                    </div>
                    <div className="values-head-content-div2">
                      <div>
                        <button
                          className="btn-sm"
                          style={{
                            backgroundColor: "#6396F0",
                            border: "1px solid #6396F0",
                            color: "white",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#NewPickListValueModal"
                        >
                          Create New Value
                        </button>
                      </div>
                      <div
                        className="modal fade NewPickListValueModal"
                        id={"NewPickListValueModal"}
                        tabIndex="-1"
                        aria-labelledby={"NewPickListValueModal"}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h3
                                className="modal-title fs-5"
                                id={"NewPickListValueModal"}
                              >
                                Create New {property.field_name}
                              </h3>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <label
                                htmlFor="Name"
                                className="form-label label-name"
                              >
                                Name:
                                <span
                                  style={{ color: "red", padding: "0px" }}
                                >
                                  *
                                </span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="Name"
                                onChange={handleNewValueModalDataChange}
                              />
                              <label
                                htmlFor="Name"
                                className="form-label label-name"
                              >
                                ID:
                                <span
                                  style={{ color: "red", padding: "0px" }}
                                >
                                  *
                                </span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="ID"
                                onChange={handleNewValueModalDataChange}
                              />
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
                                className="btn btn-primary btn-sm"
                                onClick={handleNewValueModal}
                                data-bs-dismiss="modal"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="values-table-div">
                    <table style={{ width: "100%" }}>
                      <thead className="values-table-thead">
                        <tr>
                          <th></th>
                          <th>ID</th>
                          <th>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listOfValues.map((entry, key) => {
                          return (
                            <tr>
                              <td>
                                <button
                                  style={{
                                    backgroundColor: "white",
                                    border: "none",
                                  }}
                                  name={key}
                                  onClick={() =>
                                    handlePicklistValueDelete(entry)
                                  }
                                >
                                  <AiFillDelete color="red" size={"1.3em"} />
                                </button>
                              </td>
                              <td>{entry.ID}</td>
                              <td>
                                {entry.Name}
                                <button
                                  style={{
                                    marginRight: "15px",
                                    color: "#6396F0",
                                    backgroundColor: "white",
                                    border: "none",
                                  }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#EditPickListValueModal"
                                >
                                  <Edit />
                                </button>
                              </td>
                              <div
                                className="modal fade EditPickListValueModal"
                                id={"EditPickListValueModal"}
                                tabIndex="-1"
                                aria-labelledby={"EditPickListValueModal"}
                                aria-hidden="true"
                              >
                                <div className="modal-dialog modal-dialog-centered">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h3
                                        className="modal-title fs-5"
                                        id={"EditPickListValueModal"}
                                      >
                                        Edit {property.field_name}
                                      </h3>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div
                                      className="modal-body"
                                      style={{ textAlign: "left" }}
                                    >
                                      <label
                                        htmlFor="Name"
                                        className="form-label label-name"
                                      >
                                        Name:
                                        <span
                                          style={{
                                            color: "red",
                                            padding: "0px",
                                          }}
                                        >
                                          *
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="Name"
                                        onChange={
                                          handleNewValueModalDataChange
                                        }
                                      />
                                      <label
                                        htmlFor="Name"
                                        className="form-label label-name"
                                      >
                                        ID:
                                        <span
                                          style={{
                                            color: "red",
                                            padding: "0px",
                                          }}
                                        >
                                          *
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="ID"
                                        defaultValue={payloadz.ID}
                                        onChange={
                                          handleNewValueModalDataChange
                                        }
                                        disabled
                                      />
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
                                        className="btn btn-primary btn-sm"
                                        onClick={handleEditedPicklistValue}
                                        data-bs-dismiss="modal"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <table>
                  <tbody>
                    <tr>
                      <td className="title-td">Name</td>
                      <td>
                        <input
                          name="field_name"
                          onChange={handleChange}
                          className={
                            editTrue
                              ? "show-property-inputs2"
                              : "show-property-inputs"
                          }
                          defaultValue={property.field_name}
                          type="text"
                          disabled={!editTrue}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="title-td">Applies To</td>
                      <td>
                        <input
                          name="taxonomy_names"
                          className="show-property-inputs"
                          defaultValue={
                            property.taxonomy_names !== ""
                              ? property.taxonomy_names
                              : "None"
                          }
                          type="text"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="title-td">Data Type</td>
                      <td>
                        {editTrue ? (
                          <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                            name="field_type"
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
                              {property.field_type}
                            </option>
                            <option value="String">String</option>
                            <option value="Picklist">
                              Picklist/Category
                            </option>
                            <option value="Number">Number</option>
                            <option value="Boolean">Yes/No</option>
                            <option value="RichText">Rich Text</option>
                            <option value="Html">HTML</option>
                            <option value="Link">Link</option>
                          </select>
                        ) : (
                          <input
                            name="field_type"
                            className={
                              editTrue
                                ? "show-property-inputs2"
                                : "show-property-inputs"
                            }
                            defaultValue={property.field_type}
                            type="text"
                            disabled={!editTrue}
                          />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="title-td">Property Group</td>
                      <td>
                        {editTrue ? (
                          <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                            name="property_group_name"
                            id="propertyGroupSelectBox"
                            onChange={handleChange}
                            required
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
                          >
                            <option value="" hidden>
                              {property.property_group_name}
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
                        ) : (
                          <input
                            name="property_group_name"
                            className="show-property-inputs"
                            defaultValue={property.property_group_name}
                            type="text"
                            disabled={!editTrue}
                          />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="title-td">Localizable</td>
                      <td>
                        {editTrue ? (
                          <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                            name="localization_required"
                            onChange={handleChange}
                            required
                          >
                            <option value="" hidden>
                              {property.localization_required ? "Yes" : "No"}
                            </option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        ) : (
                          <input
                            name="localization_required"
                            className="show-property-inputs"
                            value={
                              property.localization_required
                                ? "Yes"
                                : "No"
                            }
                            type="text"
                            disabled={!editTrue}
                          />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="title-td">Help Text</td>
                      <td>
                        <input
                          className={
                            editTrue
                              ? "show-property-inputs2"
                              : "show-property-inputs"
                          }
                          defaultValue={"(No Value)"}
                          type="text"
                          disabled={!editTrue}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="title-td">Searchable</td>
                      <td>
                        <input
                          className={
                            editTrue
                              ? "show-property-inputs2"
                              : "show-property-inputs"
                          }
                          defaultValue={"Yes"}
                          type="text"
                          disabled={!editTrue}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="title-td">Autocomplete Enabled</td>
                      <td>
                        <input
                          className={
                            editTrue
                              ? "show-property-inputs2"
                              : "show-property-inputs"
                          }
                          defaultValue={"Yes"}
                          type="text"
                          disabled={!editTrue}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <div className="footer-area"></div>
          </div>
        </>
      )
      }
    </>
  );
};

export default ShowProperty;
