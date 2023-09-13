/**
 * 
 * @returns an edit taxonomy modal which is triggering of which is controlled by isOpen state
       
 */
import DualListBox from "react-dual-listbox";
import axios from "axios";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { usePropertiesByPagination } from "../../context/ApiDataContext";
import "./EditTaxonomyModel.css";
import { useNavigate } from "react-router-dom";
import { OrgContext } from "../../context/OrganisationContext";
import Error from "../Error/Error";

function EditTaxonomyModal({ isOpen, setIsOpen, taxonomyName, taxonomyId }) {
  const navigate = useNavigate();
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);
  const [error, setError] = useState(null);

  /** Handle Closing of the Edit Taxonomy Modal */
  const handleClose = () => {
    setIsOpen(false);
    setAssociatedProperties([]);
    allPropertiesByPaginationObject.setFilteredProperties([]);
  };

  /** Handle changes made in available and selected fields list */
  const handleDualListChange = (value) => {
    try {
      setAssociatedProperties(value);
    } catch (error) {
      setError(error);
    }
  };

  /** Fetching all properties by pagination using Custom Hook usePropertiesByPagination */
  let allPropertiesByPaginationObject = usePropertiesByPagination();

  /** Fetching all associated properties by pagination using Custom Hook useAssociatedPropertiesByPagination */

  /** Handling submission of selected values */
  const handleSubmit = async () => {
    setIsOpen(false);
    setAssociatedProperties([]);
    allPropertiesByPaginationObject.setFilteredProperties([]);

    const payload = {
      taxonomy_name: taxonomyName,
      field_names: associatedProperties,
    };

    try {
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/api/taxonomies/${orgId}`,
        data: payload,
      });
      window.location.reload(true);
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId("");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    handleScrollForAssociatedProperties();
    allPropertiesByPaginationObject.scrollHandler();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**Fetching All The Associated Properties Of A Taxonomy By Pagination*/
  let initialPageNumberForAssociatedProperties = 1;
  let paginationMetaDataForAssociatedProperties = useRef({});

  const [associatedProperties, setAssociatedProperties] = useState([]);

  const getAssociatedPropertiesByPagination = useCallback(
    async (page) => {
      let url = "";
      let tempList = [];
      try {
        url = `${process.env.REACT_APP_BASE_URL}/api/properties/${orgId}/${taxonomyId}?page=${page}`;
        const allPropertiesResponse = await axios.get(url);
        allPropertiesResponse.data.data.map((field) =>
          tempList.push(field.field_name)
        );
        setAssociatedProperties((prev) => [...prev, ...tempList]);
        paginationMetaDataForAssociatedProperties.current =
          allPropertiesResponse.data.meta_data;

        return true;
      } catch (error) {
        setError(error);
        if (error.response?.status === 401) {
          alert("Session Expired! Please Login Again.");
          removeCookie("Id", { path: "/" });
          setOrgId("");
          navigate("/");
        }
      }
    },
    [taxonomyId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /** Handling properties updation scroll */
  const handlePaginationOnScrollForAssociatedProperties = () => {
    const nextPageToLoad = initialPageNumberForAssociatedProperties + 1;

    if (document.getElementById("property-list-box-selected")) {
      const scrollHeight = document.getElementById(
        "property-list-box-selected"
      ).scrollHeight;
      const offsetHeight = document.getElementById(
        "property-list-box-selected"
      ).offsetHeight;
      const scrollTop = document.getElementById(
        "property-list-box-selected"
      ).scrollTop;

      if (
        offsetHeight + scrollTop >= scrollHeight &&
        initialPageNumberForAssociatedProperties <=
          paginationMetaDataForAssociatedProperties.current.total_pages
      ) {
        getAssociatedPropertiesByPagination(nextPageToLoad);
        initialPageNumberForAssociatedProperties += 1;
      }
    }
  };

  /** Adding eventListener to the Available Properties List Box and Fetching Initial Data */
  const handleScrollForAssociatedProperties = () => {
    const listEle = document.getElementById("property-list-box-selected");
    if (listEle) {
      listEle.addEventListener(
        "scroll",
        handlePaginationOnScrollForAssociatedProperties
      );
    } else {
      return;
    }
    const scrollHeight = listEle.scrollHeight;
    const clientHeight = listEle.clientHeight;
    const isScrollAvailable = scrollHeight > clientHeight;

    getAssociatedPropertiesByPagination(
      initialPageNumberForAssociatedProperties
    ).then((response) => {
      if (response) {
        const isPageAvailable =
          initialPageNumberForAssociatedProperties <
          paginationMetaDataForAssociatedProperties.current.total_pages;

        if (isScrollAvailable || !isPageAvailable) {
          return;
        }
        initialPageNumberForAssociatedProperties += 1;
        handleScrollForAssociatedProperties();
      }
    });
  };

  return (
    <>
      {error !== null ? (
        <div>
          <Error />
        </div>
      ) : (
        <>
          <Modal
            size="lg"
            show={isOpen}
            onHide={() => {
              setIsOpen(false);
              setAssociatedProperties([]);
              allPropertiesByPaginationObject.setFilteredProperties([]);
            }}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Edit Properties Of Taxonomy
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {" "}
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
                      allPropertiesByPaginationObject.allFilteredProperties
                    }
                    selected={associatedProperties}
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
      )}
    </>
  );
}

export default EditTaxonomyModal;
