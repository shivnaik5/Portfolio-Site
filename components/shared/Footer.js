import React from 'react';
import Link from 'next/link';

const Footer = () => (
  <footer className="border-t border-border bg-surface px-4 py-8 font-mono text-sm text-muted">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:justify-between">
      <nav className="flex gap-6">
        <Link href="/about">
          <a className="transition-colors hover:text-accent">about</a>
        </Link>
        <Link href="/resume">
          <a className="transition-colors hover:text-accent">resume</a>
        </Link>
      </nav>

      <div className="flex gap-4">
        <Link href="https://www.github.com/shivnaik5">
          <a target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
            <i className="devicon-github-original text-lg" />
          </a>
        </Link>
        <Link href="https://www.linkedin.com/in/shivang-naik">
          <a target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
            <i className="devicon-linkedin-plain text-lg" />
          </a>
        </Link>
      </div>

      <p className="text-xs">
        {'// built with Next.js + Tailwind, '}
        &copy; {new Date().getFullYear()} Shivang Naik
      </p>
    </div>
  </footer>
);

export default Footer;
