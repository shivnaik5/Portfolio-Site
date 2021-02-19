import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Typed from 'react-typed';
import Link from 'next/link';
import BaseLayout from '@/components/layouts/BaseLayout';

class Index extends React.Component {
  render() {
    const handleResumeBtnOnClick = e => {
      e.preventDefault();
      window.open(
        'https://shivang-naik.s3.us-east-2.amazonaws.com/resume/Shivang+Naik+Resume.pdf',
        '_blank'
      );
    };

    return (
      <BaseLayout className='cover'>
        <div className='main-section'>
          <Container>
            <Row className='hero-container'>

            <Col md='8' className='hero-welcome-wrapper'>
                <div className='hero-welcome-headline'>
                  <h1>
                    Hello there! I'm Shivang.
                  </h1>
                </div>
                <Typed
                  strings={[
                    'Software Engineer',
                    'Full Stack Developer']}
                  typeSpeed={70}
                  backSpeed={70}
                  backDelay={4000}
                  loopCount={0}
                  showCursor
                  className='self-typed'
                  cursorChar='|'
                  loop
                />

                  <div className='hero-welcome-text'>
                    <h3>
                      Going above and beyond to create the best possible systems and applications that perform and get the job done
                    </h3>
                  </div>
   

                <div className='hero-resume'>
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

              <Col md='4' className='hero-image'>
                {/* <div className='hero-section'> */}
                  {/* <img className='image' src='/images/space-md.png'/> */}
                  <img className='image fg sway' src='/images/home-fg-lg-3.png' />
                  <img className='image bg' src='/images/home-bg-lg.png' />
                {/* </div> */}
              </Col>
              

            </Row>
            <div className='technical-experience'>
              <Row>
                <div className='tagline'>
                  <h1>An Experienced Developer</h1>
                </div>
                <div className='description'>
                  <p>From web services to networks to game development, having experience in a dearth of technologies is important for developers in the rapidly evolving world we live in today</p>
                </div>
              </Row>
              <Row>
                <Col md='4'>
                  <div className='developer-experience'>
                    <img className='image developer-image' src='/images/home-fe.png' />
                    <h4>Front End</h4>
                    <p>Building responsive web applications with user experience in mind</p>
                  </div>
                </Col>
                <Col md='4'>
                <div className='developer-experience'>
                  <img className='image developer-image' src='/images/home-be.png' /> 
                  <h4>Back End</h4>
                  <p>Developing scalable and reliable services and APIs</p>
                </div>
                </Col>
                <Col md='4'>
                <div className='developer-experience'>
                  <img className='image developer-image' src='/images/home-db.png' />
                  <h4>Databases</h4>
                  <p>Implementing relational and NoSQL databases that are performant and resilient</p>
                </div>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 4, offset: 2 }}>
                  <div className='developer-experience'>
                    <img className='image developer-image' src='/images/home-sa.png' />
                    <h4>Solutions Architect</h4>
                    <p>Designing service-oriented solutions and distributed systems</p>
                  </div>
                </Col>
                <Col md={{ size: 4, offset: 0 }}>
                <div className='developer-experience image'>
                  <img className='image developer-image' src='/images/home-gp.png' /> 
                  <h4>Generalist Programmer</h4>
                  <p>Knowlege of TCP/IP, Unity and Computer Vision and languages including Go, Rust and Python</p>
                </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </BaseLayout>
    );
  }
}

export default Index;
