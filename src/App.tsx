import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Projects from './components/Projects';
import Links from './components/Links';
import Socials from './components/Socials';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <About />
        <Projects />
        <Links />
        <Socials />
      </main>
      <Footer />
    </div>
  );
};

export default App;
