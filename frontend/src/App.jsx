import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { currentUserInfo } from "./store/slices/authSlice.js";
import Layout from "./Layout.jsx";
import Homepage from "./pages/Homepage.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Homepage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
