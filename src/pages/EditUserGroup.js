import React from 'react'
import TopNav from '../component/TopNav/TopNav'
import ErrorPage from '../component/ErrorPage/ErrorPage'
import UserSidebar from '../component/UserSidebar/UserSidebar';
import AddEditUserGroup from '../component/AddEditUserGroup/AddEditUserGroup';

const EditUserGroup = () => {
    return (
        <>
            <ErrorPage>
                <TopNav />
            </ErrorPage>
            <ErrorPage>
                <UserSidebar />
            </ErrorPage>
            <ErrorPage>
                <AddEditUserGroup/>
            </ErrorPage>
        </>
    )
}

export default EditUserGroup