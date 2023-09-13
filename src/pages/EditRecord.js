import React from 'react'
import TopNav from '../component/TopNav/TopNav'
import ErrorPage from '../component/ErrorPage/ErrorPage'
import ShowRecord from '../component/ShowRecord/ShowRecord'

const EditRecord = () => {
  return (
    <>
       <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <ShowRecord />
      </ErrorPage>
    </>
  )
}

export default EditRecord