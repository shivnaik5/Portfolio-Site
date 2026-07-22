import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import links from '@/public/content/links.json';

const NavLink = ({ page, route, isActive, onNavigate }) => (
  <li>
    <Link href={route}>
      <a
        onClick={onNavigate}
        className={`block py-2 font-mono text-sm transition-colors hover:text-accent ${
          isActive ? 'text-accent' : 'text-foreground'
        }`}
      >
        <span className="text-muted">$</span> {page.toLowerCase()}
      </a>
    </Link>
  </li>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, events } = useRouter();

  const isOpenRef = useRef();
  isOpenRef.current = isOpen;

  const shouldDisplayScrolled = () => window.scrollY > 50 || isOpenRef.current;

  useEffect(() => {
    const handleScroll = () => setScrolled(shouldDisplayScrolled());
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setScrolled(shouldDisplayScrolled());
  }, [isOpen]);

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    events.on('routeChangeComplete', closeMenu);
    return () => events.off('routeChangeComplete', closeMenu);
  }, [events]);

  const navLinks = links.filter((link) => link.active);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'bg-surface/80 shadow-lg backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/">
          <a className="flex items-center font-mono text-lg font-bold text-foreground">
            <span className="text-accent">&gt;</span>&nbsp;shivang.dev
            <span className="ml-1 inline-block h-5 w-2 animate-blink bg-accent" />
          </a>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.page}
              page={link.page}
              route={link.route}
              isActive={pathname === link.route}
            />
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex flex-col gap-1.5 border-0 bg-transparent p-2 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform ${
              isOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-opacity ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform ${
              isOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <ul className="flex flex-col gap-1 border-t border-border bg-surface px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.page}
              page={link.page}
              route={link.route}
              isActive={pathname === link.route}
              onNavigate={() => setIsOpen(false)}
            />
          ))}
        </ul>
      )}
    </header>
  );
};

export default Header;
