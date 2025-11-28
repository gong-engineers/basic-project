function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="animate-pulse flex flex-col md:flex-row gap-6 divide-gray-300">
        <div className="bg-gray-200 aspect-5/3 rounded-xl w-1/2 max-w-xl" />

        <hr className="w-full md:hidden" />

        <div className="flex flex-col w-1/2 max-w-xl">
          <div className="h-6 bg-gray-200 rounded w-3/5 mb-5" />
          <div className="h-5 bg-gray-200 rounded w-2/5 mb-5" />
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-3" />
          <div className="h-5 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
