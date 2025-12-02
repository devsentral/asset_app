import React from 'react'
import withRouter from '../common/withRouter';
import { useTheme } from '../common/ThemeContext';
import { darkthemecolors, themecolor } from '../config';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';

const NonAuthLayout = ({ children }) => {

  const { theme } = useTheme();

  return (
    <React.Fragment>
      <ThemeProvider theme={theme === 'dark' ? darkthemecolors : themecolor}>
        <ConfigProvider theme={theme === 'dark' ? darkthemecolors : themecolor}>
          {children}
        </ConfigProvider>
      </ThemeProvider> 
    </React.Fragment>
  )
}

export default withRouter(NonAuthLayout);