import { getHomeContent } from '@/lib/content';

const handleResumeClick = (e) => {
  e.preventDefault();
  window.open(
    'https://shivang-naik.s3.us-east-2.amazonaws.com/resume/Shivang+Naik+Resume.pdf',
    '_blank'
  );
};

const CTARow = ({ justify = 'justify-start' }) => (
  <div className={`mt-8 flex flex-wrap items-center gap-4 ${justify}`}>
    <button
      type="button"
      onClick={handleResumeClick}
      className="rounded-full border-0 bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
    >
      Download Resume
    </button>
    <a
      href="https://www.github.com/shivnaik5"
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
    >
      <i className="devicon-github-original text-xl" />
      GitHub
    </a>
    <a
      href="https://www.linkedin.com/in/shivang-naik"
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
    >
      <i className="devicon-linkedin-plain text-xl" />
      LinkedIn
    </a>
  </div>
);

const HeroText = ({ welcome, align = 'text-left', justify = 'justify-start' }) => (
  <div className={align}>
    <p className="text-sm font-medium uppercase tracking-wide text-muted">
      {welcome.titles.join(' · ')}
    </p>
    <h1 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
      {welcome.headline}
    </h1>
    <p className="mt-6 text-lg text-muted">{welcome.text}</p>
    <CTARow justify={justify} />
  </div>
);

const Hero = () => {
  const { welcome, photoUrl } = getHomeContent();

  if (photoUrl) {
    return (
      <div className="relative grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-accent-warm/20 blur-3xl" />
        <div className="relative">
          <HeroText welcome={welcome} />
        </div>
        <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border-4 border-surface shadow-lg md:h-72 md:w-72">
          <img src={photoUrl} alt="Shivang Naik" className="h-full w-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-accent-warm/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative">
        <HeroText welcome={welcome} align="text-center" justify="justify-center" />
      </div>
    </div>
  );
};

export default Hero;
