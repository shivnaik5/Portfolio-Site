import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem
} from 'reactstrap';
import Link from 'next/link';
import links from '@/public/resources/links.json';

const NavLink = ({ page, route }) => (
  <NavItem className='port-navbar-item'>
    <Link href={route}><a className='nav-link port-navbar-link'>{page}</a></Link>
  </NavItem>
);

const NavBarBrand = () => (
  <Link href='/'>
    <a className='navbar-brand port-navbar-brand'>Shivang Naik</a>
  </Link>
);

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className='port-navbar port-default absolute' color='transparent' dark expand='md'>
        <NavBarBrand />
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='mr-auto' navbar>
            {links.map(element => (
              <NavLink
                route={element.route}
                page={element.page}
                key={element.page}
              />
            ))}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
