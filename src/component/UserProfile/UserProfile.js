import React, { useContext } from 'react'
import "./UserProfile.css"
import { Check, Edit, Close, Info, ArrowBack } from '@mui/icons-material';
import Error from '../Error/Error';
import { useState } from 'react';
import axios from 'axios';
import { OrgContext } from '../../context/OrganisationContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [userDetail, setUserDetail] = useState(user)
  const [editFirstname, setEditFirstname] = useState(false)
  const [editLastname, setEditLastname] = useState(false)
  const [error, setError] = useState(null)
  const { orgId } = useContext(OrgContext);
  const [isOpen, setIsOpen] = useState(false)
  const [passwordError, setPasswordErrors] = useState({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const navigate = useNavigate();

  const handleFirstname = () => {
    setEditFirstname(!editFirstname)
  }

  const handleLastname = () => {
    setEditLastname(!editLastname)
  }

  const handleChange = (e) => {
    try {
      const name = e.target.name;
      const value = e.target.value;
      setUserDetail({
        ...userDetail,
        [name]: value,
      });
    } catch (error) {
      setError({ error });
      ;
    }
  };

  const handlePasswordChange = (e) => {
    try {
      const name = e.target.name;
      const value = e.target.value;
      setPasswordData({
        ...passwordData,
        [name]: value,
      });
    } catch (error) {
      setError({ error });
      ;
    }
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${orgId}/${userDetail.user_id}`,
        {
          first_name: userDetail.first_name,
          last_name: userDetail.last_name
        }
      );
      setEditFirstname(false)
      setEditLastname(false)
      localStorage.setItem('user', JSON.stringify(userDetail))
    }
    catch (error) {
      setError({ error });
      ;
    }
  }

  const validatePassword = (values) => {
    let errors = {}
    let passwordIsValid = true;
    let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/

    if (!regex.test(values.newPassword)) {
      passwordIsValid = false;
      errors.newPassword = "This is not a valid password format!";
    }
    else if (values.newPassword !== values.confirmPassword) {
      passwordIsValid = false;
      errors.confirmPassword = "Confirm Password must be same as Password";
    }

    setPasswordErrors(errors)
    return passwordIsValid
  };

  const savePassword = async () => {
    try {
      if (validatePassword(passwordData)) {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/users/changepassword/${orgId}/${userDetail.user_id}`,
          {
            old_password: passwordData.currentPassword,
            new_password: passwordData.newPassword
          }
        )
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        alert(response.data.message)
      }
    }
    catch (error) {
      setError({ error });
      ;
    }
  }

  return (
    <>
      {error !== null ? (
        <div className="show-property-page-div">
          <Error />
        </div>
      ) : (
        <>
          <div className='userHeading'>
            <h4>User Profile</h4>
            <button
              className="backButton"
              onClick={() => navigate(`/orgs/${orgId}/records/allrecords`)}
            >
              <ArrowBack
                sx={{ color: "white", fontSize: 20, marginRight: "3px" }}
              />
              Back
            </button>
          </div>
          <div className='user-Profile-Details'>
            <table className='user-Profile-Detail-table'>
              <tbody>
                <tr>
                  <th>Firstname:</th>
                  <td>{
                    editFirstname ?
                      <input className='user-detail-input' name="first_name" defaultValue={userDetail.first_name} onChange={handleChange} /> :
                      userDetail.first_name
                  }
                  </td>
                  <td>{
                    !editFirstname ?
                      <Edit sx={{ color: "rgb(227, 227, 227)", '&:hover': { color: "rgb(197, 197, 197)" } }} onClick={handleFirstname} /> :
                      <>
                        <Close sx={{ color: "red", stroke: "red", strokeWidth: 1, marginRight: "1vh" }} onClick={handleFirstname} />
                        <Check sx={{ color: "blue", stroke: "blue", strokeWidth: 1 }} onClick={handleSave} />
                      </>
                  }</td>
                </tr>
                <tr>
                  <th>Lastname:</th>
                  <td>{
                    editLastname ?
                      <input className='user-detail-input' name="last_name" defaultValue={userDetail.last_name} onChange={handleChange} /> :
                      userDetail.last_name
                  }
                  </td>
                  <td>
                    {
                      !editLastname ?
                        <Edit sx={{ color: "rgb(227, 227, 227)", '&:hover': { color: "rgb(197, 197, 197)" } }} onClick={handleLastname} /> :
                        <>
                          <Close sx={{ color: "red", stroke: "red", strokeWidth: 1, marginRight: "1vh" }} onClick={handleLastname} />
                          <Check sx={{ color: "blue", stroke: "blue", strokeWidth: 1 }} onClick={handleSave} />
                        </>
                    }
                  </td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>{userDetail.email}</td>
                </tr>
                <tr>
                  <th>Organisation:</th>
                  <td>Celebal Technologies</td>
                </tr>
                <tr>
                  <th>Roles:</th>
                  <td>{
                    userDetail.roles.map((role) => role.role_name)
                    }</td>
                </tr>
                <tr>
                  <th>Groups:</th>
                  <td>{
                    userDetail.groups.map((group) => group.group_name)
                    }</td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr style={{ borderBottom: "1px solid grey", width: "98%", marginLeft: "1%" }} />
          <div className='user-password'>
            <h6>Password:</h6>
            <div className='change-password'>
              <div className='password'>
                <input name="currentPassword" placeholder='Current password' className='currentPassword' onChange={handlePasswordChange} value={passwordData.currentPassword} required />
              </div>
              <div className='password'>
                <input name="newPassword" placeholder='new password' className='newPassword' onChange={handlePasswordChange} value={passwordData.newPassword} required />
                <div className='information' onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}>
                  <Info sx={{ color: "rgb(84, 137, 230)", marginLeft: "2vh" }}
                  />
                  {
                    isOpen && (
                      <div className='passwordInfo'>
                        <p>
                          Try some of these tips:
                          <br />
                          <br />
                          * Use at least 8 characters
                          <br />
                          * Use upper and lower case letters (Aa-Zz)
                          <br />
                          * Use numbers and special characters
                        </p>
                      </div>
                    )
                  }
                </div>
              </div>
              {passwordError.newPassword ? <p className="error">{passwordError.newPassword}</p> : null}
              <div className='password'>
                <input name="confirmPassword" placeholder='confirm password' className='confirmPassword' onChange={handlePasswordChange} value={passwordData.confirmPassword} required />
              </div>
              {passwordError.confirmPassword ? <p className="error">{passwordError.confirmPassword}</p> : null}
              <button className='changePasswordButton' onClick={savePassword}>
                Change Password
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default UserProfile