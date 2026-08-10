import Typography from '../Typography'

// Generic full-panel status illustration: art + heading + description,
// centered inside an optional white rounded/shadowed card (matches the
// Modal/Popover chrome convention: rounded-*/bg-surface-container-lowest/
// shadow-lg). Built for the 404 page but deliberately illustration-agnostic
// so 500/offline/forbidden/etc. pages can reuse it — just swap the
// `illustration`, `title`, `description` (and optional `action`) props.
export default function ErrorState({
  illustration,
  title,
  description,
  action,
  card = true,
  className = '',
  ...rest
}) {
  return (
    <div
      className={[
        'flex flex-1 flex-col items-center justify-center gap-1 px-6 py-12 text-center',
        card && 'rounded-2xl bg-surface-container-lowest shadow-lg',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {illustration && (
        <div className="mb-4 flex items-center justify-center" aria-hidden="true">
          {illustration}
        </div>
      )}

      {title && (
        <Typography variant="subtitle" as="h2" className="text-primary">
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body-md" className="max-w-sm text-outline">
          {description}
        </Typography>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
