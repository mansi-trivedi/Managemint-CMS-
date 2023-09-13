import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { BsTags } from "react-icons/bs";
import { CgInfo } from "react-icons/cg";
import "./SideNav.css";
import { useTaxonomies } from "../../context/ApiDataContext";
import { OrgContext } from "../../context/OrganisationContext";

const SideNav = () => {

  /** Fetching Taxonomy Data from the Application Context */
  const taxonomyData = useTaxonomies();
  const { orgId } = useContext(OrgContext);

  return (
    <>
      <div className="sidenav">
        <ul className="top-div">
          <NavLink
            className={({ isActive }) => (isActive ? "link-active" : "link")}
            to={`/orgs/${orgId}/records/allrecords`}
          >
            <li>
              <BsTags />
              <span style={{ paddingLeft: "5px" }}> All Records</span>
            </li>
          </NavLink>
        </ul>
        <hr style={{ width: "98%", color: "black" }}></hr>
        <div className="more-records">
          <span id="info-text">More Records </span>
          <span id="info-icon">
            <CgInfo size="13px" />
          </span>
        </div>
        <ul className="sidebarHome-links">
          {taxonomyData &&
            taxonomyData.map((taxonomy) => {
              return (
                <NavLink
                  key={taxonomy.taxonomy_id}
                  className={({ isActive }) =>
                    isActive ? "link-active" : "link"
                  }
                  to={`/orgs/${orgId}/records/${taxonomy.taxonomy_id}`}
                >
                  <li>{taxonomy.taxonomy_name}</li>
                </NavLink>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default SideNav;
