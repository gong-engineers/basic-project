'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { item } from '@basic-project/shared-types';
import { debounce, isEmpty } from 'lodash-es';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ItemCard from './components/ItemCard';
import { fetchProducts, GetProductsParams } from './utils/product';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState<item.Product[]>([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  // TODO: category 추가
  const [totalPages, setTotalPages] = useState(0);

  // TODO: 서버 패칭하도록 수정 필요
  useEffect(() => {
    const loadProducts = debounce(async (keyword: string, page: number) => {
      try {
        setIsLoading(true);

        // TODO: category 추가
        const params: GetProductsParams = { keyword, page };
        const data = await fetchProducts(params);

        setProductList(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('리스트 조회 실패', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    loadProducts(keyword, page);

    return () => {
      loadProducts.cancel();
    };
  }, [keyword, page]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 검색창 */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-10 sm:pr-12"
          />
          {keyword && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setKeyword('');
                setPage(1);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-transparent"
            >
              <X />
            </Button>
          )}
        </div>

        {/* 상품 리스트 */}
        {isLoading ? (
          <div className="flex justify-center items-center w-full py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            {!isEmpty(productList) ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productList.map((product) => (
                    <ItemCard key={product.id} item={product} />
                  ))}
                </div>

                {/* 페이지네이션 */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    이전
                  </Button>

                  <span className="text-sm text-gray-700 px-2">
                    {page} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    다음
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">검색 결과가 없습니다.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
