import React, { useState, useEffect } from 'react';
import '../styles/Header.css'; // Ensure to include styles for the header and oneko

const Header: React.FC = () => {
    const [theme, setTheme] = useState<'mocha' | 'latte'>('mocha');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'mocha' ? 'latte' : 'mocha'));
    };

    return (
        <header className="header">
            <h1 onClick={toggleTheme} style={{ cursor: 'pointer' }}>
                quiet🌸
            </h1>
            <nav>
                <a href="#about">About Me</a>&nbsp;
                <a href="#projects">Projects</a>&nbsp;
                <a href="#links">Links</a>&nbsp;
                <a href="#socials">Socials</a>&nbsp;
            </nav>
            <div id="oneko" aria-hidden="true"></div>
        </header>
    );
};

export default Header;
