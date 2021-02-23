import React, { useState, useRef, useEffect } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem
} from 'reactstrap';
import Link from 'next/link';
import links from '@/public/content/links.json';

const NavLink = ({ page, route }) => (
  <NavItem className='port-navbar-item'>
    <Link href={route}><a className='nav-link port-navbar-link'>{page}</a></Link>
  </NavItem>
);

const NavBarBrand = () => (
  <Link href='/'>
    <a className='navbar-brand port-navbar-brand'>
      <img className='image' src='/images/mn3.png' />
    </a>
  </Link>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [headerClassName, setHeaderClassName] = useState('');

  const headerRef = useRef();
  headerRef.current = headerClassName;

  const isOpenRef = useRef();
  isOpenRef.current = isOpen;

  const shouldDisplay = () => (window.scrollY > 50) || isOpenRef.current;

  useEffect(() => {
    const handleScroll = () => setHeaderClassName(shouldDisplay() ? 'scrolled' : '');

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    setHeaderClassName(shouldDisplay() ? 'scrolled' : '');
  }, [isOpen]);

  return (
    <div>
        <Navbar className={`port-navbar port-default ${headerRef.current} absolute`} color='transparent' dark expand='md'>
          <NavBarBrand />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className='ml-auto' navbar>
              {links.filter(link => link.active).map(link => (
                <NavLink
                  route={link.route}
                  page={link.page}
                  key={link.page}
                />
              ))}
            </Nav>
          </Collapse>
        </Navbar>
    </div>
  );
}

export default Header;
