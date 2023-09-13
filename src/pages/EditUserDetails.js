import React from 'react'
import UserSidebar from '../component/UserSidebar/UserSidebar'
import EditUser from '../component/EditUser/EditUser'
import TopNav from '../component/TopNav/TopNav'
import ErrorPage from '../component/ErrorPage/ErrorPage'

const EditUserDetails = () => {
  return (
    <>
       <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <UserSidebar/>
      </ErrorPage>
      <ErrorPage>
        <EditUser/>
      </ErrorPage>
    </>
  )
}

export default EditUserDetails