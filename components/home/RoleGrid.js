const RoleGrid = ({ tagline, description, roles }) => (
  <div className="mt-28 text-center">
    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{tagline}</h2>
    <p className="mx-auto mt-4 max-w-2xl text-muted">{description}</p>
    <div className="mt-10 flex flex-wrap justify-center gap-3">
      {roles.map((role) => (
        <span
          key={role.role}
          className="inline-flex items-center gap-2 rounded-full border border-surface bg-surface/60 px-5 py-2 text-sm font-medium text-foreground"
        >
          <span className="h-2 w-2 rounded-full bg-accent-warm" />
          {role.role}
        </span>
      ))}
    </div>
  </div>
);

export default RoleGrid;
