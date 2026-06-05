import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <nav className="box4">
        <h1>Three.js Assignments</h1>
        <Link to="/ASG-01">Assignment-01</Link>
        <Link to="/ASG-02">Assignment-02</Link>
      </nav>
    </div>
  );
}

export default Home;
