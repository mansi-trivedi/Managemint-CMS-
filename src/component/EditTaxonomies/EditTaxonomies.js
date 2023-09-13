import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditTaxonomies.css";
import { Add, Settings, Delete } from "@mui/icons-material";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import Error from "../Error/Error";
import EditTaxonomyModal from "../EditTaxonomyModal/EditTaxonomyModal";
import { OrgContext } from "../../context/OrganisationContext";

const EditTaxonomies = () => {
  const [paginatedProperties, setPaginatedProperties] = useState([]);
  const { taxonomyId } = useParams();
  const [taxonomyName, setTaxonomyName] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  useEffect(() => {
    const callFn = async () => {
      try {
        const taxonomiesResponse = await axios.get(
          /* getting taxonomy data by taxonomy id */
          `${process.env.REACT_APP_BASE_URL}/api/taxonomies/${orgId}/${taxonomyId}`
        );
        setTaxonomyName(taxonomiesResponse.data.data.taxonomy_name);
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
  }, [taxonomyId, setTaxonomyName]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getPaginatedProperties = async () => {
      try {
        const response = await axios.get(
          /* getting all properties associated with particular taxonomy */
          `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}/${taxonomyId}`
        );
        setPaginatedProperties(response.data.data);
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
    getPaginatedProperties();
  }, [taxonomyId, setPaginatedProperties, setPaginationData]); // eslint-disable-line react-hooks/exhaustive-deps

  //handling pagination here using API
  const handlePagination = async (url) => {
    try {
      /* getting next page url from meta data */
      const response = await axios.get(url);
      setPaginatedProperties(response.data.data);
      setPaginationData(response.data.meta_data);
    } catch (error) {
      setError({ error });
    }
  };

  // edit taxonomy name
  const editTaxonomy = (e) => {
    setTaxonomyName(e.target.value);
  };

  const handleEdit = async () => {
    try {
      await axios({
        method: "PATCH",
        /* edit taxonomy name */
        url: `${process.env.REACT_APP_BASE_URL}/api/taxonomies/${orgId}/${taxonomyId}`,
        data: {
          taxonomy_name: taxonomyName,
        },
      });
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

  const handleDelete = async () => {
    try {
      await axios.delete(
        /* delete particular taxonomy by its id */
        `${process.env.REACT_APP_BASE_URL}/api/taxonomies/${orgId}/${taxonomyId}`
      );
      navigate(`/orgs/${orgId}/property`);
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
      if (e.target.value.length >= 1) {
        const response = await axios.get(
          /* search all properties */
          `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}/${taxonomyId}?search=${e.target.value}`
        );
        setPaginatedProperties(response.data.data);
        setPaginationData(response.data.meta_data);
      } else {
        const response = await axios.get(
          /* getting all properties associated with particular taxonomy */
          `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}/${taxonomyId}`
        );
        setPaginatedProperties(response.data.data);
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

  return (
    <>
      {error !== null ? (
        <div className="taxonomyContent">
          <Error />
        </div>
      ) : (
        <div className="taxonomyContent">
          <div className="taxonomyContentHead">
            <p className="taxonomyContentHeadTitle1">{taxonomyName}</p>
            <p className="taxonomyContentHeadTitle2">
              Manage record information, taxonomy, and validations
            </p>
          </div>
          <div className="search-div">
            <div className="searchbar">
              <input
                id="myInput"
                className="form-control me-2"
                type="text"
                placeholder="Search Taxonomies"
                aria-label="Search"
                onChange={handleSearch}
              />
            </div>
            <button
              type="button"
              className="taxonomyButton addEditPropertyButton"
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
            >
              <Add sx={{ fontSize: 20, marginRight: "3px" }} /> Add and Edit
              Property
            </button>
            {isOpen ? (
              <EditTaxonomyModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                taxonomyName={taxonomyName}
                taxonomyId={taxonomyId}
              />
            ) : null}
            <br />
            <button
              type="button"
              className="taxonomyButton taxonomySettingButton"
              data-bs-toggle="modal"
              data-bs-target="#taxonomySettingModal"
            >
              <Settings sx={{ fontSize: 20, marginRight: "3px" }} />
              Setting
            </button>
            <div
              className="modal fade"
              id="taxonomySettingModal"
              tabIndex="-1"
              aria-labelledby="taxonomySettingModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3
                      className="modal-title fs-5"
                      id="taxonomySettingModalLabel"
                    >
                      Taxonomy Setting
                    </h3>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="taxonomyName">
                      <label>Taxonomy Name</label>
                      <br />
                      <input
                        className="taxonomyInput"
                        value={taxonomyName}
                        onChange={editTaxonomy}
                      />
                    </div>
                    <button
                      className="button deletetaxonomyButton"
                      data-bs-toggle="modal"
                      data-bs-target={"#TaxonomyDeleteModal"}
                      style={{ color: "white" }}
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
                      onClick={handleEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade deleteTaxonomyModal"
              id={"TaxonomyDeleteModal"}
              tabIndex="-1"
              aria-labelledby={"TaxonomyDeleteModal"}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title fs-5" id={"TaxonomyDeleteModal"}>
                      Delete Taxonomy
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
                      <h5 className="Deletehead2">{taxonomyName}</h5>
                    </div>
                    <p className="DeletePara">
                      * All the references will be lost if you delete this item.
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
                      type="button"
                      className="btn btn-danger btn-sm"
                      data-bs-dismiss="modal"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="propertyTableContent">
            <table className="propertyTable">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Taxonomy</th>
                  <th>Data Type</th>
                  <th>Product Family Level</th>
                  <th>Validation</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProperties.length !== 0 ? (
                  paginatedProperties.map((val, key) => {
                    return (
                      <tr key={key}>
                        <td>{val.field_name}</td>
                        <td>{taxonomyName}</td>
                        <td>{val.field_type}</td>
                        <td> - </td>
                        <td className={val.color ? "value" : "noValue"}>
                          {val.validation ? val.validation : "(No value)"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="noMatchedValue">
                    <td colSpan={5}>No Match Found</td>
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

export default EditTaxonomies;
