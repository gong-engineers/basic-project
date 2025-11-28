import { item } from '@basic-project/shared-types';
import { isEmpty } from 'lodash-es';
import { fetchProducts } from '../../utils/product';
import ItemCard from './ItemCard';
import Pagination from './Pagination';

interface Props {
  keyword: string;
  category: item.Category | null;
  page: number;
}

async function ProductListSection(props: Props) {
  const { keyword, category, page } = props;

  const data = await fetchProducts({
    keyword,
    category: category ?? undefined,
    page,
  });

  const { items, totalPages } = data;

  if (isEmpty(data.items)) {
    return (
      <div className="flex items-center justify-center text-gray-700 py-20 min-h-100">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <ItemCard key={product.id} item={product} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

export default ProductListSection;
