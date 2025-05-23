import React from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Login from "./Components/Login/Login";
import Cadastro from "./Components/Login/Cadastro";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
