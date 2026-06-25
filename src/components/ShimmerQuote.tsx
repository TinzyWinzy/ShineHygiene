export default function ShimmerQuote() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-brand px-5 py-3">
        <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
      </div>
      <div className="p-5 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
        <div className="flex justify-between pt-3 border-t-2 border-gray-200">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
