import React from 'react'
import ErrorPage from '../component/ErrorPage/ErrorPage'
import UserSidebar from '../component/UserSidebar/UserSidebar'
import OrgSettingUserGroup from '../component/OrgSettingUserGroup/OrgSettingUserGroup'
import TopNav from '../component/TopNav/TopNav'

const UserGroups = () => {
    return (
        <>
            <ErrorPage>
                <TopNav />
            </ErrorPage>
            <ErrorPage>
                <UserSidebar />
            </ErrorPage>
            <ErrorPage>
                <OrgSettingUserGroup/>
            </ErrorPage>
        </>
    )
}

export default UserGroups