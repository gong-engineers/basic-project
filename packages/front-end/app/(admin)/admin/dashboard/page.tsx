'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { client } from '@/lib/api';
import { convertCategory } from '@/utils/item.util';
import { item } from '@basic-project/shared-types';
import { Categories } from '@basic-project/shared-types/item';
import { BarChart3, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<null | User[]>(null);
  const [product, setProduct] = useState<null | item.Product[]>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    (async () => {
      try {
        const response = await Promise.all([
          client.get<null, User[]>(`${API_URL}/user`),
          client.get<
            null,
            {
              items: item.Product[];
              limit: number;
              page: number;
              total: number;
              totalPages: number;
            }
          >(`${API_URL}/api/v1/products`),
        ]);
        setUser(response[0]);
        setProduct(response[1].items);
      } catch {}
    })();
  }, [mounted]);

  if (!user || !product) {
    return <></>;
  }

  const stats = [
    {
      label: '총 회원 수',
      value: user.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: '총 상품 수',
      value: product.length,
      icon: FileText,
      color: 'bg-green-500',
    },
  ];

  return (
    <>
      <div className="border-b border-slate-700 bg-slate-900 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
          <p className="text-slate-400 mt-1">플랫폼 통계 및 관리 시스템</p>
        </div>
      </div>

      <div className="flex-1 bg-linear-to-br from-slate-950 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="border-slate-700 bg-transparent backdrop-blur w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      {stat.label}
                    </CardTitle>
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-slate-700 bg-transparent backdrop-blur lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  최근 가입 회원
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user
                    .slice(-5)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )
                    .map((u) => (
                      <div
                        key={u.id}
                        className="flex items-start justify-between border-b border-slate-700 pb-3 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {u.email}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(u.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <Link href={'/admin/members'} className="block mt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    전체 회원 관리
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-transparent backdrop-blur lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  최근 등록 상품
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product
                    .slice(-5)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-start justify-between border-b border-slate-700 pb-3 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                              {p.category}
                            </span>
                            <p className="text-sm font-medium text-white truncate flex-1">
                              {p.name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400">
                            {new Date(p.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <Link href={'/admin/products'} className="block mt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    전체 상품 관리
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-700 bg-transparent backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                카테고리별 상품 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Categories.map((category) => (
                  <div
                    key={category}
                    className="bg-slate-700/30 rounded-lg p-4 text-center border border-slate-600"
                  >
                    <div
                      className={`${convertCategory(category).bgColor} h-8 rounded-full flex items-center justify-center mb-2 mx-auto w-8`}
                    ></div>
                    <p className="text-slate-300 font-medium text-sm">
                      {convertCategory(category).label}
                    </p>
                    <p className="text-white text-2xl font-bold mt-2">
                      {product.filter((p) => p.category === category).length}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
