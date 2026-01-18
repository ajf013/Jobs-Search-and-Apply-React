import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <div className="splash-content">
                <img
                    src={process.env.PUBLIC_URL + '/logo192.png'}
                    alt="Jobs Portal Logo"
                    className="splash-logo"
                />
                <h1 className="splash-title">Jobs Portal</h1>
            </div>
        </div>
    );
};

export default SplashScreen;
