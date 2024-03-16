import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header /> 
      <ToastContainer />
      <Container className="my-2">
        <Outlet />
      </Container> 
    </>
  )
}

export default App;