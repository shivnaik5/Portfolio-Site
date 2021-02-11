import React from 'react';
import { Row } from 'reactstrap';
import SkillCard from './SkillCard';

const SkillCards = ({ fadeClassName, icons }) => {
  return (
    <div className={`skills-icons ${fadeClassName()}`}>
      {icons.map((items, index) => (
        <Row className='skills-icons-row'>
          {items.map(icon => (
            <SkillCard icon={icon} />
          ))}
        </Row>
      ))}
    </div>
  );
};

export default SkillCards;