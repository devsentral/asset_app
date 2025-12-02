import React, { useState } from "react";
import withRouter from "../common/withRouter.jsx";
import BrandLogo from "../assets/images/logo-dark.png";
import BrandlightLogo from "../assets/images/logo-light.png";

import {
    QrCode,
} from "lucide-react";
import { themecolor } from "../config.jsx";
import {
    StyleSimpleBar,
    StyledCollapsedButton,
    StyleBrandLogo,
} from "../common/SidebarStyle.jsx";
import { Link, useLocation } from "react-router-dom";

const SidebarLayout = ({ theme, expand }) => {
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const items = [
        getItem("App", "App", null,
            [
                getItem(<Link to="/stock-takings">Home</Link>, "stock-taking", <QrCode size={16} />),
                getItem(<Link to="/stock-takings">Final Report</Link>, "final-report", <QrCode size={16} />),
                getItem(<Link to="/stock-takings">Stock List</Link>, "stock-list", <QrCode size={16} />),
                getItem("Settings", "Authentication", <Settings size={16} />, [
                    getItem(<Link to="/setting/assets">Assets</Link>, "asset"),
                    getItem(<Link to="/setting/workflows">Workflow</Link>, "workflow"),
                ]),
            ],
            "group"
        ),
    ];

    const [collapsed, setCollapsed] = useState(expand);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
        const antHeaderMain = document.getElementById("antHeaderMain");
        if (antHeaderMain) {
            antHeaderMain.style.left = !collapsed ? "100px" : "260px";
        }
        const antLayoutContent = document.getElementById("antLayoutContent");
        if (antLayoutContent) {
            antLayoutContent.style.marginLeft = !collapsed ? "100px" : "260px";
        }
        const antFooterLayout = document.getElementById("antFooterLayout");
        if (antFooterLayout) {
            antFooterLayout.style.marginLeft = !collapsed ? "100px" : "260px";
        }
    };

    const location = useLocation();
    const [activatedItem, setActivatedItem] = useState(() => {
        const currentPath = location.pathname.replace("/", "");
        return currentPath || "dashboard";
    });
    
    const toggleActivation = (key) => {
        setActivatedItem((prevActivatedItem) => (prevActivatedItem === key ? null : key));
    };

    const handleToggleButton = () => {
        setIsClick(prevIsClick => !prevIsClick); // Use the previous stateSD
        const sidebarLayout = document.getElementById('sidebar-layout');
        sidebarLayout.style.display = isClick ? 'none' : 'block';
    };
  
    return (
        <React.Fragment>
            <StyleSider
                id="sidebar-layout"
                width={themecolor.components.Menu.verticalSidebarWidth}
                collapsed={collapsed}
                collapsedWidth="100"
                breakpoint="lg"
            >
                <StyleBrandLogo className="demo-logo ant-mx-auto">
                    <img
                        alt="Brand logo"
                        src={theme === 'dark' ? BrandlightLogo : BrandLogo}
                        height={30}
                        style={{ lineHeight: "24px", }}
                        className="brand-dark-logo ant-mx-auto"
                    />
                    <img
                        alt="Brand sm logo"
                        src={theme === 'dark' ? BrandlightLogo : BrandLogo}
                        height={24}
                        style={{ lineHeight: "24px" }}
                        className="brand-sm-logo ant-mx-auto"
                    />
                </StyleBrandLogo>
                <div>
                    <StyleSimpleBar>
                        <Menu
                        selectedKeys={[activatedItem]}
                        mode="inline"
                        theme="light"
                        items={items}
                        collapsedWidth="100"
                        onClick={({ key }) => toggleActivation(key)}
                        ></Menu>
                    </StyleSimpleBar>
                </div>
            </StyleSider>
        </React.Fragment>
    );
};

export default withRouter(SidebarLayout);
