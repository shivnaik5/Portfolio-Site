import React from 'react';
import BaseLayout from '@/components/layouts/BaseLayout';
import { Container, Row, Col } from 'reactstrap';
import Typed from 'react-typed';

class Index extends React.Component {
  render() {
    return (
      <BaseLayout className="cover">
        <div className="main-section">
          <Container>
            <Row>
              <Col md="6">
                <div className="hero-section">
                  <div className={`flipper`}>
                    <div className="back">
                      <img className="image" src="/images/section-1.png"/>
                      <div className="shadow-custom">
                        <div className="shadow-inner"> </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="6" className="hero-welcome-wrapper">
                <div className="hero-welcome-text">
                  <h1>
                    Hello there! I'm Shivang. Thanks for visiting!
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
                  className="self-typed"
                  cursorChar="|"
                  loop
                />
              </Col>
            </Row>
          </Container>
        </div>
      </BaseLayout>
    );
  }
}

export default Index;
