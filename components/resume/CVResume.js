import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const CVResumeContent = (props) => (
  <div className='cvresume-item'>
    <h5 className={props.title ? 'cvresume-title' : 'cvresume-no-title'}>
      {props.title}
    </h5>
    <p>
      <em>{props.location}</em>
    </p>
    <p>
      <em>{props.date}</em>
    </p>
    <ul>
      {props.content.map((value, index) => (
        <li key={index}>{value}</li>
      ))}
    </ul>
  </div>
);

const CVResume = () => (
  <Container fluid className='cvresume-section'>
    <Container>
      <Row className='cvresume'>
        <Col md={12} className='cvresume-left'>
          <h3 className='cvresume-title'>Relevant Experience</h3>
          <CVResumeContent
            title='Convene - Software Engineer'
            location='New York, NY'
            date='October 2018 - October 2020'
            content={[
              'Architected service-oriented backend utilizing AWS, Salesforce and third-party APIs for a consumer facing application considered the most vital project at Convene',
              'Implemented services in NodeJS that range from onboarding new users, emailing members for various marketing campaigns and payment automation',
              'Developed REST API used by web and mobile applications to provide customers with a gateway into services offered by Convene'
            ]}
          />
          <CVResumeContent
            title='Clockwork Labs - Contractor'
            location='Remote'
            date='August 2020 - September 2020'
            content={[
              'Wrote Unity script to overlay mini-map icons at various points of interest',
              'Updated player resource gathering interactions to include inventory equipment'
            ]}
          />
          <CVResumeContent
            title='Paperspace - Software Engineer'
            location='New York, NY'
            date='June 2015 - October 2018'
            content={[
              'Developed and maintained a React web application that served as the point of entry for users to access core product offerings',
              'Maintained a public API to allow developers to integrate Paperspace products into their own workflows or applications',
              'Implemented a server application in Go to allow users to manage Docker images',
              'Ensured servers are functional and performing as required using configuration management tools such as SaltStack and building a logging solution in-house',
              'Spearheaded the design and development of a Windows software agent to capture and encode H.264 video data from server using the NVIDIA Capture API',
              'Utilized Opus codec to encode and decode audio data for playback in client application for an enhanced end-user experience',
              'Streamed captured audio/video data to a client application and processed mouse and keyboard input events through the development of a WebSocket server written in C#'
            ]}
          />
          <CVResumeContent
            title='Bauer Controls - Systems Programmer'
            location='Plymouth, MI'
            date='August 2020 - September 2020'
            content={[
              'Developed application for General Motors to digitize and maintain test procedure records used in electric battery assembly ',
              'Implemented a testing application for field engineers allowing them to efficiently collect and analyze data'
            ]}
          />
        </Col>
        <Col md={12} className='cvresume-left'>
          <h3 className='cvresume-title'>Education</h3>
          <CVResumeContent
            title='University of Michigan'
            location='Ann Arbor, MI'
            date='May 2014'
            content={[
              'B.S. Computer Engineering',
              'B.S. Aerospace Engineering'
            ]}
          />
        </Col>
      </Row>
    </Container>
  </Container>
);

export default CVResume;