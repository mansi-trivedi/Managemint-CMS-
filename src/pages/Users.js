import React from 'react'
import UserSidebar from '../component/UserSidebar/UserSidebar';
import OrgSettingUser from '../component/OrgSettingUser/OrgSettingUser';
import TopNav from '../component/TopNav/TopNav';
import ErrorPage from '../component/ErrorPage/ErrorPage';

const Users = () => {
  return (
    <>
      <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <UserSidebar />
      </ErrorPage>
      <ErrorPage>
        <OrgSettingUser />
      </ErrorPage>
    </>
  )
}

export default Users