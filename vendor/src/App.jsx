import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/*" element={<Sidebar />} />
      </Routes>

    </>
  );
};

export default App;
