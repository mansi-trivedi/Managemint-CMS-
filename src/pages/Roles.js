import React from 'react'
import TopNav from '../component/TopNav/TopNav'
import ErrorPage from '../component/ErrorPage/ErrorPage'
import UserSidebar from '../component/UserSidebar/UserSidebar';
import OrgSettingRole from '../component/OrgSettingRole/OrgSettingRole'

const Roles = () => {
    return (
        <>
            <ErrorPage>
                <TopNav />
            </ErrorPage>
            <ErrorPage>
                <UserSidebar />
            </ErrorPage>
            <ErrorPage>
                <OrgSettingRole />
            </ErrorPage>
        </>
    )
}

export default Roles