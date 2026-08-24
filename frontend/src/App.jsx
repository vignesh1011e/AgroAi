import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Community from "./pages/Community";
import MarketPlace from "./pages/MarketPlace";
import FarmerDirect from "./pages/FarmerDirect";
import Weather from "./pages/Weather";
import Profile from "./pages/Profile";
import Calculators from "./pages/Calculators";
import Activities from "./pages/Activities";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Authenticated Routes with Unified Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/farmer-direct" element={<FarmerDirect />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/community" element={<Community />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;