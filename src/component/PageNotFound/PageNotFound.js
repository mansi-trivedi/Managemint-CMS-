import React, { useContext } from "react";
import "./PageNotFound.css";
import { useNavigate } from "react-router-dom";
import { OrgContext } from "../../context/OrganisationContext";

/* this will render when route is not found */
const PageNotFound = () => {
  const navigate = useNavigate();
  const { orgId } = useContext(OrgContext);
  return (
    <>
      <div className="errorPage">
        <div className="errorImg">
          <img src={require("../../image/error.png")} alt="" />
        </div>
        <div className="errorData">
          <h1>404</h1>
          <h2>UH OH! You're lost.</h2>
          <p>
            The page you are looking for does not exist. How you got here is a
            mystery. But you can click the button below to go back to the
            homepage.
          </p>
          <button
            onClick={() => navigate(`/records/allrecords?org_id=${orgId}`)}
          >
            HOME
          </button>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
