import React from "react";
import "antd/dist/reset.css";
import'./assets/scss/App.scss';

//imoprt Route
import RoutesComponents from "./routes/index";
import { ThemeProvider as CustomThemeProvider } from "./common/ThemeContext";

const App = () => {
    return (
        <CustomThemeProvider>
            <RoutesComponents />
        </CustomThemeProvider>
    )
}

export default App;
