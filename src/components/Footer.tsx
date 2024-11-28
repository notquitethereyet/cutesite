import React from 'react';

const Footer: React.FC = () => {
    const date = new Date().getFullYear();
    return (
        <footer className="bg-mocha text-latte p-4 text-center">
            <p>read if cute!</p>
            <p>&copy; {date} My Portfolio</p>
        </footer>
    );
};

export default Footer;