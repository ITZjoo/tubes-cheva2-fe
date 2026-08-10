import accessDeniedSrc from '../../../assets/illustrations/access-denied.svg'

// 403 art for ErrorState — the real illustration from the Figma "Error Page"
// (403) frame (Storyset "403 Error Forbidden", pana style,
// https://storyset.com), recolored to --color-primary and cropped to its
// content bounds. Licensed under the Freepik License (attribution required
// for non-premium use) — https://stories.freepiklabs.com.
export default function AccessDeniedIllustration({ className = 'w-56 h-44' }) {
  return <img src={accessDeniedSrc} alt="" className={`${className} object-contain`} />
}
