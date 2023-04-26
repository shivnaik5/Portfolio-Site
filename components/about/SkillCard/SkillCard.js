import React, { useState, useEffect, useRef } from 'react';
import { Col } from 'reactstrap';

const IconFace = ({ className }) => (
  <div className='skill-card-face front'>
    <i className={className} />
  </div>
);

const DetailsFace = ({ tech, years }) => {
  const label = (years === 1) ? 'year' : 'years';

  return (
    <div className='skill-card-face back'>
      <div className='card-details'>
        <div>{tech}</div>
        <div className='years'>{`${years} ${label}`}</div>
      </div>
    </div>
  );
};

const SkillCard = ({ skill: { icon, tech, year, years }}) => {
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
    <div className='skill-card-container'>
      <div className={`skill-card ${isHovering ? 'hovered' : ''}`}
        onMouseEnter={handleHover(true)}
        onMouseLeave={handleHover(false)}
        onClick={handleOnClick()}
      >
        <div className={`skill-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          <IconFace className={ref.current} />
          <DetailsFace tech={tech} year={year} years={years} />
        </div>
      </div>
    </div>
  );
};

export default SkillCard;