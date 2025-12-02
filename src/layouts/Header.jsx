import React, { useEffect, useState } from 'react';
import { Badge, Col, Popover, Row, Typography, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled } from 'styled-components';
import { themecolor } from '../config.jsx';
import {
    ClipboardList,
    FileText,
    Settings,
} from "lucide-react";
import profileImages from '../assets/images/users/user-dummy-img.jpg';
import usecustomStyles from '../common/customStyles.jsx';
import { MenuOutlined, HomeOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { AddButton } from '@/common/Button'
import { api, authUser } from '@/api'
import secureLocalStorage from  "react-secure-storage";
import {
    StyleSimpleBar,
    StyleSider,
} from "../common/SidebarStyle.jsx";
import { roleAccess } from '@/helpers/menu'

import BrandLogo from "../assets/images/stockit-light.png";

const customStyles = usecustomStyles();
const { Text } = Typography;

const StyleHeader = styled(Header)`
    padding-inline: 24px;
    position: fixed;
    left: ${({ theme }) => theme.direction === 'rtl' ? '0' : `${themecolor.components.Menu.verticalSidebarWidth}px`};
    right: ${({ theme }) => (theme.direction === 'rtl' ? `${themecolor.components.Menu.verticalSidebarWidth}px` : '0')};
    top: 0;
    border-bottom: 1px solid;
    border-color: ${({ theme }) => theme.token.colorBorder};
    z-index: 999;
    background: #673AB7;
    
    @media screen and (max-width: 768px) {
        /* Apply the responsive style without considering RTL or LTR */
        left: 0;
        right: 0;
    }
`;

const HeaderContainer = styled.ul`
    font-size: 15px;
    padding-inline: 0;
    display: flex;
    gap: 10px;
    margin: 0;
    justify-content: end;

    .ant-avatar {
        background-color: transparent;
        transition: all 0.5s ease;
        &:hover {
            background-color: ${({ theme }) => theme.token.colorBorder};
        }
    }
`;

const StyleFlagDropdown = styled.div`
    min-width:145px;

    ul {
        li {
            padding: 5px 0;
            a {
                transition: all 0.5s ease;
                &:hover {
                    color: ${customStyles.colorPrimary};
                }
            }
        }
    }
`;

const HeaderLayout = ({ stockTake }) => {

    const [isClick, setIsClick] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        setIsClick(false);
        updateWindowDimensions(); // Initialize windowWidth state
        window.addEventListener('resize', updateWindowDimensions);

        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
        };
    }, []);

    const updateWindowDimensions = () => {
        setWindowWidth(window.innerWidth);
    };

    const [collapsed, setCollapsed] = useState(true);

    const location = useLocation();
    const [activatedItem, setActivatedItem] = useState(() => {
        const currentPath = location.pathname.replace("/", "");
        return currentPath || "dashboard";
    });
    
    const toggleActivation = (key) => {
        setActivatedItem((prevActivatedItem) => (prevActivatedItem === key ? null : key));
    };
    
    const navigate = useNavigate();

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
        const sidebarLayout = document.getElementById('sidebar-layout');
        sidebarLayout.style.display = !collapsed ? 'none' : 'block';
    };

    // Set the visibility of the sidebar based on the isClick state
    useEffect(() => {
        // const sidebarLayout = document.getElementById('sidebar-layout');
        // if (sidebarLayout) {
        //     sidebarLayout.style.display = 'none';
        // }
    }, [windowWidth]);

    const userLogout = () => {
        const user = secureLocalStorage.getItem('authUser') ? JSON.parse(secureLocalStorage.getItem('authUser')) : null
        const payload = {
            refresh_token: user?.refresh_token,
        }
        api("POST", `auth/keycloak-logout`, payload).then((res) => {
            window.location.href = '/keycloak';
        })
    };



    function getItem(label, key, icon, children, type) {

        if(stockTake) {
            return {
                key,
                icon,
                children,
                label,
                type,
            };
        } else {
            if(['dashboard', 'stock-taking'].includes(key)) {
                return {
                    key,
                    icon,
                    children,
                    label,
                    type,
                };
            }
        }
    }

    const items = [
        getItem(<Link to={`/`}>Dashboard</Link>, "dashboard", <HomeOutlined style={{ fontSize: 20 }} />),
        getItem(<Link to={`/stock-takings`}>Stock Taking</Link>, "stock-taking", <CheckSquareOutlined style={{ fontSize: 20 }} />),
        roleAccess('final report') && stockTake ? 
            getItem(<Link to={`/final-reports/${stockTake?.id}`}>Final Report</Link>, "final-report", <FileText size={20} />) : null,
        roleAccess('stock list') && stockTake ?
            getItem(<Link to={`/stock-lists/${stockTake?.id}`}>Stock List</Link>, "stock-list", <ClipboardList size={20} />) : null,
        roleAccess('initial assets') || roleAccess('workflow') && stockTake ?
            getItem("Settings", "Authentication", <Settings size={20} />, [
                roleAccess('initial assets') ?
                    getItem(<Link to={`/setting/assets/${stockTake?.id}`}>Initial Assets</Link>, "asset") : null,
                roleAccess('workflow') ?
                    getItem(<Link to={`/setting/workflows/${stockTake?.id}`}>Workflow</Link>, "workflow") : null,
            ])
            : null,
    ];

    

    return (
        
        <React.Fragment>
            <StyleHeader id="antHeaderMain">
                <Row align="middle" gutter={[16, 24]}>
                    <Col span={1} lg={1}>
                        <a href="#" onClick={() => toggleCollapsed()}>
                            <span style={{ color: '#fff', fontSize:'30px', fontWeight:'500'}}><MenuOutlined /></span>
                        </a>
                    </Col>
                    <Col span={7} lg={7}>
                        <span style={{ cursor: 'pointer' }}
                         onClick={() => navigate(`/dashboard`)}>
                            <img
                                alt="StockIt"
                                src={BrandLogo}
                                height={40}
                                className="brand-sm-logo ant-mx-auto"
                            />
                         </span>
                    </Col>
                    <Col span={8} lg={8} style={{ textAlign: 'center' }}>
                        <span style={{ color: '#fff', fontSize:'18px', fontWeight:'500', cursor: 'pointer' }} 
                        onClick={() => navigate(`/stock-taking/preview/${stockTake.id}`)}>{stockTake?.name}</span>
                    </Col>
                    <Col span={8} lg={8} className='ant-ml-auto'>
                        <HeaderContainer className='ant-topbar-head list-unstyled'>
                            <li>
                                <Popover placement="bottomRight" content={
                                    <StyleFlagDropdown>
                                        <ul style={{ padding: "6px", listStyleType: "none" }} className='ant-pl-0 ant-mb-0'>
                                            <li>
                                                <Text style={{ fontSize: "14px" }}>{authUser?.name}</Text>
                                            </li>
                                            <li>
                                                <Text style={{ fontSize: "14px" }}>PT. Indonesia Epson Industry</Text>
                                            </li>
                                            <li>
                                                <Text style={{ fontSize: "14px" }}>
                                                    <AddButton onAdd={userLogout} title="Sign Out" />
                                                </Text>
                                            </li>
                                        </ul>
                                    </StyleFlagDropdown>
                                } trigger={["click"]}>
                                    <Badge offset={[-3, 5]}>
                                        <Link>
                                            <img src={profileImages} alt='' height={36} width={36} style={{ borderRadius: "50%", marginRight: 10 }}></img>
                                            <span style={{ color: '#fff', fontSize:'18px', fontWeight:'500'}}>{authUser?.name}</span>
                                        </Link>
                                    </Badge>
                                </Popover>
                            </li>
                        </HeaderContainer>
                    </Col>
                </Row>
            </StyleHeader>
            
            <StyleSider
                id="sidebar-layout"
                width={themecolor.components.Menu.verticalSidebar2Width}
                collapsed={collapsed}
                collapsedWidth="100"
                breakpoint="lg"
            >
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

export default HeaderLayout;