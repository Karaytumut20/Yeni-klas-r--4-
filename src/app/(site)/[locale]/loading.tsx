export default function Loading() {
  return (
    <div className="max-w-md min-h-screen p-4 pb-24 mx-auto space-y-4 bg-gray-50">
      <div className="w-full h-16 mb-6 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex gap-3 overflow-hidden">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-shrink-0 w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="flex h-32 gap-4 p-3 bg-white border border-gray-100 rounded-2xl animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 py-2 space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}