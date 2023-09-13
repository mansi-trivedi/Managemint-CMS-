import React from "react";
import TopNav from "../component/TopNav/TopNav";
import UserSidebar from "../component/UserSidebar/UserSidebar";
import AddAndEditUserRole from "../component/AddAndEditUserRole/AddAndEditUserRole";
import ErrorPage from "../component/ErrorPage/ErrorPage";

const EditUserRole = () => {
  return (
    <>
      <ErrorPage>
        <TopNav />
      </ErrorPage>
      <ErrorPage>
        <UserSidebar />
      </ErrorPage>
      <ErrorPage>
        <AddAndEditUserRole />
      </ErrorPage>
    </>
  );
};

export default EditUserRole;
