import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import about from '@/public/resources/about.json';
import icons from '@/public/resources/icons.json';

import SC from '@/components/about/SkillCard/SkillCards';

const AboutMe = ({ title, description, fadeClassName }) => (
  <div className={`aboutme ${fadeClassName()}`}>
    <div className={`header`}>{title}</div>
    <div className={`description`}>
      <p>{description}</p>
    </div>
  </div>
);

const SkillCardRow = ({ fadeClassName, items }) => (
  <Row className='row'>
    {items.map(icon => (
      <SkillCard key={`skillcard - ${icon}`} icon={icon} colored={true} />
    ))}
  </Row>
);

const SkillCards = ({ fadeClassName }) => (
  <div className={`skills-icons ${fadeClassName()}`}>
    {icons.map((items, index) => (
      <SkillCardRow key={`skillcardrow - ${index}`} fadeClassName={fadeClassName} items={items} />
    ))}
  </div>
);

const SkillCard = ({ icon }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [cardClassName, setCardClassName] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const ref = useRef();
  ref.current = cardClassName;

  useEffect(() => {
    let className = `icon devicon-${icon}`;
    setCardClassName(isHovering ? `${className} colored` : className);
  }, [isHovering]);

  const handleHover = isEntering => () => setIsHovering(isEntering);

  const handleOnClick = () => () => {
    setIsFlipped(!isFlipped);
    console.log(isFlipped)
  }

  return (
      <Col xs={4} md={2}>
        <div className="skills"
          onMouseEnter={handleHover(true)}
          onMouseLeave={handleHover(false)}
          onClick={handleOnClick()}
        >
        
            {isFlipped ? (
              <div className='skill-container flipped'>
                <div className='skill-details'>
                  <div className='tech'>C</div>
                  <div className='years-exp'>13 years</div>
                </div>
              </div>
            ) : (
            <div className='skill-container icon'>
              <i className={ref.current} />
              </div>
            )}
  
        </div>
      </Col>
  );
};

const FlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  // const ref = useRef();
  // ref.current = cardClassName;



  const handleOnClick = () => () => {
    console.log('click click clik')
    setIsFlipped(!isFlipped);
  };

  return (
    <div onClick={handleOnClick()} className='skc-skill-container'>
      <div className={`skc-skill-card ${isFlipped ? 'is-flipped' : ''}`}>
        <div className='skc-skill-card-face front' />
        <div className='skc-skill-card-face back' />
      </div>
    </div>
  );
};

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
          <Col md='12' className={`about-image ${handleFadeClassName()}`}>
            <img className='image bg' src='/images/about-page-bg2.png'/>
            {/* <img className='image fg' src='/images/about-page-fg-md.png'/> */}
          </Col>
          {/* <div className='about-image' /> */}
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
        {/* <SkillCards fadeClassName={handleFadeClassName} />
        <FlipCard></FlipCard> */}
        {/* <Row>
        <SC icon='c-plain' />
        <SC icon='c-plain' />
        </Row> */}
        <SC icons={icons} fadeClassName={handleFadeClassName} />
      </BasePage>
    </BaseLayout>
  );
};

export default About;
