import React from 'react'
import PropertiesSidebar from '../component/PropertiesSidebar/PropertiesSidebar';
import Property from '../component/Property/Property';
import TopNav from '../component/TopNav/TopNav';
import ErrorPage from '../component/ErrorPage/ErrorPage';

const Properties = () => {
  return (
    <>
      <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <PropertiesSidebar />
      </ErrorPage>
      <ErrorPage>
        <Property />
      </ErrorPage>
    </>
  )
}

export default Properties