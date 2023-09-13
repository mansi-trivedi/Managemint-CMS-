import React from 'react'
import PropertiesSidebar from '../component/PropertiesSidebar/PropertiesSidebar';
import PropertyGroup from '../component/PropertyGroup/PropertyGroup';
import TopNav from '../component/TopNav/TopNav';
import ErrorPage from '../component/ErrorPage/ErrorPage';

const PropertiesGroups = () => {
  return (
    <>
      <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <PropertiesSidebar />
      </ErrorPage>
      <ErrorPage>
        <PropertyGroup />
      </ErrorPage>
    </>
  )
}

export default PropertiesGroups