import React from 'react';
import { Row } from 'reactstrap';
import SkillCard from './SkillCard';

const SkillCards = ({ fadeClassName, icons, skills }) => {
  return (
    <div className={`skills-icons ${fadeClassName()}`}>
      {skills.map((items, index) => (
        <Row className='skills-icons-row'>
          {items.map(skill => (
            <SkillCard skill={skill} />
          ))}
        </Row>
      ))}
    </div>
  );
};

export default SkillCards;