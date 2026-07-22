import React from 'react';

const TerminalCard = ({ title = 'whoami.ts', children }) => (
  <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
    <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
      <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
      <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
      <span className="ml-2 font-mono text-xs text-muted">{title}</span>
    </div>
    <div className="p-6 font-mono text-sm leading-relaxed text-foreground sm:text-base">
      {children}
    </div>
  </div>
);

export default TerminalCard;
