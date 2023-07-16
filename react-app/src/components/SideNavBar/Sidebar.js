import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // This function closes the sidebar and performs navigation
  const closeSidebarAndNavigate = (e, navigateTo) => {
    e.preventDefault();
    setIsOpen(false);
    // Use a timeout to allow the sidebar closing animation to complete
    // before redirecting. Adjust the delay as necessary.
    setTimeout(() => {
      window.location.href = navigateTo;
    }, 200);
  };

  return (
    <div>
<button className="sidebar-toggle-button" onClick={toggleSidebar}>
  {isOpen 
    ? <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: '#025af2' }} /> 
    : <FontAwesomeIcon icon={faCircleChevronRight} style={{ color: '#005af5' }} />
  }
</button>

      {isOpen && (
        <div className='sidebar'>
          <ul>
            <li>Order Management</li>
            <li><Link to="/products" onClick={(e) => closeSidebarAndNavigate(e, "/products")}>View Products</Link></li>
            <li><Link to="/create-product" onClick={(e) => closeSidebarAndNavigate(e, "/create-product")}>Create Product</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
