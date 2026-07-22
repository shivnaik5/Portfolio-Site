import SkillChip from './SkillChip';

const SkillDots = ({ skills }) => (
  <div className="mt-8 flex flex-col gap-4">
    {skills.map((group, groupIndex) => (
      <div key={groupIndex} className="flex flex-wrap gap-3">
        {group.map((skill) => (
          <SkillChip key={skill.tech} skill={skill} />
        ))}
      </div>
    ))}
  </div>
);

export default SkillDots;
