function ItemCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border p-3 bg-white flex flex-col w-full h-full">
      <div className="w-full aspect-5/3 bg-gray-200 rounded-lg mb-2" />

      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />

      <div className="h-4 bg-gray-200 rounded w-1/3 mt-3" />
    </div>
  );
}

export default ItemCardSkeleton;
