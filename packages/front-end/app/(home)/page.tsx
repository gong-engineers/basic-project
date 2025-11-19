'use client';

import { item } from '@basic-project/shared-types';
import { useEffect, useState } from 'react';
import ItemCard from './components/ItemCard';
import { fetchProducts, GetProductsParams } from './utils/product';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState<item.Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>();
  const [totalPages, setTotalPages] = useState(0);

  // TODO: 서버 패칭하도록 수정 필요
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);

        const params: GetProductsParams = { keyword, category, page, limit };
        const data = await fetchProducts(params);

        setProductList(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('리스트 조회 실패', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [keyword, category, page, limit]);

  // TODO: delete
  console.log(productList, totalPages);

  return (
    // TODO: 반응형에 맞춰 아이템 사이즈와 여백 조정 필요 & 다른 화면과 통일
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-wrap gap-4">
      {isLoading ? (
        <div className="flex justify-center items-center w-full py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          {productList.map((product) => (
            <ItemCard key={product.id} item={product} />
          ))}
        </>
      )}
    </div>
  );
}
