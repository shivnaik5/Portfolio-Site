import Hero from './Hero';
import RoleGrid from './RoleGrid';
import { getHomeContent } from '@/lib/content';

const Home = () => {
  const { technicalExperience } = getHomeContent();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-40 md:px-6">
      <Hero />
      <RoleGrid
        tagline={technicalExperience.tagline}
        description={technicalExperience.description}
        roles={technicalExperience.experience}
      />
    </div>
  );
};

export default Home;
