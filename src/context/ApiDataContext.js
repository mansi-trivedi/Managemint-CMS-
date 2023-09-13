import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { redirect } from "react-router-dom";
import { OrgContext } from "./OrganisationContext";

/**Creating context for handling and using API data. */
const ApiDataContext = createContext();

/**Exposing custom hook which returns the allTaxonomyDataList */
export const useTaxonomies = () => {
  return useContext(ApiDataContext).taxonomies;
};

/**Exposing custom hook which returns the all property groups list */
export const usePropertyGroups = () => {
  return useContext(ApiDataContext).allPropertyGroupsList;
};

/**Exposing custom context hook which returns all properties by pagination  */
export const usePropertiesByPagination = () => {
  return useContext(ApiDataContext).allPropertiesByPaginationObject;
};

/**
 *
 *
 *
 * API Data Provider Starts Here and above all were custom hook exports to perform different actions.
 *
 *
 *
 */

/** This is context provider wrapping the component into which will provide the global access to allTaxonomyDataList, allPropertyGroupsDataList and allPropertiesByPagination */
export const ApiDataProvider = ({ children }) => {
  /** To fetch all the taxonomy data/names */
  const [taxonomies, setTaxonomies] = useState();

  //To fetch the organization id (from cookies)
  const { orgId, setOrgId, removeCookie } = useContext(OrgContext);

  /**Fetches all the taxonomy data like- names, ids etc. */
  const getTaxonomies = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/taxonomies/51098890-f1e8-469c-87e2-d5693d1a372e`
      );
      setTaxonomies(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId("");
        return redirect("/");
      }
    }
  };

  /** Fetching all property groups by pagination and storing all*/
  const [allPropertyGroupsList, setAllPropertyGroupsList] = useState([]);
  let page = useRef(1);
  let total_pages = useRef(1);

  /** To fetch all the Property Groups Data/Names */
  const getAllPropertyGroups = async () => {
    let allPropertyGroups = [];
    try {
      while (true) {
        const allPropertyGroupsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/property-groups/51098890-f1e8-469c-87e2-d5693d1a372e?page=${page.current}`
        );
        allPropertyGroups.push(...allPropertyGroupsResponse.data.data);
        total_pages.current =
          allPropertyGroupsResponse.data.meta_data.total_pages;

        if (page.current === total_pages.current) {
          setAllPropertyGroupsList(allPropertyGroups);
          break;
        }
        page.current += 1;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId("");
        return redirect("/");
      }
    }
  };

  /** Fetching properties by pagination */
  let initialPageNumber = 1;
  let paginationMetaData = useRef({});

  const [filteredProperties, setFilteredProperties] = useState([]);

  const getAllPropertiesByPagination = useCallback(async (page) => {
    let url = "";
    let tempList = [];
    try {
      url = `${process.env.REACT_APP_BASE_URL}/api/properties/51098890-f1e8-469c-87e2-d5693d1a372e?page=${page}`;

      const allPropertiesResponse = await axios.get(url);
      allPropertiesResponse.data.data.map((field) =>
        tempList.push({ label: field.field_name, value: field.field_name })
      );

      setFilteredProperties((prev) => [...prev, ...tempList]);
      paginationMetaData.current = allPropertiesResponse.data.meta_data;

      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Session Expired! Please Login Again.");
        removeCookie("Id", { path: "/" });
        setOrgId("");
        return redirect("/");
      }
    }
  }, []);

  /** Handling properties updation scroll */
  const handlePaginationOnScroll = () => {
    const nextPageToLoad = initialPageNumber + 1;

    if (document.getElementById("property-list-box-available")) {
      const scrollHeight = document.getElementById(
        "property-list-box-available"
      ).scrollHeight;
      const offsetHeight = document.getElementById(
        "property-list-box-available"
      ).offsetHeight;
      const scrollTop = document.getElementById(
        "property-list-box-available"
      ).scrollTop;

      if (
        offsetHeight + scrollTop >= scrollHeight &&
        initialPageNumber <= paginationMetaData.current.total_pages
      ) {
        getAllPropertiesByPagination(nextPageToLoad);
        initialPageNumber += 1;
      }
    }
  };

  /** Adding eventListener to the Available Properties List Box and Fetching Initial Data */
  const handleScroll = () => {
    const listEle = document.getElementById("property-list-box-available");
    if (listEle) {
      listEle.addEventListener("scroll", handlePaginationOnScroll);
    } else {
      return;
    }
    const scrollHeight = listEle.scrollHeight;
    const clientHeight = listEle.clientHeight;
    const isScrollAvailable = scrollHeight > clientHeight;

    getAllPropertiesByPagination(initialPageNumber).then((response) => {
      if (response) {
        const isPageAvailable =
          initialPageNumber < paginationMetaData.current.total_pages;
        if (isScrollAvailable || !isPageAvailable) {
          return;
        }
        initialPageNumber += 1;
        handleScroll();
      }
    });
  };

  const fetchInitialData = () => {
    /**Setting page 1 so that data is reloaded starting from page 1 in files other than ApiDataContext */
    page.current = 1;
    if (orgId !== undefined && orgId !== "") {
      getTaxonomies();
      getAllPropertyGroups(1);
    }
  };

  useEffect(() => {
    fetchInitialData();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <ApiDataContext.Provider
        value={{
          taxonomies: taxonomies,
          allPropertyGroupsList: allPropertyGroupsList,
          allPropertiesByPaginationObject: {
            allFilteredProperties: filteredProperties,
            setFilteredProperties: setFilteredProperties,
            scrollHandler: handleScroll,
          },
        }}
      >
        {children}
      </ApiDataContext.Provider>
      {/* )} */}
    </>
  );
};
