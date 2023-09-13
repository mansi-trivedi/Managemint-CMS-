import React, { useEffect, useState, useContext } from "react";
import "./AllTaxonomiesRecords.css";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import { Add, Visibility, Delete } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTaxonomies } from "../../context/ApiDataContext";
import Error from "../Error/Error";
import { OrgContext } from "../../context/OrganisationContext";


const AllTaxonomiesRecords = () => {
  const navigate = useNavigate();
  const { taxonomyId } = useParams();
  const [data, setData] = useState([]);
  const [taxonomy, setTaxonomy] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [error, setError] = useState(null);
  const [record, setRecord] = useState({
    record_name: "",
    record_id: "",
    taxonomy: "",
  });

  /** Fetching Data using Application Context */
  const taxonomyData = useTaxonomies();

  /** Using orgId stored in cookies and orgId state (inSync together) */
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  useEffect(() => {
    const callFn = async () => {
      try {
        if (orgId) {
          if (taxonomyId === "allrecords") {
            /* getting all records */
            const response = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}`
            );
            setData(response.data.data);
            setPaginationData(response.data.meta_data);
          } else {
            /* getting records by taxonomy id */
            const response = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}/${taxonomyId}`
            );

            /* getting taxonomy name and id */
            const taxonomiesResponse = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/api/taxonomies/${orgId}/${taxonomyId}`
            );
            setData(response.data.data);
            setPaginationData(response.data.meta_data);
            setTaxonomy(taxonomiesResponse.data.data.taxonomy_name);
          }
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
    callFn();
  }, [setTaxonomy, setData, setPaginationData, taxonomyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (deleteRecordId, taxonomyId) => {
    try {
      if (!orgId) {
        /* delete record by record id using taxonomy id */
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}/${taxonomyId}/${deleteRecordId}`
        );
        window.location.reload(true);
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

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (e.target.value.length >= 1) {
        if (taxonomyId === "allrecords") {
          const response = await axios.get(
            /* search with pagination from all records */
            `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}?search=${e.target.value}`
          );
          setData(response.data.data);
          setPaginationData(response.data.meta_data);
        } else {
          const response = await axios.get(
            /* search with pagination from all records by taxonomy id */
            `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}/${taxonomyId}?search=${e.target.value}`,
            {
              params: {
                find: e.target.value,
              },
            }
          );
          setData(response.data.data);
          setPaginationData(response.data.meta_data);
        }
      } else {
        if (taxonomyId === "allrecords") {
          /* getting all records */
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}`
          );
          setData(response.data.data);
          setPaginationData(response.data.meta_data);
        } else {
          /* getting records by taxonomy id */
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}/${taxonomyId}`
          );

          /* getting taxonomy name and id */
          const taxonomiesResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/taxonomies/${orgId}/${taxonomyId}`
          );
          setData(response.data.data);
          setPaginationData(response.data.meta_data);
          setTaxonomy(taxonomiesResponse.data.data.taxonomy_name);
        }
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

  const handlePagination = async (url) => {
    try {
      /* getting next page url from meta data */
      const response = await axios.get(url);
      setData(response.data.data);
      setPaginationData(response.data.meta_data);
    } catch (error) {
      setError({ error });
    }
  };

  const handleSubmit = async (e) => {
    try {
      const payload = {
        record_name: record.record_name,
        record_id: record.record_id,
        taxonomy_name: record.taxonomy,
      };
      await axios.post(
        /* adding new records */
        `${process.env.REACT_APP_BASE_URL}/api/records/${orgId}`,
        payload
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

  const handleChange = (e) => {
    try {
      const name = e.target.name;
      const value = e.target.value;
      setRecord({
        ...record,
        [name]: value,
      });
    } catch (error) {
      setError({ error });
    }
  };

  return (
    <>
      {error !== null ? (
        <div className="Recordcontent">
          <Error />
        </div>
      ) : (
        <div className="Recordcontent">
          <nav aria-label="breadcrumb" className="navBreadcrumb">
            <ol className="breadcrumb" style={{ backgroundColor: "white" }}>
              <li className="breadcrumb-item">
                <p style={{ fontWeight: "500" }}>All Records</p>
              </li>
              {taxonomyId !== "allrecords" ? (
                <li className="breadcrumb-item active" aria-current="page">
                  {taxonomy}
                </li>
              ) : null}
            </ol>
          </nav>
          <div className="searchbar-buttons-div">
            <div className="searchbar">
              <input
                id="myInput"
                className="form-control me-2"
                type="text"
                placeholder="Search Records"
                aria-label="Search"
                onChange={handleSearch}
              />
            </div>
            {taxonomyId === "allrecords" ? (
              <button
                className="addRecordButton"
                data-bs-toggle="modal"
                data-bs-target="#addRecordModal"
              >
                <Add
                  sx={{
                    color: "white",
                    fontSize: 20,
                    margin: "0px 5px 0px 0px",
                  }}
                />
                New Records
              </button>
            ) : (
              <button
                className="addRecordButton"
                data-bs-toggle="modal"
                data-bs-target="#addRecordModal"
              >
                <Add
                  sx={{
                    color: "white",
                    fontSize: 20,
                    margin: "0px 5px 0px 0px",
                  }}
                />
                {"New " + taxonomy}
              </button>
            )}
            <div
              className="modal fade"
              id="addRecordModal"
              tabIndex="-1"
              aria-labelledby="addRecordModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="addRecordModalLabel">
                      Add a Few Record Details
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-2" id="record-name-div">
                        <label
                          htmlFor="record_name"
                          className="form-label label-name"
                        >
                          Record Name
                        </label>
                        <input
                          id="record_name"
                          name="record_name"
                          value={record.record_name}
                          onChange={handleChange}
                          type="text"
                          className="form-control form-control-sm record_nameInput"
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="record_id"
                          className="form-label label-name"
                        >
                          Record ID
                        </label>
                        <input
                          id="record_id"
                          type="text"
                          name="record_id"
                          value={record.record_id}
                          onChange={handleChange}
                          className="form-control form-control-sm"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="taxonomy"
                          className="form-label label-name mb-2"
                        >
                          Taxonomy
                        </label>
                        <select
                          className="form-select mb-2 form-select-sm"
                          aria-label="Default select example"
                          name="taxonomy"
                          value={record.taxonomy}
                          onChange={handleChange}
                          required
                        >
                          <option value="" hidden>
                            Choose a Taxonomy Node
                          </option>
                          {taxonomyData &&
                            taxonomyData.map((taxonomy) => {
                              return (
                                <option
                                  value={taxonomy.taxonomy_name}
                                  key={taxonomy.taxonomy_id}
                                >
                                  {taxonomy.taxonomy_name}
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
                        >
                          Create Record
                        </button>
                      </div>
                    </form>
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
                  {taxonomyId === "allrecords" ? (
                    <th>Records</th>
                  ) : (
                    <th>{taxonomy}</th>
                  )}
                  <th>Color Code</th>
                  <th>Color Name</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.length !== 0 ? (
                  data.map((val, key) => {
                    return (
                      <tr key={key}>
                        <td>{key + paginationData.from_record_number}</td>
                        <td>{val.record_name}</td>
                        <td className={val.color ? "value" : "noValue"}>
                          {val.color_code ? val.color_code : "(No value)"}
                        </td>
                        <td className={val.color ? "value" : "noValue"}>
                          {val.color_family ? val.color_family : "(No value)"}
                        </td>
                        <td>
                          <Link
                            to={`/orgs/${orgId}/records/${val.taxonomy_id}/${val.record_id}`}
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
                            data-bs-target={"#RecordDeleteModal" + key}
                          />
                          <div
                            className="modal fade deletePropertyModal"
                            id={"RecordDeleteModal" + key}
                            tabIndex="-1"
                            aria-labelledby={"RecordDeleteModal" + key}
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h3
                                    className="modal-title fs-5"
                                    id={"RecordDeleteModal" + key}
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
                                    <h5 className="Deletehead2">
                                      {val.record_name}
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
                                    onClick={() =>
                                      handleDelete(
                                        val.record_id,
                                        val.taxonomy_id
                                      )
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
                  disabled={paginationData.previous_page !== "" ? false : true}
                  onClick={() => handlePagination(paginationData.previous_page)}
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
      )}
    </>
  );
};

export default AllTaxonomiesRecords;
