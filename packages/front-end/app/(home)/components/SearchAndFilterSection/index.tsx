'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { convertCategory } from '@/utils/item.util';
import { item } from '@basic-project/shared-types';
import { debounce } from 'lodash-es';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  initialKeyword: string;
  initialCategory: item.Category | null;
}

function SearchAndFilterSection(props: Props) {
  const { initialKeyword, initialCategory } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(initialKeyword);

  const updateQuery = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value.trim() !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // 검색 조건이 바뀌면 항상 1 페이지로 리셋
      if (key === 'keyword' || key === 'category') {
        if (value) {
          params.set('page', '1');
        } else {
          params.delete('page');
        }
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        updateQuery('keyword', value);
      }, 300),
    [updateQuery],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setKeyword(value);
    debouncedSearch(value);
  };

  const clearKeyword = () => {
    setKeyword('');
    updateQuery('keyword', null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 검색창 */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={handleKeywordChange}
          className="w-full pl-10 pr-10 sm:pr-12"
        />
        {keyword && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearKeyword}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-transparent"
          >
            <X />
          </Button>
        )}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        {[
          '전체',
          ...item.Categories.map(
            (categoryItem) => convertCategory(categoryItem).label,
          ),
        ].map((label, index) => {
          const isAll = index === 0;
          const categoryItem = isAll ? null : item.Categories[index - 1];
          const isSelected = isAll
            ? !initialCategory
            : initialCategory === categoryItem;

          const baseClass = 'rounded text-gray-800';
          const selectedClass =
            'bg-gray-300 text-gray-900 font-bold hover:bg-gray-300';
          const unselectedClass = 'bg-white hover:bg-gray-200';

          return (
            <Button
              key={label}
              size="sm"
              variant="ghost"
              className={`${baseClass} ${isSelected ? selectedClass : unselectedClass}`}
              onClick={() => {
                const nextCategory = isSelected ? null : categoryItem;
                updateQuery('category', nextCategory);
              }}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default SearchAndFilterSection;
