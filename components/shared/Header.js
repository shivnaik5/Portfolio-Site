import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getLinks } from '@/lib/content';

const links = getLinks();

const NavLink = ({ page, route, isActive, onNavigate }) => (
  <li>
    <Link href={route}>
      <a
        onClick={onNavigate}
        className={`inline-block rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors ${
          isActive ? 'bg-accent/10 text-accent' : 'text-foreground/80 hover:text-accent'
        }`}
      >
        {page}
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
        scrolled ? 'bg-background/90 shadow-sm backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/">
          <a className="font-display text-xl font-semibold text-foreground">
            shivang<span className="text-accent-warm">.</span>
          </a>
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
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
        <ul className="flex flex-col gap-1 border-t border-surface bg-surface px-4 py-4 md:hidden">
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
