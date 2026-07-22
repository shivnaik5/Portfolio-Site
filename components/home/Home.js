import React from 'react';
import Typed from 'react-typed';
import TerminalCard from './TerminalCard';
import TechMarquee from './TechMarquee';
import home from '@/public/content/home.json';

const Home = () => {
  const handleResumeBtnOnClick = (e) => {
    e.preventDefault();
    window.open(
      'https://shivang-naik.s3.us-east-2.amazonaws.com/resume/Shivang+Naik+Resume.pdf',
      '_blank'
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-40 md:px-6">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full max-w-xl">
          <TerminalCard title="whoami.ts">
            <h1 className="text-code-comment">{`// ${home.welcome.headline}`}</h1>
            <p className="mt-4">
              <span className="text-code-keyword">const</span> engineer = {'{'}
            </p>
            <p className="pl-4">
              name: <span className="text-code-string">&quot;Shivang Naik&quot;</span>,
            </p>
            <p className="pl-4">
              role:{' '}
              <span className="text-code-string">
                <Typed
                  strings={home.welcome.titles}
                  typeSpeed={70}
                  backSpeed={70}
                  backDelay={4000}
                  loopCount={0}
                  showCursor
                  cursorChar="▋"
                  loop
                />
              </span>
              ,
            </p>
            <p>{'};'}</p>
            <p className="mt-4 text-code-comment">{`// ${home.welcome.text}`}</p>
          </TerminalCard>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleResumeBtnOnClick}
              className="rounded-md border-0 bg-accent px-6 py-2 font-mono text-sm font-bold text-background transition-opacity hover:opacity-90"
            >
              ./resume.pdf
            </button>
            <a
              href="https://www.github.com/shivnaik5"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-mono text-sm text-foreground transition-colors hover:text-accent"
            >
              <i className="devicon-github-original text-xl" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shivang-naik"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-mono text-sm text-foreground transition-colors hover:text-accent"
            >
              <i className="devicon-linkedin-plain text-xl" />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="relative hidden h-64 w-64 flex-shrink-0 items-center justify-center sm:flex lg:h-72 lg:w-72">
          <img
            className="absolute h-full w-full animate-sway opacity-40"
            src="/images/home/home-fg-lg-3.png"
            alt=""
          />
          <img
            className="absolute h-full w-full opacity-15"
            src="/images/home/home-bg-lg.png"
            alt=""
          />
        </div>
      </div>

      <div className="mt-28 text-center">
        <h2 className="font-mono text-2xl font-bold text-foreground sm:text-3xl">
          {home.technicalExperience.tagline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          {home.technicalExperience.description}
        </p>

        <div className="mt-12">
          <TechMarquee items={home.technicalExperience.experience} />
        </div>
      </div>
    </div>
  );
};

export default Home;
