export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
        Loading...
      </p>
    </div>
  );
}
