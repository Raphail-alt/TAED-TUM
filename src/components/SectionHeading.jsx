export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-mute">{children}</p>}
    </div>
  )
}
