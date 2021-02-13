import React from 'react';
import { Row, Col } from 'reactstrap';
import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';

const About = () => (
  <BaseLayout>
    <BasePage className="about-page">
      <Row className="mt-5">
        <Col md="6">
          <div className="left-side">
            <h1 className={`title fadein`}>Hello, Welcome</h1>
            <h4 className={`subtitle fadein`}>To About Page</h4>
            <p className={`subsubTitle fadein`}>Feel free to read short description about me.</p>
          </div>
        </Col>
        <Col md="6">
          <div className={`fadein`}>
            <p>My name is Shivang and I am an experienced software engineer and freelance developer. </p>
            <p>
              I have 7 years of experience building software on a variety of platforms for a multitude of projects.
            </p>
          </div>
        </Col>
      </Row>
    </BasePage>
  </BaseLayout>
);

export default About;
