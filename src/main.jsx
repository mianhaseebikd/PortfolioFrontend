import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Header from './components/header.jsx';
import Process from './components/process.jsx';
import About from './components/about.jsx';
import Timeline from './components/timeline.jsx';
import Skill from './components/skill.jsx';
import Portfolio from './components/portfolio.jsx';
import Services from './components/services.jsx';
import Testimonial from './components/testimonial.jsx';
import CompaniesSection from './components/companies.jsx';
import Blog from './components/blog.jsx';
import Newsletter from './components/newsletter.jsx';
import Contact from './components/contact.jsx';
import Footer from './components/footer.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Process />
    <About />
    <Timeline />
    <Portfolio />
    <Skill />
    <Services />
    <Testimonial />
    <CompaniesSection />
    <Blog />
    <Newsletter />
    <Contact />
    <Footer />
  </StrictMode>
);
