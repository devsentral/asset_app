import React, { useState, useEffect } from 'react'
import { Spin } from 'antd';
import { api } from '@/api'
import BrandLogo from "@/assets/images/stockit-dark.png";

// actions
import withRouter from '@/common/withRouter';

const AuthRedirect = (props) => {
    // page title
    document.title = "Sign In" + import.meta.env.VITE_APP_PAGE_TITLE;
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if(code) {
            const payload = {
                code: code,
                redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
            }
            api("POST", `auth/keycloak-token`, payload).then((res) => {
            }).catch((err) => {
                message.warning(err.meta.message)
            })
        }
    }, []);

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
                <span style={{ marginLeft: 120 }}>Authorization successfully, redirecting to application...</span>
            </div>
        </React.Fragment>
    )
}

export default withRouter(AuthRedirect)