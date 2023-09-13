import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "./PropertiesSidebar.css";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Add } from "@mui/icons-material";
import { useTaxonomies } from "../../context/ApiDataContext";
import AddTaxonomyModal from "../AddTaxonomyModal/AddTaxonomyModal";
import { OrgContext } from "../../context/OrganisationContext";

const PropertiesSidebar = () => {
  const [isClicked, setIsClicked] = useState(true);
  const [taxonomyClicked, setTaxonomyClicked] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  /** Fetching Data using Application Context */
  const taxonomyData = useTaxonomies();
  const { orgId } = useContext(OrgContext);

  return (
    <>
      {true && (
        <div className="sidenavProperty">
          <div
            className={isClicked ? "p-management2" : "p-management"}
            onClick={() => setIsClicked(!isClicked)}
          >
            <span id="p-sidebar-management-head">Property Management</span>
            <span id="downIcon">
              {isClicked ? <BsChevronUp /> : <BsChevronDown />}
            </span>
          </div>
          {isClicked && (
            <ul className="sidebarProperties-links">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link-active" : "link"
                }
                to={`/orgs/${orgId}/property`}
              >
                <li className="properties-li">Properties</li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link-active" : "link"
                }
                to={`/orgs/${orgId}/property-groups`}
              >
                <li className="properties-li">Property Group</li>
              </NavLink>
            </ul>
          )}
          <div className="taxonomies-div">
            <div
              className={
                taxonomyClicked ? "taxonomies-head-div2" : "taxonomies-head-div"
              }
              onClick={() => {
                setTaxonomyClicked(!taxonomyClicked);
              }}
            >
              <span id="taxonomies-head">Taxonomies</span>
              <span id="downIcon">
                {taxonomyClicked ? <BsChevronUp /> : <BsChevronDown />}
              </span>
            </div>
            {taxonomyClicked && (
              <>
                <ul className="sidebarPropertiesTaxonomy-links">
                  {taxonomyData &&
                    taxonomyData.map((taxonomy, key) => {
                      return (
                        <React.Fragment key={key}>
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "link-active" : "link"
                            }
                            style={{ textDecoration: "none" }}
                            key={taxonomy.taxonomy_id}
                            to={`/orgs/${orgId}/editTaxonomies/${taxonomy.taxonomy_id}`}
                          >
                            <li className="properties-li">
                              {taxonomy.taxonomy_name}
                            </li>
                          </NavLink>
                        </React.Fragment>
                      );
                    })}
                </ul>
                <p
                  className="addtaxonomy"
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                  }}
                >
                  <Add size={15} /> Add New Taxonomy
                </p>
                {isOpen ? (
                  <AddTaxonomyModal isOpen={isOpen} setIsOpen={setIsOpen} />
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesSidebar;
