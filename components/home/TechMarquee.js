import React from 'react';

const TechMarquee = ({ items }) => (
  <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
    <div className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused]">
      {[...items, ...items].map((item, index) => (
        <div key={`${item.role}-${index}`} className="flex flex-shrink-0 items-center gap-3">
          <img src={`/images/home/${item.image}`} alt="" className="h-10 w-10 object-contain" />
          <span className="whitespace-nowrap font-mono text-sm text-foreground">{item.role}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TechMarquee;
