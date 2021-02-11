import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import AboutMe from '@/components/about/AboutMe';
import SkillCards from '@/components/about/skillcard/SkillCards';

import about from '@/public/content/about.json';
import skills from '@/public/content/skills.json';

import { HOME_QUERY } from '@/components/queries/homeQuery';
import { gql, useQuery } from "@apollo/client";
import useContentQuery from '@/components/hooks/useContentQuery';

const test = () => {
  // console.log(HOME_QUERY);
  // const { loading, error, data } = useQuery(gql`
  // {
  //  homeCollection {
  //    items {
  //      headline
  //    }
  //  }
  // }`);
  // console.log(data);
  // console.log(error);
  // console.log(data.homeCollection.items[0]);
  const data = useContentQuery(HOME_QUERY);
  console.log(data);

  // console.log(process.env.CONTENTFUL_SPACE_ID);
};

const About = () => {
  useEffect(() => {
    return () => window.__isAboutPageLoaded = true;
  }, []);

  const handleFadeClassName = () => (
    (typeof window !== 'undefined' && window.__isAboutPageLoaded)
      ? ''
      : 'fadein'
  );

  const data = useContentQuery(HOME_QUERY);
  console.log(data);

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
          skills={skills}
          fadeClassName={handleFadeClassName}
        />
      </BasePage>
    </BaseLayout>
  );
};

export default About;
