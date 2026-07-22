import TimelineEntry from './TimelineEntry';

const Timeline = ({ entries }) => (
  <ol className="relative border-l-2 border-surface pl-8">
    {entries.map((entry) => (
      <TimelineEntry key={entry.company} entry={entry} />
    ))}
  </ol>
);

export default Timeline;
