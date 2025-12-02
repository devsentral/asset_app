import { Navigate } from "react-router-dom";

import AuthSSO from "@/views/auth/keycloak";
import AuthRedirect from "@/views/auth/redirect";

// dashboard
import Dashboard from "@/views/dashboard";

// stock takings
import StockTaking from "@/views/stock-taking";
import StockTakingPreview from "@/views/stock-taking/preview";
import StockTakingInput from "@/views/stock-taking/input";
import StockTakingAudit from "@/views/stock-taking/audit";

// final report
import FinalReport from "@/views/final-report";

// stock list
import StockList from "@/views/stock-list";

// setting
import Asset from "@/views/setting/asset";
import Workflow from "@/views/setting/workflow";

const authProtectedRoutes = [

    // apps
    { path: "/", component: <Dashboard /> },
    { path: "/dashboard", component: <Dashboard /> },

    // stock takings
    { path: "/stock-takings", component: <StockTaking /> },
    { path: "/stock-taking/preview/:stockTakingId", component: <StockTakingPreview /> },
    { path: "/stock-taking/input/:stockTakingLocationId", component: <StockTakingInput /> },
    { path: "/stock-taking/audit/:stockTakingLocationId", component: <StockTakingAudit /> },

    // final report
    { path: "/final-reports/:stockTakingId", component: <FinalReport /> },

    // stock list
    { path: "/stock-lists/:stockTakingId", component: <StockList /> },

    // setting
    { path: "/setting/assets/:stockTakingId", component: <Asset /> },
    { path: "/setting/workflows/:stockTakingId", component: <Workflow /> },
];

const publicRoutes = [

    // Authentication
    { path: "/auth", component: <AuthRedirect /> },
    { path: "/keycloak", component: <AuthSSO /> },
]

export { publicRoutes, authProtectedRoutes };

