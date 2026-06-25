export default function Footer() {
  return (
    <footer className="text-center text-xs text-gray-400 py-6 px-4 border-t border-gray-100 bg-white/50">
      <p className="font-medium text-brand-dark mb-1">Shine Hygiene Solutions</p>
      <p>WHO Safety Compliant &middot; Professional Cleaning Services &middot; Harare, Zimbabwe</p>
      <p className="mt-1">
        <a href="mailto:sales@shineclean.co.zw" className="text-brand hover:underline">sales@shineclean.co.zw</a>
        {' | '}
        <a href="mailto:shinecleanzw@gmail.com" className="text-brand hover:underline">shinecleanzw@gmail.com</a>
      </p>
    </footer>
  )
}
