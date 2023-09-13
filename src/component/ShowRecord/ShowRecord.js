import React, { useState, useEffect, useContext } from "react";
import { Edit, Save, Add, Delete, Cancel } from "@mui/icons-material";
import "./ShowRecord.css";
import { RxActivityLog } from "react-icons/rx";
import { FaRegChartBar, FaTasks } from "react-icons/fa";
import { MdOutlineDataUsage } from "react-icons/md";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Error from "../Error/Error";
import { usePropertyGroups } from "../../context/ApiDataContext";
import { OrgContext } from "../../context/OrganisationContext";
import Capitalize from "../../utils/Capitalize";

const ShowRecord = () => {
  const [edit, setEdit] = useState(true);
  const [data, setData] = useState({});
  const [open, setOpen] = useState();
  const { taxonomyId, RecordId } = useParams();
  const [fieldData, setFieldData] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editorValue, setEditorValue] = useState([]);
  const [property, setProperty] = useState([]);
  const [editRecord, setEditRecord] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const propertyGroupList = usePropertyGroups();
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  useEffect(() => {
    const getRecordData = async () => {
      try {
        const response = await axios.get(
          /* getting particular record data by its id */
          `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}/${taxonomyId}/${RecordId}`
        );
        setData(response.data.data);
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
    getRecordData();
  }, [setData, RecordId, taxonomyId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getProperties = async () => {
      try {
        const propertiesResponse = await axios.get(
          /* getting property wrapped in property group associated by particular taxonomy */
          `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}/${taxonomyId}?by_property_group=1`
        );
        setProperty(propertiesResponse.data.data);
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
    getProperties();
  }, [setProperty, taxonomyId]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Fetching all property groups by pagination and storing all*/
  const [allPropertiesList, setAllPropertiesList] = useState();

  useEffect(() => {
    let page = 1;
    let total_pages = 1;

    /** To fetch all the Property Data/Names */
    const getAllProperties = async () => {
      let allProperties = [];
      try {
        while (true) {
          const allPropertiesResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}?page=${page}`
          );
          allProperties.push(...allPropertiesResponse.data.data);
          total_pages = allPropertiesResponse.data.meta_data.total_pages;

          if (page === total_pages) {
            setAllPropertiesList(allProperties);
            break;
          }
          page += 1;
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
    getAllProperties(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDropdownChange = (e, propertyGroup, fieldType) => {
    try {
      setFieldData((fieldData) => {
        const newList = [...fieldData];
        const eleIndex = fieldData.findIndex((v) => v.index === propertyGroup);
        if (eleIndex === -1) {
          newList.push({
            index: propertyGroup,
            field: [{ name: e.target.outerText, type: fieldType }],
          });
        } else {
          newList[eleIndex].field.push({
            name: e.target.outerText,
            type: fieldType,
          });
        }
        return newList;
      });

      setAllFields([...allFields, e.target.outerText]);
      setIsOpen(!isOpen);
    } catch (error) {
      setError({ error });
    }
  };

  const onClick = (propertyGroup) => {
    try {
      setIsOpen(!isOpen);
      setOpen(propertyGroup);
    } catch (error) {
      setError({ error });
    }
  };

  const handleEdit = (e) => {
    try {
      e.preventDefault();
      setEdit(!edit);
    } catch (error) {
      setError({ error });
    }
  };

  const handleSave = async (e) => {
    try {
      e.preventDefault();
      setEdit(true);
      await axios({
        method: "PATCH",
        url:
          /* edit record data and add dynamic field in record */
          `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}/${taxonomyId}/${RecordId}`,
        data: { ...editRecord, ...editorValue },
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

  const handleEditorChange = (e, editor, fieldName) => {
    try {
      setEditorValue({
        ...editorValue,
        [fieldName.replace(/ /g, "_").toLowerCase()]: editor.getData(),
      });
    } catch (error) {
      setError({ error });
    }
  };

  const handleChange = (e) => {
    try {
      const { name, value } = e.target;
      setEditRecord({
        ...data,
        [name.replace(/ /g, "_").toLowerCase()]: value,
      });
    } catch (error) {
      setError({ error });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        /* deleting record by its id */
        `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}/${taxonomyId}/${RecordId}`
      );
      navigate("/records/all-records");
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

  return (
    <>
      {error !== null ? (
        <div className="recordTop">
          <Error />
        </div>
      ) : (
        <>
          <div className="recordTop">
            <div className="recordName">
              {data["Record ID"] !== undefined ? <h3>{data["Record ID"]["record_name"]}</h3> : null}
            </div>
            <div>
              {edit ? (
                <>
                  <button className="editSaveButton" onClick={handleEdit}>
                    <Edit
                      sx={{
                        color: "rgb(74, 124, 210)",
                        fontSize: 20,
                        marginRight: "3px",
                      }}
                    />{" "}
                    Edit
                  </button>
                  <button
                    className="deleteCancelButton"
                    data-bs-toggle="modal"
                    data-bs-target={"#RecordDeleteModal"}
                    style={{ color: "white" }}
                  >
                    <Delete
                      sx={{ color: "white", fontSize: 20, marginRight: "3px" }}
                    />
                    Delete
                  </button>
                  <div
                    className="modal fade deletePropertyModal"
                    id={"RecordDeleteModal"}
                    tabIndex="-1"
                    aria-labelledby={"RecordDeleteModal"}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h3
                            className="modal-title fs-5"
                            id={"RecordDeleteModal"}
                          >
                            Delete Record
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
                            <h5 className="Deletehead2">{RecordId}</h5>
                          </div>
                          <p className="DeletePara">
                            * All the references will be lost if you delete this
                            item.
                          </p>
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-secondary btn-sm"
                            data-bs-dismiss="modal"
                          >
                            No, take me back
                          </button>

                          <button
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
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    form="recordDetails"
                    className="editSaveButton"
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
                  <button
                    className="deleteCancelButton"
                    style={{ color: "white" }}
                    onClick={handleEdit}
                  >
                    <Cancel
                      sx={{ color: "white", fontSize: 20, marginRight: "3px" }}
                    />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="record-detail-major-div">
            <div className="record-detail-head-div">
              <svg
                className="_item_icon"
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                viewBox="0 0 100 100"
              >
                <g fill="rgb(69, 137, 231)">
                  <path d="M49.493 9.023c-22.35 0-40.47 18.119-40.47 40.47s18.121 40.471 40.47 40.471c22.351 0 40.471-18.12 40.471-40.471 0-22.351-18.12-40.47-40.471-40.47zm0 75.883c-19.523 0-35.412-15.889-35.412-35.413 0-19.525 15.888-35.412 35.412-35.412s35.413 15.886 35.413 35.412c0 19.525-15.888 35.413-35.413 35.413z"></path>
                  <path d="M49.493 19.141c-16.762 0-30.353 13.588-30.353 30.353 0 16.768 13.59 30.354 30.353 30.354s30.354-13.586 30.354-30.354c0-16.765-13.591-30.353-30.354-30.353zm3.863 34.144h-5.053V64.67h-8.928V30.331H53.04c7.376 0 12.479 3.416 12.479 11.295 0 8.106-4.373 11.659-12.163 11.659z"></path>
                  <path d="M49.805 37.526h-1.501v8.561h1.501c3.235 0 6.422 0 6.422-4.189 0-4.326-2.96-4.372-6.422-4.372z"></path>
                </g>
              </svg>
              Properties
            </div>
            <hr id="properties-title-hr" />
            <div className="property-groups-div">
              {propertyGroupList.map((propertyGroup, index1) => {
                return (
                  <React.Fragment key={index1}>
                    <a
                      href={`#${propertyGroup["property_group_name"]}`}
                      className="property-group-name"
                    >
                      {propertyGroup["property_group_name"]}
                    </a>
                    <hr />
                  </React.Fragment>
                );
              })}
            </div>
            <div className="all-buttons-div">
              <div className="button-div">
                <RxActivityLog /> <span>Activity</span>
              </div>
              <hr />
              <div className="button-div">
                {" "}
                <FaRegChartBar /> <span>Insights</span>
              </div>
              <hr />
              <div className="button-div">
                {" "}
                <MdOutlineDataUsage /> <span>Usage</span>
              </div>
              <hr />
              <div className="button-div">
                <FaTasks size={"1em"} /> <span>Tasks</span>
              </div>
              <hr />
            </div>
          </div>
          <div className="showDataContent">
            <div className="allpropertybutton">
              <button
                className="dropdown-toggle propertybutton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                All Properties
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="/#">
                    Subscribe
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/#">
                    Share
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/#">
                    Analyze All Records
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/#">
                    Publish Records
                  </a>
                </li>
              </ul>
            </div>
            <form id="recordDetails" onSubmit={handleSave}>
              <div
                className="allPropertyAccordion accordion"
                id="accordionExample"
              >
                {propertyGroupList.map((propertyGroup, index) => {
                  return (
                    <div
                      key={index}
                      id={propertyGroup["property_group_id"]}
                      className="wholeaccordian"
                    >
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id={"headingOne" + index}
                        >
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={"#collapse" + index}
                            aria-expanded="true"
                            aria-controls={"#collapse" + index}
                            style={{ backgroundColor: "white" }}
                          >
                            <p className="accordionHeaderGrouptitle1">
                              {propertyGroup["property_group_name"]}
                            </p>
                          </button>
                        </h2>
                        <div
                          id={"collapse" + index}
                          className="accordion-collapse collapse show"
                          aria-labelledby={"headingOne" + index}
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            {allPropertiesList && (
                              <>
                                {Object.keys(data).map((item) => {
                                  if (
                                    item ===
                                    propertyGroup["property_group_name"]
                                  ) {
                                    return Object.keys(data[item]).map(
                                      (field, key) => {
                                        const eleIndex =
                                          allPropertiesList.findIndex(
                                            (v) =>
                                              v.field_name
                                                .replace(/ /g, "_")
                                                .toLowerCase() === field
                                          );
                                        if (data[item][field] !== null) {
                                          if (
                                            allPropertiesList[eleIndex][
                                            "field_type"
                                            ] === "boolean"
                                          ) {
                                            return (
                                              <React.Fragment key={key}>
                                                <div className="fieldDiv">
                                                  <label>
                                                    {Capitalize(field)}
                                                  </label>
                                                  <div
                                                    className="boolValue"
                                                    onChange={handleChange}
                                                  >
                                                    <div className="bool">
                                                      <input
                                                        type="radio"
                                                        name={field}
                                                        checked={
                                                          data[item][field] ===
                                                          "true"
                                                        }
                                                        value={true}
                                                        disabled={edit}
                                                      />
                                                      <label htmlFor="yes">
                                                        Yes
                                                      </label>
                                                      <br />
                                                    </div>
                                                    <div className="bool">
                                                      <input
                                                        type="radio"
                                                        name={field}
                                                        value={false}
                                                        checked={
                                                          data[item][field] ===
                                                          "false"
                                                        }
                                                        disabled={edit}
                                                      />
                                                      <label htmlFor="no">
                                                        No
                                                      </label>
                                                      <br></br>
                                                    </div>
                                                  </div>
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (
                                            allPropertiesList[eleIndex][
                                            "field_type"
                                            ] === "RichText"
                                          ) {
                                            return (
                                              <React.Fragment key={key}>
                                                <div className="fieldDiv">
                                                  <label>
                                                    {Capitalize(field)}
                                                  </label>
                                                  <CKEditor
                                                    id={field}
                                                    editor={ClassicEditor}
                                                    onChange={(e, editor) =>
                                                      handleEditorChange(
                                                        e,
                                                        editor,
                                                        field
                                                      )
                                                    }
                                                    data={data[item][field]}
                                                    disabled={edit}
                                                  />
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (
                                            allPropertiesList[eleIndex][
                                            "field_type"
                                            ] === "Number"
                                          ) {
                                            return (
                                              <React.Fragment key={key}>
                                                <div className="fieldDiv">
                                                  <label>
                                                    {Capitalize(field)}
                                                  </label>
                                                  <input
                                                    name={field}
                                                    pattern="[0-9]"
                                                    className="fieldname"
                                                    size={3}
                                                    min={100}
                                                    max={200}
                                                    defaultValue={
                                                      data[item][field]
                                                    }
                                                    type="number"
                                                    onChange={handleChange}
                                                    disabled={edit}
                                                    onInvalid={(e) =>
                                                      e.target.setCustomValidity(
                                                        "this field must be 3 digit number between 100 and 200"
                                                      )
                                                    }
                                                    onInput={(e) =>
                                                      e.target.setCustomValidity(
                                                        ""
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </React.Fragment>
                                            );
                                          }
                                          else if (
                                            allPropertiesList[eleIndex][
                                            "field_type"
                                            ] === "Picklist"
                                          ) {
                                            return (
                                              <div className="fieldDiv">
                                                <label>
                                                  {Capitalize(field)}
                                                </label>
                                                <select
                                                  className="form-select mb-3 form-select-sm"
                                                  aria-label="Default select example"
                                                  id="PicklistBox"
                                                  name="Picklist"
                                                  onChange={handleChange}
                                                  onClick={() => {
                                                    document
                                                      .getElementById("PicklistBox")
                                                      .blur();
                                                  }}
                                                  onFocus={() =>
                                                  (document.getElementById(
                                                    "PicklistBox"
                                                  ).size = 3)
                                                  }
                                                  onBlur={() =>
                                                  (document.getElementById(
                                                    "PicklistBox"
                                                  ).size = 3)
                                                  }
                                                  required
                                                >
                                                  <option value="" hidden>
                                                    Choose a Picklist data
                                                  </option>
                                                  <option value="value1" key="value1">value1</option>
                                                  <option value="value2" key="value2">value1</option>
                                                  <option value="value3" key="value3">value1</option>
                                                  <option value="value4" key="value4">value1</option>
                                                </select>
                                              </div>
                                            )
                                          }
                                          else if (
                                            allPropertiesList[eleIndex][
                                            "field_type"
                                            ] === "Link"
                                          ) {
                                            return (
                                              <React.Fragment key={key}>
                                                <div className="fieldDiv">
                                                  <label>
                                                    {Capitalize(field)}
                                                  </label>
                                                  <input
                                                    type="url"
                                                    name={field}
                                                    className="fieldname"
                                                    pattern="https?://.+"
                                                    title="Include http://"
                                                    defaultValue={
                                                      data[item][field]
                                                    }
                                                    onChange={handleChange}
                                                    disabled={edit}
                                                    onInvalid={(e) =>
                                                      e.target.setCustomValidity(
                                                        "this field must be url"
                                                      )
                                                    }
                                                    onInput={(e) =>
                                                      e.target.setCustomValidity(
                                                        ""
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (
                                            allPropertiesList[eleIndex][
                                            "field_type"
                                            ] === "String"
                                          ) {
                                            if (
                                              field.match(/[_](id|ID|Id)$/g) ===
                                              null
                                            ) {
                                              return (
                                                <React.Fragment key={key}>
                                                  <div className="fieldDiv">
                                                    <label>
                                                      {Capitalize(field)}
                                                    </label>
                                                    <input
                                                      name={field}
                                                      className="fieldname"
                                                      pattern="^[A-Za-z ]+$"
                                                      defaultValue={
                                                        data[item][field]
                                                      }
                                                      type="text"
                                                      onChange={handleChange}
                                                      disabled={edit}
                                                      onInvalid={(e) =>
                                                        e.target.setCustomValidity(
                                                          "this field must be string"
                                                        )
                                                      }
                                                      onInput={(e) =>
                                                        e.target.setCustomValidity(
                                                          ""
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </React.Fragment>
                                              );
                                            } else {
                                              return (
                                                <React.Fragment key={key}>
                                                  <div className="fieldDiv">
                                                    <label>
                                                      {Capitalize(field)}
                                                    </label>
                                                    <input
                                                      name={field}
                                                      className="fieldname"
                                                      pattern="^(?=.*[0-9])[a-zA-Z0-9_]+$"
                                                      defaultValue={
                                                        data[item][field]
                                                      }
                                                      type="text"
                                                      onChange={handleChange}
                                                      disabled={edit}
                                                      onInvalid={(e) =>
                                                        e.target.setCustomValidity(
                                                          "this field must contain atleast one digit and no whitespaces allowed"
                                                        )
                                                      }
                                                      onInput={(e) =>
                                                        e.target.setCustomValidity(
                                                          ""
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </React.Fragment>
                                              );
                                            }
                                          } else {
                                            return null;
                                          }
                                        } else {
                                          return null;
                                        }
                                      }
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </>
                            )}
                            {!edit && (
                              <>
                                {fieldData.map((fields, fieldKey) => {
                                  if (
                                    fields["index"] ===
                                    propertyGroup["property_group_name"]
                                  ) {
                                    return (
                                      <React.Fragment key={fieldKey}>
                                        {fields["field"].map((input, k1) => {
                                          if (input["type"] === "Number") {
                                            return (
                                              <React.Fragment key={k1}>
                                                <div className="fieldDiv">
                                                  <label>{input["name"]}</label>
                                                  <input
                                                    name={input["name"]}
                                                    pattern="[0-9]"
                                                    className="fieldname"
                                                    size={3}
                                                    min={100}
                                                    max={200}
                                                    defaultValue={
                                                      data[fields["index"]][
                                                      input["name"]
                                                      ]
                                                    }
                                                    type="number"
                                                    onChange={handleChange}
                                                    disabled={edit}
                                                    onInvalid={(e) =>
                                                      e.target.setCustomValidity(
                                                        "this field must be 3 digit number between 100 and 200"
                                                      )
                                                    }
                                                    onInput={(e) =>
                                                      e.target.setCustomValidity(
                                                        ""
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (
                                            input["type"] === "Picklist"
                                          ) {
                                            return (
                                              <React.Fragment key={k1}>
                                                {input["type"]}
                                                <div className="fieldDiv">
                                                  <label>{input["name"]}</label>
                                                  <select
                                                    className="form-select mb-3 form-select-sm"
                                                    aria-label="Default select example"
                                                    id="PicklistBox"
                                                    name="Picklist"
                                                    onChange={handleChange}
                                                    onClick={() => {
                                                      document
                                                        .getElementById("PicklistBox")
                                                        .blur();
                                                    }}
                                                    onFocus={() =>
                                                    (document.getElementById(
                                                      "PicklistBox"
                                                    ).size = 3)
                                                    }
                                                    onBlur={() =>
                                                    (document.getElementById(
                                                      "PicklistBox"
                                                    ).size = 3)
                                                    }
                                                    required
                                                  >
                                                    <option value="" hidden>
                                                      Choose a Picklist data
                                                    </option>
                                                    <option value="value1" key="value1">value1</option>
                                                    <option value="value2" key="value2">value1</option>
                                                    <option value="value3" key="value3">value1</option>
                                                    <option value="value4" key="value4">value1</option>
                                                  </select>
                                                </div>
                                              </React.Fragment>
                                            );
                                          }
                                          else if (
                                            input["type"] === "RichText"
                                          ) {
                                            return (
                                              <React.Fragment key={k1}>
                                                <div className="fieldDiv">
                                                  <label>{input["name"]}</label>
                                                  <CKEditor
                                                    id={input["name"]}
                                                    editor={ClassicEditor}
                                                    onChange={(e, editor) =>
                                                      handleEditorChange(
                                                        e,
                                                        editor,
                                                        input["name"]
                                                      )
                                                    }
                                                    data={
                                                      data[fields["index"]][
                                                      input["name"]
                                                      ]
                                                    }
                                                    disabled={edit}
                                                  />
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (
                                            input["type"] === "Boolean"
                                          ) {
                                            return (
                                              <React.Fragment key={k1}>
                                                <div className="fieldDiv">
                                                  <label
                                                    style={{
                                                      marginTop: "10px",
                                                    }}
                                                  >
                                                    {input["name"]}
                                                  </label>
                                                  <div
                                                    className="boolValue"
                                                    onChange={handleChange}
                                                  >
                                                    <div className="bool">
                                                      <input
                                                        type="radio"
                                                        name={input["name"]}
                                                        checked={
                                                          data[fields["index"]][
                                                          input["name"]
                                                          ] === "true"
                                                        }
                                                        value={true}
                                                        disabled={edit}
                                                      />
                                                      <label htmlFor="yes">
                                                        Yes
                                                      </label>
                                                      <br />
                                                    </div>
                                                    <div className="bool">
                                                      <input
                                                        type="radio"
                                                        name={input["name"]}
                                                        value={false}
                                                        checked={
                                                          data[fields["index"]][
                                                          input["name"]
                                                          ] === "false"
                                                        }
                                                        disabled={edit}
                                                      />
                                                      <label htmlFor="no">
                                                        No
                                                      </label>
                                                      <br></br>
                                                    </div>
                                                  </div>
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (input["type"] === "Link") {
                                            return (
                                              <React.Fragment key={k1}>
                                                <div className="fieldDiv">
                                                  <label>{input["name"]}</label>
                                                  <input
                                                    type="url"
                                                    name={input["name"]}
                                                    className="fieldname"
                                                    pattern="https?://.+"
                                                    title="Include http://"
                                                    defaultValue={
                                                      data[fields["index"]][
                                                      input["name"]
                                                      ]
                                                    }
                                                    onChange={handleChange}
                                                    disabled={edit}
                                                    onInvalid={(e) =>
                                                      e.target.setCustomValidity(
                                                        "this field must be url"
                                                      )
                                                    }
                                                    onInput={(e) =>
                                                      e.target.setCustomValidity(
                                                        ""
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (
                                            input["type"] === "String"
                                          ) {
                                            if (
                                              input["name"].match(
                                                /\b(id|ID)$/g
                                              ) === null
                                            ) {
                                              return (
                                                <React.Fragment key={k1}>
                                                  <div className="fieldDiv">
                                                    <label>
                                                      {input["name"]}
                                                    </label>
                                                    <input
                                                      name={input["name"]}
                                                      className="fieldname"
                                                      pattern="^[A-Za-z ]+$"
                                                      defaultValue={
                                                        data[fields["index"]][
                                                        input["name"]
                                                        ]
                                                      }
                                                      type="text"
                                                      onChange={handleChange}
                                                      disabled={edit}
                                                      onInvalid={(e) =>
                                                        e.target.setCustomValidity(
                                                          "this field must be string"
                                                        )
                                                      }
                                                      onInput={(e) =>
                                                        e.target.setCustomValidity(
                                                          ""
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </React.Fragment>
                                              );
                                            } else {
                                              return (
                                                <React.Fragment key={k1}>
                                                  <div className="fieldDiv">
                                                    <label>
                                                      {input["name"]}
                                                    </label>
                                                    <input
                                                      name={input["name"]}
                                                      className="fieldname"
                                                      pattern="^(?=.*[0-9])[a-zA-Z0-9_]+$"
                                                      defaultValue={
                                                        data[fields["index"]][
                                                        input["name"]
                                                        ]
                                                      }
                                                      type="text"
                                                      onChange={handleChange}
                                                      disabled={edit}
                                                      onInvalid={(e) =>
                                                        e.target.setCustomValidity(
                                                          "this field must contain atleast one digit and no whitespaces allowed"
                                                        )
                                                      }
                                                      onInput={(e) =>
                                                        e.target.setCustomValidity(
                                                          ""
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </React.Fragment>
                                              );
                                            }
                                          } else {
                                            return null;
                                          }
                                        })}
                                      </React.Fragment>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </>
                            )}
                            {!edit && (
                              <div className="addDropdown">
                                <div
                                  className="dropdown"
                                  onClick={() =>
                                    onClick(
                                      propertyGroup["property_group_name"]
                                    )
                                  }
                                >
                                  <Add sx={{ color: "rgb(69, 137, 231)" }} />
                                  <span
                                    style={{
                                      color: "rgb(69, 137, 231)",
                                      fontStyle: "italic",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {" "}
                                    Add a property to{" "}
                                    {propertyGroup["property_group_name"]}
                                  </span>
                                </div>
                                <div id="mySelect" style={{ width: "300px" }}>
                                  {isOpen &&
                                    open ===
                                    propertyGroup["property_group_name"] && (
                                      <div className="propertyEdit">
                                        <ul className="propertyEditlist">
                                          {Object.keys(property).map(
                                            (item, key1) => {
                                              if (
                                                item ===
                                                propertyGroup[
                                                "property_group_name"
                                                ]
                                              ) {
                                                return (
                                                  <React.Fragment key={key1}>
                                                    {" "}
                                                    {property[item].map(
                                                      (field, k) => {
                                                        return (
                                                          <React.Fragment
                                                            key={k}
                                                          >
                                                            <li
                                                              id={k}
                                                              onClick={(e) =>
                                                                handleDropdownChange(
                                                                  e,
                                                                  propertyGroup[
                                                                  "property_group_name"
                                                                  ],
                                                                  field.field_type
                                                                )
                                                              }
                                                            >
                                                              {field.field_name}
                                                            </li>
                                                          </React.Fragment>
                                                        );
                                                      }
                                                    )}
                                                  </React.Fragment>
                                                );
                                              } else {
                                                return null;
                                              }
                                            }
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default ShowRecord;
