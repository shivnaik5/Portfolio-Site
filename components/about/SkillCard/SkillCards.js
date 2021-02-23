import React from 'react';
import { Row } from 'reactstrap';
import SkillCard from './SkillCard';

const SkillCards = ({ fadeClassName, skills }) => {
  return (
    <div className={`skills-icons ${fadeClassName()}`}>
      {skills.map((items, index) => (
        <Row key={`skills-${index}`} className='skills-icons-row'>
          {items.map((skill, idx) => (
            <SkillCard key={`skill-${idx}`} skill={skill} />
          ))}
        </Row>
      ))}
    </div>
  );
};

export default SkillCards;