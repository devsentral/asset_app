import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { customStyle, themecolor } from './config.jsx';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.Fragment>
        <ConfigProvider direction={themecolor.direction} theme={customStyle} >
            <BrowserRouter basename={import.meta.env.VITE_PUBLIC_URL}>
                <App />
            </BrowserRouter>
        </ConfigProvider>
    </React.Fragment>
);
