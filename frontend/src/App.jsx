import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public route */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                </Route>

                {/* Default route */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* Unknown route */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};

export default App;