import BaseLayout from '@/components/layouts/BaseLayout';
import BasePage from '@/components/BasePage';
import SectionHeading from '@/components/shared/SectionHeading';
import Timeline from '@/components/resume/Timeline';
import { getResumeContent } from '@/lib/content';

const Resume = () => {
  const resume = getResumeContent();

  return (
    <BaseLayout>
      <BasePage>
        <SectionHeading title={resume.headline} subtitle={resume.description} />
        <Timeline entries={resume.details} />
      </BasePage>
    </BaseLayout>
  );
};

export default Resume;
