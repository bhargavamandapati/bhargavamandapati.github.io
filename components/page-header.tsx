export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-40 size-[30rem] rounded-full blur-[120px]"
        style={{ background: 'var(--glow-a)' }}
      />
      <div className="container-page relative py-16 md:py-20">
        <p className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
          <span aria-hidden className="h-px w-8 bg-accent/60" />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
