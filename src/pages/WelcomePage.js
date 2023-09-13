import React from 'react'
import Welcome from '../component/Welcome/Welcome'
import ErrorPage from '../component/ErrorPage/ErrorPage';

const WelcomePage = () => {
  return (
    <ErrorPage>
      <Welcome/>
    </ErrorPage>
  )
}

export default WelcomePage