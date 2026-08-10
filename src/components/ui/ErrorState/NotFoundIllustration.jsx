import notFoundSrc from '../../../assets/illustrations/not-found.svg'

// 404 art for ErrorState — the real illustration from the Figma "Error Page -
// 404" frame (Storyset "404 error with people holding the numbers", pana
// style, https://storyset.com), recolored to --color-primary and cropped to
// its content bounds. Licensed under the Freepik License (attribution
// required for non-premium use) — https://stories.freepiklabs.com.
export default function NotFoundIllustration({ className = 'w-56 h-44' }) {
  return <img src={notFoundSrc} alt="" className={`${className} object-contain`} />
}
