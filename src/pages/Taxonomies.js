import React from 'react'
import PropertiesSidebar from '../component/PropertiesSidebar/PropertiesSidebar'
import ProductTaxonomies from '../component/EditTaxonomies/EditTaxonomies'
import TopNav from '../component/TopNav/TopNav'
import ErrorPage from '../component/ErrorPage/ErrorPage'

const Taxonomies = () => {
  return (
    <>
      <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <PropertiesSidebar />
      </ErrorPage>
      <ErrorPage>
        <ProductTaxonomies />
      </ErrorPage>
    </>
  )
}

export default Taxonomies