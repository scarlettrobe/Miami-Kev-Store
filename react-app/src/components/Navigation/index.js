import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import nose112 from '../assets/nose112.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to="/" activeClassName="active">
          <img id='logo' src={nose112} alt="Nose" />
        </NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
