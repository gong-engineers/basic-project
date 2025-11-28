'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { client } from '@/lib/api';
import { item } from '@basic-project/shared-types';
import { ChevronLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<null | item.Product[]>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    (async () => {
      try {
        const response = await client.get<
          null,
          {
            items: item.Product[];
            limit: number;
            page: number;
            total: number;
            totalPages: number;
          }
        >(`${API_URL}/api/v1/products`);
        setProducts(response.items);
      } catch {}
    })();
  }, [mounted]);

  async function handleDeleteProduct(productId: number) {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await client.delete(`${API_URL}/api/v1/products/${productId}`);

      setProducts((prevProducts) =>
        prevProducts
          ? prevProducts.filter((product) => product.id !== productId)
          : null,
      );
    } catch {
      alert('상품 삭제에 실패했습니다.');
    }
  }

  if (!mounted || !products) {
    return <></>;
  }

  return (
    <>
      <div className="border-b border-slate-700 bg-slate-900 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button
                variant={'ghost'}
                size={'icon'}
                className="text-slate-400 hover:text-slate-900"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">상품 관리</h1>
              <p className="text-slate-400 mt-1">전체 상품 정보 관리</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-linear-to-br from-slate-950 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Table>
            <TableHeader className="bg-slate-900 border-b border-slate-700">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-slate-300">제목</TableHead>
                <TableHead className="text-slate-300">카테고리</TableHead>
                <TableHead className="text-slate-300">가격</TableHead>
                <TableHead className="text-slate-300">할인가격</TableHead>
                <TableHead className="text-slate-300">할인시작일</TableHead>
                <TableHead className="text-slate-300">할인종료일</TableHead>
                <TableHead className="text-slate-300 text-right">
                  작업
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <TableCell className="text-white font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.price}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.discountPrice}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.discountStartDate
                      ? new Date(product.discountStartDate)
                          .toISOString()
                          .split('T')[0]
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.discountEndDate
                      ? new Date(product.discountEndDate)
                          .toISOString()
                          .split('T')[0]
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => {
                          handleDeleteProduct(product.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
