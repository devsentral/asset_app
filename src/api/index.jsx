import axios from 'axios';
import { message } from 'antd';

axios.defaults.headers.common['client-id'] = import.meta.env.VITE_CLIENT_KEY;
axios.defaults.headers.common['client-secret'] = import.meta.env.VITE_CLIENT_SECRET;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

import secureLocalStorage from  "react-secure-storage";
const user = secureLocalStorage.getItem('authUser') ? JSON.parse(secureLocalStorage.getItem('authUser')) : null
if(user) axios.defaults.headers.common['authorization'] = `Bearer ${user.access_token}`;

var self = {
    useAxios: async (method, path, payload) => {
        try {
            var endpoint = import.meta.env.VITE_API_URL;
            var config = {
                method: method,
                url: method == 'GET' && payload ? `${endpoint}/${path}?` + new URLSearchParams(payload) : `${endpoint}/${path}`,
                data: payload,
                withCredentials: true,
                credentials: 'include'
            }
            let result = await axios(config)
                .catch(async function (error) {
                    if(error.response?.data?.error == 'unauthorized') {
                        secureLocalStorage.removeItem('roleAccess');
                        secureLocalStorage.removeItem('authUser');

                        var url = `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/auth?`
                        url += `scope=${import.meta.env.VITE_KEYCLOAK_SCOPE}&`
                        url += `response_type=${import.meta.env.VITE_KEYCLOAK_RESPONSE_CODE}&`
                        url += `client_id=${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}&`
                        url += `redirect_uri=${import.meta.env.VITE_KEYCLOAK_REDIRECT_URI}`;

                        window.location.href = url;
                    }
                })
            return result;
        }
        catch (e) {
            console.log(e)
            return
        }
    },

    api: async (method, path, payload = null) => {
        try {
            var result = await self.useAxios(method, path, payload)
            if(path == 'auth/keycloak-token') {

                if(result?.data?.meta?.success) {
                    message.destroy()
                    message.success('Successfully authenticated', 2)
                    secureLocalStorage.setItem('roleAccess', JSON.stringify(result.data?.data?.role_access));
                    secureLocalStorage.setItem('authUser', JSON.stringify(result.data?.data));

                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirectUri = urlParams.get('redirect_to');
                        if (redirectUri) {
                            window.location.href = redirectUri;
                        } else {
                            window.location.href = '/dashboard'
                        }
                    }, 1000);
                } else {
                    message.error(res.meta?.message)
                }
            }

            if(path == 'auth/keycloak-logout') {
                if(result?.data?.meta?.success) {
                    message.destroy()
                    message.success('Successfully logout', 2)

                    secureLocalStorage.removeItem('authUser');
                    secureLocalStorage.removeItem('roleAccess');
                }
            }

            if(result.data?.meta?.success) return result.data;
            return result.data;
        } catch (e) {
            console.log(e)
        }
    },
};

export const api = self.api;

export const authUser = user;   