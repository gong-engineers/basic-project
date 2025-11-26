'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  currentPage: number;
  totalPages: number;
}

function Pagination(props: Props) {
  const { currentPage, totalPages } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  // 페이지가 1개 이하일 경우 페이지네이션 숨김
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        이전
      </Button>

      <span className="text-sm text-gray-700 px-2">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        다음
      </Button>
    </div>
  );
}

export default Pagination;
