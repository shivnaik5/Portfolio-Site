import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import SectionHeading from '@/components/shared/SectionHeading';
import AboutMe from '@/components/about/AboutMe';
import SkillDots from '@/components/about/SkillDots/SkillDots';
import { getAboutContent, getSkills } from '@/lib/content';

const About = () => {
  const about = getAboutContent();
  const skills = getSkills();

  return (
    <BaseLayout>
      <BasePage>
        <div className="animate-fadein">
          <div
            className={
              about.photoUrl
                ? 'flex flex-col gap-8 md:flex-row md:items-center md:justify-between'
                : ''
            }
          >
            <SectionHeading
              title={about.title}
              subtitle={about.subTitle}
              className={about.photoUrl ? 'mb-0 flex-1' : ''}
            />
            {about.photoUrl && (
              <div className="relative mx-auto h-48 w-48 flex-shrink-0 overflow-hidden rounded-full border-4 border-surface shadow-lg md:h-56 md:w-56">
                <img
                  src={about.photoUrl}
                  alt="Shivang Naik"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            {about.aboutMe.map((element, index) => (
              <AboutMe key={index} {...element} />
            ))}
          </div>

          <SkillDots skills={skills} />
        </div>
      </BasePage>
    </BaseLayout>
  );
};

export default About;
