import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { LogList, LogDetail, NewLog } from "./pages/WorkoutLog";
import Splits from "./pages/Splits";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/log" element={<PrivateRoute><Layout><LogList /></Layout></PrivateRoute>} />
          <Route path="/log/new" element={<PrivateRoute><Layout><NewLog /></Layout></PrivateRoute>} />
          <Route path="/log/:id" element={<PrivateRoute><Layout><LogDetail /></Layout></PrivateRoute>} />
          <Route path="/splits" element={<PrivateRoute><Layout><Splits /></Layout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
