import React from 'react';

const AboutMe = ({ title, description, fadeClassName }) => (
  <div className={`aboutme ${fadeClassName()}`}>
    <div className={`header`}>{title}</div>
    <div className={`description`}>
      <p>{description}</p>
    </div>
  </div>
);

export default AboutMe;
