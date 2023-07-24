import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarAndNavigate = (e, navigateTo) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => {
      window.location.href = navigateTo;
    }, 200);
  };

  // Don't render the sidebar if we're on the login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <div id='sidebarid'>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        {isOpen 
          ? <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: '#025af2' }} /> 
          : <FontAwesomeIcon icon={faCircleChevronRight} style={{ color: '#005af5' }} />
        }
      </button>
      
      {isOpen && (
        <div className='sidebar'>
          <ul className='sidebar-list'>
            <li><Link to="/" onClick={(e) => closeSidebarAndNavigate(e, "/")}>Order Management</Link></li>
            <li><Link to="/products" onClick={(e) => closeSidebarAndNavigate(e, "/products")}>View Products</Link></li>
            <li><Link to="/create-product" onClick={(e) => closeSidebarAndNavigate(e, "/create-product")}>Create Product</Link></li>
            <li><Link to="/create-blog-post" onClick={(e) => closeSidebarAndNavigate(e, "/create-blog-post")}>Blog Updates</Link></li>
            <li><a href="https://www.linkedin.com/in/scarlettrobe/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
