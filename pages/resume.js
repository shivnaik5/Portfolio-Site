import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import resume from '@/public/resources/resume.json';


const ResumeCard = ({ company, title, date, location, content, position }) => (
  <VerticalTimeline className='timeline'>
    <VerticalTimelineElement position={position || 'right'}>
      <div className='item'>
        <div className="card-text">
          <span className='company'>{company}</span>
          <span className='date'>{date}</span>
        </div>
        <div className="card-text">
          <span className='title'>{title}</span>
          <span className='location'>{location}</span>
        </div>
        <ul className='details'>
          {content.map((item, index) => (
            <li key={`${company} - ${index}`}>{item}</li>
          ))}
        </ul>
      </div>
    </VerticalTimelineElement>
  </VerticalTimeline>
);

const Resume = () => (
  <BaseLayout>
    <BasePage className='resume-page'>
      <Row className='mt-5'>
        <Col md='12'>
          <div>
            <h1>My Work Experience</h1>
            <p>Here's a quick look at my work experience through the years</p>
          </div>
      {resume.map((item, index) => (
        <ResumeCard
          key={item.company}
          position={index % 2 === 0 ? 'left' : 'right'}
          { ...item }
        />
      ))}
      </Col>
      </Row>
    </BasePage>
  </BaseLayout>
);

export default Resume;
