/**
 * 
 * @returns an add taxonomy modal which is triggering of which is controlled by isOpen state
       
 */
import DualListBox from "react-dual-listbox";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { usePropertiesByPagination } from "../../context/ApiDataContext";
import "./AddTaxonomyModel.css";
import { useNavigate } from "react-router-dom";
import { OrgContext } from "../../context/OrganisationContext";
import Error from "../Error/Error";

function AddTaxonomyModal({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);
  const [error, setError] = useState(null);

  /** Handle Closing of the Add Taxonomy Modal */
  const handleClose = () => {
    setIsOpen(false);
    propertiesByPaginationObject.setFilteredProperties([]);
  };

  /** Handle changes made in available and selected fields list */
  const handleDualListChange = (value) => {
    try {
      setSelected(value);
    } catch (error) {
      setError({ error });
    }
  };

  /** Fetching all properties by pagination using Custom Hook usePropertiesByPagination */
  let propertiesByPaginationObject = usePropertiesByPagination();

  /** Handling submission of selected values */
  const handleSubmit = async () => {
    setIsOpen(false);
    propertiesByPaginationObject.setFilteredProperties([]);
    const name = document.getElementById("recordtypeName").value;
    const payload = {
      taxonomy_name: name,
      field_names: selected,
    };
    try {
      /**Using method POST for updating Taxonomy Fields */
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/api/taxonomies/${orgId}`,
        data: payload,
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

  useEffect(() => {
    propertiesByPaginationObject.scrollHandler();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {error !== null ? (
        <div>
          <Error />
        </div>
      ) : (
        <>
          <>
            <Modal
              size="lg"
              show={isOpen}
              onHide={() => {
                setIsOpen(false);
                propertiesByPaginationObject.setFilteredProperties([]);
              }}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Create New Record Type
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {" "}
                <div>
                  <label htmlFor="name" className="form-label label-name">
                    Record Type Name
                  </label>
                  <input
                    type="text"
                    name="recordtypeName"
                    className="form-control form-control-sm"
                    id="recordtypeName"
                    required
                  />
                </div>
                <div className="draganddropstatement">
                  <p>
                    * double-click, press enter, or click the buttons in the
                    middle of the panel to begin building your record.
                  </p>
                </div>
                <div className="draganddrop">
                  <div className="draganddropcontent">
                    <DualListBox
                      id="property-list-box"
                      options={
                        propertiesByPaginationObject.allFilteredProperties
                      }
                      selected={selected}
                      onChange={(value) => handleDualListChange(value)}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSubmit}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </>
      )}
    </>
  );
}

export default AddTaxonomyModal;
