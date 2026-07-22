const AboutMe = ({ title, description }) => {
  const paragraphs = description.split('\n\n');

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-lg text-muted">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
