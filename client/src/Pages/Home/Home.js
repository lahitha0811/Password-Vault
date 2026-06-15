import React from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import { useSelector } from "react-redux";

function Home() {
    const { name, isAuthenticated } = useSelector(state => state);

    return (
        <div className="home">
            <div className="home__wrapper">
                {!isAuthenticated ? (
                    <div className="home__content">
                        <h1>Welcome to <span className="name">Password Manager</span></h1>
                        <p>The best and secure way to save your passwords.</p>
                        <Link to="/signup" className="home-cta-btn">SignUp Now</Link>
                    </div>
                ) : (
                    <div className="home__content">
                        <h1>Welcome, <span className="name">{name}</span></h1>
                        <p>Your secure vault is ready for use.</p>
                        <Link to="/passwords" className="home-cta-btn">See your passwords</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;