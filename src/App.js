import { Navigate, Route, Routes} from "react-router-dom";
import React, {useContext} from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Properties from "./pages/Properties";
import PropertiesGroups from "./pages/PropertiesGroups";
import EditRecord from "./pages/EditRecord";
import Taxonomies from "./pages/Taxonomies";
import AllTaxonomiesPage from "./pages/AllTaxonomiesPage";
import WelcomePage from "./pages/WelcomePage";
import EditProperty from "./pages/EditProperty";
import "./App.css";
import { ApiDataProvider } from "./context/ApiDataContext";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import PageNotFound from "./component/PageNotFound/PageNotFound";
import { OrgContext } from "./context/OrganisationContext";
import EditUserDetails from "./pages/EditUserDetails";
import Profile from "./pages/Profile";
import UserGroups from "./pages/UserGroups";
import EditUserGroup from "./pages/EditUserGroup";
import EditUserRole from "./pages/EditUserRole";

function App() {

  const { orgId } = useContext(OrgContext);

  return (
    orgId ? 
    <>
      <Routes>
        <Route exact path="/" element={<WelcomePage />} />
        <Route exact path={`/orgs/${orgId}/property`} element={<ApiDataProvider><Properties /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/property/:propertyId`} element={<ApiDataProvider><EditProperty/></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/property-groups`} element={<ApiDataProvider><PropertiesGroups /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/records/:taxonomyId/:RecordId`} element={<ApiDataProvider><EditRecord /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/editTaxonomies/:taxonomyId`} element={<ApiDataProvider><Taxonomies /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/records/:taxonomyId`} element={<ApiDataProvider><AllTaxonomiesPage /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/orgs-setting/users`} element={<ApiDataProvider><Users /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/orgs-setting/users/:userId`} element={<ApiDataProvider><EditUserDetails /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/profile`} element={<ApiDataProvider><Profile /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/orgs-setting/userGroup`} element={<ApiDataProvider><UserGroups /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/orgs-setting/userGroup/:groupId`} element={<ApiDataProvider><EditUserGroup /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/orgs-setting/roles`} element={<ApiDataProvider><Roles /></ApiDataProvider>} />
        <Route exact path={`/orgs/${orgId}/orgs-setting/roles/:roleId`} element={<ApiDataProvider><EditUserRole /></ApiDataProvider>} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
    :
    <>
    <Routes>
      <Route exact path="/" element={<WelcomePage />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
    </>
  );
}

export default App;
