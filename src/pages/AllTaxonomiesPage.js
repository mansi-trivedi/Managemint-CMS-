import React from 'react'
import SideNav from '../component/SideNav/SideNav'
import AllTaxonomies from '../component/AllTaxonomiesRecords/AllTaxonomiesRecords'
import TopNav from '../component/TopNav/TopNav'
import ErrorPage from '../component/ErrorPage/ErrorPage'

const AllTaxonomiesPage = () => {
  return (
    <>
      <ErrorPage>
        <TopNav />
      </ErrorPage>

      <ErrorPage>
        <SideNav />
      </ErrorPage>
      
      <ErrorPage>
        <AllTaxonomies />
      </ErrorPage>



    </>
  )
}

export default AllTaxonomiesPage