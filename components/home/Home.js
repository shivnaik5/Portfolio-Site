import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import Typed from 'react-typed';
import Link from 'next/link';
import BasePage from '@/components/BasePage';
import home from '@/public/content/home.json';

const Home = () => {
  const handleResumeBtnOnClick = e => {
    e.preventDefault();
    window.open(
      'https://shivang-naik.s3.us-east-2.amazonaws.com/resume/Shivang+Naik+Resume.pdf',
      '_blank'
    );
  };
  
  return (
    <BasePage className='home-page'>
      <Row className='home-container'>
        <Col md='8' className='home-welcome-wrapper'>
          <div className='home-welcome-headline'>
            <h1>
              {home.welcome.headline}
            </h1>
          </div>
          <Typed
            strings={home.welcome.titles}
            typeSpeed={70}
            backSpeed={70}
            backDelay={4000}
            loopCount={0}
            showCursor
            className='self-typed'
            cursorChar='|'
            loop
          />
          <div className='home-welcome-text'>
            <h3>{home.welcome.text}</h3>
          </div>
          <div className='home-resume'>
            <Button
              className='btn'
              onClick={handleResumeBtnOnClick}
            >
              <span className='text'>My Resume</span>
            </Button>
            <Link href='https://www.github.com/shivnaik5'>
              <a target='_blank' className='profile-icons'>
                <i className="devicon-github-original icon" />
                <span className='text'>GitHub</span>
              </a>
            </Link>
            <Link href='https://www.linkedin.com/in/shivang-naik'>
              <a target='_blank' className='profile-icons'>
                <i className="devicon-linkedin-plain icon" />
                <span className='text'>LinkedIn</span>
              </a>
            </Link>
          </div>
        </Col>
        <Col md='4' className='home-image'>
          <img className='image fg sway' src='/images/home/home-fg-lg-3.png' />
          <img className='image bg' src='/images/home/home-bg-lg.png' />
        </Col>
      </Row>
      <div className='technical-experience'>
        <div className='tagline'>
          <h1>{home.technicalExperience.tagline}</h1>
        </div>
        <div className='description'>
          <p>{home.technicalExperience.description}</p>
        </div>
        <Row>
          {home.technicalExperience.experience[0].map(item => (
            <Col md='4'>
              <div className='developer-experience'>
                <img className='image developer-image' src={`/images/home/${item.image}`} /> 
                <h4>{item.role}</h4>
                <p>{item.description}</p>
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          {home.technicalExperience.experience[1].map(item => (
            <Col md={{ size: 4, offset: item.offset }}>
              <div className='developer-experience'>
                <img className='image developer-image' src={`/images/home/${item.image}`} /> 
                <h4>{item.role}</h4>
                <p>{item.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </BasePage>
  );
};

export default Home;
