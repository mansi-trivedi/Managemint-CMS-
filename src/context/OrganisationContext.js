import React, { useState, createContext } from 'react'
import { useCookies } from 'react-cookie';

export const OrgContext = createContext();

export const OrgIdProvider = ({ children }) => {
    
    const [cookies, setCookie, removeCookie] = useCookies(['organisation']);
    const [orgId, setOrgId] = useState(cookies["Id"]);
    
    return (
        <>
            <OrgContext.Provider
                value={{
                    cookies,
                    setCookie,
                    removeCookie,
                    orgId,
                    setOrgId
                }}
            >
                {children}
            </OrgContext.Provider>
        </>
    )
}

