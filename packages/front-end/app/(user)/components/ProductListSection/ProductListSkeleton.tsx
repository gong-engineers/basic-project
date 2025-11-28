import ItemCardSkeleton from './ItemCardSkeleton';

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ItemCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default ProductListSkeleton;
