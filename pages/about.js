import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import AboutMe from '@/components/about/AboutMe';
import SkillCards from '@/components/about/SkillCard/SkillCards';

import about from '@/public/resources/about.json';
import icons from '@/public/resources/icons.json';
import skills from '@/public/resources/skills.json';

const About = () => {
  useEffect(() => {
    return () => window.__isAboutPageLoaded = true;
  }, []);

  const handleFadeClassName = () => (
    (typeof window !== 'undefined' && window.__isAboutPageLoaded)
      ? ''
      : 'fadein'
  );

  return  (
    <BaseLayout>
      <BasePage className='about-page'>
        <Row className='mt-5'>
          <Col md='12' className={`about-image ${handleFadeClassName()}`}>
            <img className='image bg' src='/images/about-page-bg2.png'/>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col md='12'>
            <div className='headline'>
              <h1 className={`title ${handleFadeClassName()}`}>{about.title}</h1>
              <p className={`subtitle ${handleFadeClassName()}`}>{about.subTitle}</p>
            </div>
          </Col>
          <Col md='12'>
            <div className={`details`}>
              {about.aboutMe.map((element, index) => (
                <AboutMe
                  key={`aboutme - ${index}`}
                  {...element}
                  fadeClassName={handleFadeClassName}
                />
              ))}
            </div>
          </Col>
        </Row>
        <SkillCards
          icons={icons}
          skills={skills}
          fadeClassName={handleFadeClassName}
        />
      </BasePage>
    </BaseLayout>
  );
};

export default About;
