import { React, useState, useContext } from "react";
import { Person } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import "./UserSidebar.css";
import { OrgContext } from "../../context/OrganisationContext";

const UserSidebar = () => {
  const [isClicked, setIsClicked] = useState(true);
  const { orgId } = useContext(OrgContext);

  return (
    <>
      {true && (
        <div className="sidenavUser">
          <div
            className={isClicked ? "user-management2" : "user-management"}
            onClick={() => setIsClicked(!isClicked)}
          >
            <span id="userIcon">
              <Person />
            </span>
            <span id="User-sidebar-management-head">User Management</span>
            <span id="downIcon">
              {isClicked ? <BsChevronUp /> : <BsChevronDown />}
            </span>
          </div>
          {isClicked && (
            <ul className="sidebarUser-links">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link-active" : "link"
                }
                to={`/orgs/${orgId}/orgs-setting/users`}
              >
                <li className="Users-li">Users</li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link-active" : "link"
                }
                to={`/orgs/${orgId}/orgs-setting/roles`}
              >
                <li className="Users-li">Roles</li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link-active" : "link"
                }
                to={`/orgs/${orgId}/orgs-setting/userGroup`}
              >
                <li className="Users-li">User Groups</li>
              </NavLink>
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default UserSidebar;
