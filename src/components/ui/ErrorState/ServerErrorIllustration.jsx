import serverErrorSrc from '../../../assets/illustrations/server-error.svg'

// 500 art for ErrorState — the real illustration from the Figma "Error Page -
// 500" frame (Storyset "500 Internal Server Error", pana style,
// https://storyset.com), recolored to --color-primary and cropped to its
// content bounds. Licensed under the Freepik License (attribution required
// for non-premium use) — https://stories.freepiklabs.com.
export default function ServerErrorIllustration({ className = 'w-56 h-44' }) {
  return <img src={serverErrorSrc} alt="" className={`${className} object-contain`} />
}
