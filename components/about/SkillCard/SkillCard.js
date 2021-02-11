import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import about from '@/public/resources/about.json';
import icons from '@/public/resources/icons.json';

const IconFace = ({ className }) => {
  return (
    <div className='skill-card-face front'>
      <i className={className} />
    </div>
  );
};

const DetailsFace = ({ tech, years }) => {
  return (
    <div className='skill-card-face back'>
      <div className='card-details'>
        <div>{tech}</div>
        <div className='years'>{years}</div>
      </div>
    </div>
  );
};

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
        <div className={`skill-card-container ${isHovering ? 'hovered' : ''}`}
          onMouseEnter={handleHover(true)}
          onMouseLeave={handleHover(false)}
          onClick={handleOnClick()}
        >
        
            {/* {isFlipped ? (
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
            )} */}
          <div className={`skill-card ${isFlipped ? 'is-flipped' : ''}`}>
            <IconFace className={ref.current} />
            <DetailsFace tech='C' years='13 years' />
          </div>
        </div>
      </Col>
  );
};

export default SkillCard;