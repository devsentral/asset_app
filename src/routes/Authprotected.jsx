import React, { useEffect } from 'react'
import { Navigate } from "react-router-dom";
import secureLocalStorage from  "react-secure-storage";

const AuthProtected = (props) => {
    /*
      Navigate is un-auth access protected routes via url
      */
    const user = secureLocalStorage.getItem('authUser') ? JSON.parse(secureLocalStorage.getItem('authUser')) : null
    
    if (!user) {
        return (
            <Navigate to={{ pathname: "/keycloak"}} />
        );
    }

    return <>{props.children}</>;
}

export default AuthProtected
