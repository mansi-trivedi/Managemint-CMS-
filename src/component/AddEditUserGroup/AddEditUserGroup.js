import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrgContext } from "../../context/OrganisationContext";
import axios from "axios";
import "./AddEditUserGroup.css";
import Error from "../Error/Error";

const AddEditUserGroup = () => {
  const [configurations, setConfigurations] = useState(true);
  const [groupDetail, setGroupDetail] = useState({});
  const [error, setError] = useState(null);
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  useEffect(() => {
    const callFn = async () => {
      try {
        if (groupId !== "new-user-group") {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}/${groupId}`
          );
          setGroupDetail(response.data.data);
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
  }, [setGroupDetail]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfiguration = () => {
    setConfigurations(!configurations);
  };

  const handleChange = (e) => {
    try {
      const name = e.target.name;
      const value = e.target.value;
      setGroupDetail({
        ...groupDetail,
        [name]: value,
      });
    } catch (error) {
      setError({ error });
    }
  };

  const handleSave = async () => {
    try {
      if (groupId !== "new-user-group") {
        await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}/${groupId}`,
          groupDetail
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/groups/${orgId}`,
          groupDetail
        );
      }
      navigate(`/orgs/${orgId}/orgs-setting/userGroup`);
    } catch (error) {
      setError({ error });
    }
  };

  const handleEmailClick = (userId) => {
    navigate(`/orgs/${orgId}/orgs-setting/users/${userId}`);
  };

  return (
    <>
      {error !== null ? (
        <div className="editUserGroup">
          <Error />
        </div>
      ) : (
        <>
            {
                error !== null ?
                    <div className='editUserGroup'>
                        <Error />
                    </div> :
                    <>
                        <div className='editUserGroup'>
                            <div className='editUserGroupTopNav'>
                                <div className={configurations ? 'topNavItemActive' : 'topNavItem'} onClick={handleConfiguration}>
                                    <p>Configurations</p>
                                </div>
                                <div className={configurations ? 'topNavItem' : 'topNavItemActive'} onClick={handleConfiguration}>
                                    <p>Users</p>
                                </div>
                            </div>
                            {
                                configurations ?
                                    <>
                                        <div id="configurations">
                                            <div className='configurationsOne'>
                                                <div className='editUserGroupButton'>
                                                    <h3 className='editUserGroupHeading'>{groupId !== 'new-user-group' ? 'Edit' : 'Add'} User Group</h3>
                                                    <div className='UserGroupButton'>
                                                        <button className='editUserGroupCancelButton' onClick={() => { navigate(`/orgs/${orgId}/orgs-setting/userGroup`) }}>Cancel</button>
                                                        <button className='editUserGroupSaveButton' onClick={handleSave}>Save</button>
                                                    </div>
                                                </div>
                                                <div className='editUserGroupForm'>
                                                    <div className='userGroupTitle'>
                                                        <label className='userGroupTitleLabel'>User Group Title:</label>
                                                        <br />
                                                        <input className='userGroupTitleInput' name='group_name' defaultValue={groupId !== 'new-user-group' ? groupDetail.group_name : null} onChange={handleChange} />
                                                    </div>
                                                    <div className='userGroupDescription'>
                                                        <label className='userGroupDescriptionLabel'>Description:</label>
                                                        <br />
                                                        <textarea style={{ height: "80px", width: "60%", borderRadius: "5px", border: "1px solid rgb(187, 187, 187)", paddingLeft: "5px" }} name='Description' className='userGroupDescriptionInput' defaultValue={groupId !== 'new-user-group' ? groupDetail.Description : null} onChange={handleChange} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div id="users">
                                        <div className='all-user-group-name'>
                                            <span className='all-user-group-name-span1'>User Group - </span>
                                            <span className='all-user-group-name-span2'>{groupDetail.group_name}</span>
                                        </div>
                                        {/* <hr style={{borderBottom: "1px solid grey", width: "98%", marginLeft: "5px"}}/> */}
                                        <div className="all-user-table-group">
                                            <table>
                                                <thead>
                                                    <tr className="all-user-thead-tr-group">
                                                        <th className="all-user-email-th-group">Email</th>
                                                        <th className="all-user-fullname-th-group">FullName</th>
                                                        <th className="all-user-last-active-th-group">Last Active</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="all-user-tbody-group">
                                                    {Object.keys(groupDetail).length !== 0 && groupDetail.users.map((user, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td className="all-user-email-td-group" onClick={() => handleEmailClick(user.user_id)}>
                                                                    {user.email}
                                                                </td>
                                                                <td>
                                                                    {user.first_name + " " + user.last_name}
                                                                </td>
                                                                <td>
                                                                    {user.last_active_time}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                            }
                        </div>
                    </>
            }
        </>
      )}
    </>
  );
};

export default AddEditUserGroup;
