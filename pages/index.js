import React from 'react';
import BaseLayout from '@/components/layouts/BaseLayout';
import { Container, Row, Col, Button } from 'reactstrap';
import Typed from 'react-typed';

class Index extends React.Component {
  render() {
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
                <Button className='hero-resume btn'>My Resume</Button>
                </div>

              </Col>

              <Col md='4' className='hero-image'>
                {/* <div className='hero-section'> */}
                  {/* <img className='image' src='/images/space-md.png'/> */}
                  <img className='image fg sway' src='/images/home-fg-lg.png' />
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
                    <img className='image developer-image' src='/images/front-end-lg.png' />
                    <h4>Front End</h4>
                    <p>Building responsive web applications with user experience in mind</p>
                  </div>
                </Col>
                <Col md='4'>
                <div className='developer-experience'>
                  <img className='image developer-image' src='/images/backend-lg.png' /> 
                  <h4>Back End</h4>
                  <p>Developing scalable and reliable services and APIs</p>
                </div>
                </Col>
                <Col md='4'>
                <div className='developer-experience'>
                  <img className='image developer-image' src='/images/database-lg.png' />
                  <h4>Databases</h4>
                  <p>Implementing relational and NoSQL databases that are performant and resilient</p>
                </div>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 4, offset: 2 }}>
                  <div className='developer-experience'>
                    <img className='image developer-image' src='/images/solutions-architect-lg.png' />
                    <h4>Solutions Architect</h4>
                    <p>Designing service-oriented solutions and distributed systems</p>
                  </div>
                </Col>
                <Col md={{ size: 4, offset: 0 }}>
                <div className='developer-experience image'>
                  <img className='image developer-image' src='/images/generalist-lg.png' /> 
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
