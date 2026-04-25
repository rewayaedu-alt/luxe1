export default function DirectoryHeader({
  eyebrow,
  title,
  count,
  description,
  actions = null,
  children = null,
}) {
  return (
    <section className="space-y-4 border-b border-white/10 pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
          ) : null}
          <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-2">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
            {typeof count === "number" ? (
              <span className="text-sm text-zinc-500">{count} items</span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
