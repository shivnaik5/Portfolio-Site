import { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import about from '@/public/resources/about.json';
import devicons from '@/public/resources/devicons.json';

const AboutMe = ({ title, description, fadeClassName }) => (
  <div className={`aboutme ${fadeClassName()}`}>
    <div className={`title `}>
      <h4>{title}</h4>
    </div>
    <div className={`description`}>
      <p>{description}</p>
    </div>
  </div>
);

const SkillCard = ({ icon, colored }) => {
  return (
      <Col xs={4} md={2}>
        <div className="skills">
          <div className="icon">
            <i className={`devicon-${icon} ${colored ? 'colored' : ''}`} />
          </div>
        </div>
      </Col>
  );
}

const About = () => {
  useEffect(() => {
    return () => window.__isAboutPageLoaded = true;
  }, []);

  const handleFadeClassName = () => (
    (typeof window !== 'undefined' && window.__isAboutPageLoaded) ? '' : 'fadein'
  );

  return  (
    <BaseLayout>
      <BasePage className='about-page'>
        <Row className='mt-5'>
          <Col md='12'>
            <div className='left-side'>
              <h1 className={`title ${handleFadeClassName()}`}>{about.title}</h1>
              <h4 className={`subtitle ${handleFadeClassName()}`}>{about.subTitle}</h4>
            </div>
          </Col>
          <Col md='12'>
            <div className={`right-side`}>
              {about.aboutMe.map(element => (
                <AboutMe
                  {...element}
                  fadeClassName={handleFadeClassName}
                />
              ))}
            </div>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
          {devicons.map(icon => (
            <SkillCard icon={icon} colored={true} />
          ))}
        </Row>
      </BasePage>
    </BaseLayout>
  );
};

export default About;
