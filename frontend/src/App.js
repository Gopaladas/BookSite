import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import BookFinder from "./components/MainPage/BookFinder";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookFinder />} />
      </Routes>
    </div>
  );
};

export default App;
