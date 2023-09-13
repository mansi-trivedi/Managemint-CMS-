import React from 'react'
import TopNav from '../component/TopNav/TopNav'
import ErrorPage from '../component/ErrorPage/ErrorPage'
import ShowProperty from '../component/ShowProperty/ShowProperty'

const EditProperty = () => {
  return (
    <>
       <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <ShowProperty/>
      </ErrorPage>
    </>
  )
}

export default EditProperty