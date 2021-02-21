import React from 'react';
import Link from 'next/link';

const Footer = () => (
  <footer className='footer'>
    <section className='site-links links'>
      <Link href='/about'>
        <a className='site-links-link'>About</a>
      </Link>
      <Link href='/resume'>
        <a className='site-links-link'>Resume</a>
      </Link>
    </section>
    <section className='site-links'>
      <Link href='https://www.github.com/shivnaik5' >
        <a target='_blank' className='site-links-icon'>
          <i className="devicon-github-original icon" />
        </a>
      </Link>
      <Link href='https://www.linkedin.com/in/shivang-naik'>
        <a target='_blank' className='site-links-icon'>
          <i className="devicon-linkedin-plain icon" />
        </a>
      </Link>
    </section>
    <section>
      &#169; 2021 Shivang Naik, All rights reserved.
    </section>
  </footer>
);

export default Footer;
