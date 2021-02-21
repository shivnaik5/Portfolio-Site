import React, { useState, useEffect, useRef } from 'react';
import { Col } from 'reactstrap';

const IconFace = ({ className }) => {
  return (
    <div className='skill-card-face front'>
      <i className={className} />
    </div>
  );
};

const DetailsFace = ({ tech, year }) => {
  const yearsExp = new Date().getFullYear() - year;
  const label = (yearsExp === 1) ? 'year' : 'years';

  return (
    <div className='skill-card-face back'>
      <div className='card-details'>
        <div>{tech}</div>
        <div className='years'>{`${yearsExp} ${label}`}</div>
      </div>
    </div>
  );
};

const SkillCard = ({ skill: { icon, tech, year }}) => {
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
  }

  return (
      <Col xs={4} md={2}>
        <div className={`skill-card-container ${isHovering ? 'hovered' : ''}`}
          onMouseEnter={handleHover(true)}
          onMouseLeave={handleHover(false)}
          onClick={handleOnClick()}
        >
          <div className={`skill-card ${isFlipped ? 'is-flipped' : ''}`}>
            <IconFace className={ref.current} />
            <DetailsFace tech={tech} year={year} years='13 years' />
          </div>
        </div>
      </Col>
  );
};

export default SkillCard;