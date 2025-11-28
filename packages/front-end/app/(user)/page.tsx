import { item } from '@basic-project/shared-types';
import { isEmpty } from 'lodash-es';
import { Suspense } from 'react';
import ProductListSection from './components/ProductListSection';
import ProductListSkeleton from './components/ProductListSection/ProductListSkeleton';
import SearchAndFilterSection from './components/SearchAndFilterSection';

interface Props {
  searchParams: Promise<{
    keyword?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const { keyword = '', category = '', page = '1' } = searchParams;
  const fixedCategory = !isEmpty(category) ? (category as item.Category) : null;
  const fixedPage = Number(page);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <SearchAndFilterSection
          initialKeyword={keyword}
          initialCategory={fixedCategory}
        />
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductListSection
            keyword={keyword}
            category={fixedCategory}
            page={fixedPage}
          />
        </Suspense>
      </div>
    </div>
  );
}
