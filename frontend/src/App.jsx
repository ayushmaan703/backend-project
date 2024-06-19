import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { currentUserInfo } from "./store/slices/authSlice.js";
import Layout from "./Layout.jsx";
import Homepage from "./pages/Homepage.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import Login from "./components/header/Login.jsx";
import Channel from "./pages/channel/Channel.jsx";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserInfo());
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path=""
            element={
              <AuthLayout authentication={false}>
                <Homepage />
              </AuthLayout>
            }
          />
          <Route
            path="/channel/:username"
            element={
              <AuthLayout authentication>
                <Channel />
              </AuthLayout>
            }
          ></Route>
        </Route>
        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <Login />
            </AuthLayout>
          }
        />
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: { borderRadius: "0", color: "red" },
          },
          success: {
            style: { borderRadius: "0", color: "green" },
          },
          duration: 2000,
        }}
      />
    </>
  );
}

export default App;
