import React from 'react';
import withRouter from '@/common/withRouter';
import { ConfigProvider, Layout } from 'antd';
import FooterLayout from './Footer';
import { ThemeProvider, styled } from 'styled-components';
import { themecolor, darkthemecolors } from '@/config';
import { useTheme }  from '@/common/ThemeContext';

const { Content } = Layout;

// Define the StyleLayout styled component outside the functional component
const StyleLayout = styled(Layout)`
    margin-left: ${themecolor.components.Menu.verticalSidebarWidth}px;
    position: relative;
    // padding: calc(${themecolor.token.controlHeight}px * 2) 24px 0;
    padding: 70px 0;

    .ant-breadcrumb {
        ol {
            justify-content: end;
        }
    }

    @media screen and (max-width: 768px) {
        margin-left: 0;
    }
`;

const LayoutComponents = ({ children }) => {

    const { theme } = useTheme();

    return (
        <React.Fragment>
            <ThemeProvider theme={theme === 'dark' ? darkthemecolors : themecolor}>
                <ConfigProvider theme={theme === 'dark' ? darkthemecolors : themecolor}>
                    <Layout style={{ minHeight: '95vh' }}>
                        <StyleLayout id='antLayoutContent'>
                            <Content>
                                {children}
                            </Content>
                        </StyleLayout>
                        <FooterLayout />
                    </Layout>
                </ConfigProvider>
            </ThemeProvider>
        </React.Fragment>
    );
};

export default withRouter(LayoutComponents);