import React, { useState, useEffect } from 'react'
import { Spin } from 'antd';
import BrandLogo from "@/assets/images/stockit-dark.png";

// actions
import withRouter from '@/common/withRouter';

import secureLocalStorage from  "react-secure-storage";
const user = secureLocalStorage.getItem('authUser') ? JSON.parse(secureLocalStorage.getItem('authUser')) : null

const AuthSSO = (props) => {
    useEffect(() => {
        var redirect_uri = `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/auth?`
        + `scope=${import.meta.env.VITE_KEYCLOAK_SCOPE}&`
        + `response_type=${import.meta.env.VITE_KEYCLOAK_RESPONSE_CODE}&`
        + `client_id=${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}&`
        + `redirect_uri=${import.meta.env.VITE_KEYCLOAK_REDIRECT_URI}`;

        window.location.href = redirect_uri;
    }, [user]);

    return (
        <React.Fragment>
            <div style={{ 
                position: 'absolute',
                top: '50%', 
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '100%'
            }}>
                <Spin size="large"/>
                <img
                    alt="StockIt"
                    src={BrandLogo}
                    height={60}
                    style={{ marginLeft: 20 }}
                    className="brand-sm-logo ant-mx-auto"
                /><br/><br/>
                <span style={{ marginLeft: 120 }}>Redirect to keycloak authentication...</span>
            </div>
        </React.Fragment>
    )
}

export default withRouter(AuthSSO)