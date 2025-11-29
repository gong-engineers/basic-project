/* eslint-disable @next/next/no-img-element */
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
import { ChevronLeft, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { API_URL, getPresignedUrl, uploadToS3 } from '@/lib/api/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Categories } from '@basic-project/shared-types/item';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    item.Category | 'ALL'
  >('ALL');
  const [products, setProducts] = useState<null | item.Product[]>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<item.Product>>({
    name: '',
    category: 'SOCCER',
    price: 0,
    description: '',
    images: [],
    discountPrice: 0,
    discountStartDate: '',
    discountEndDate: '',
  });

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        >(`${API_URL}/api/v1/products?limit=1000&page=1`);
        setProducts(response.items);
      } catch {}
    })();
  }, [mounted]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (files) {
      const uploadedUrls: string[] = [];

      try {
        await Promise.all(
          Array.from(files).map(async (file) => {
            const { presignedUrl, fileUrl } = await getPresignedUrl(file.type);

            await uploadToS3(presignedUrl, file);
            uploadedUrls.push(fileUrl);
          }),
        );
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images as string[]), ...uploadedUrls],
        }));
      } catch {}
    }
  }

  function removeImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images as string[]).filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (formData.discountPrice && formData.discountPrice !== 0) {
      if (!formData.discountStartDate || !formData.discountEndDate) {
        alert('할인가를 설정할 경우 할인 시작/종료 날짜를 입력해주세요.');
        return;
      }
      if (formData.discountStartDate > formData.discountEndDate) {
        alert('할인 시작일은 종료일보다 이전이어야 합니다.');
        return;
      }
    }

    try {
      const newProduct = await client.post<Partial<item.Product>, item.Product>(
        `${API_URL}/api/v1/products`,
        formData,
      );

      setProducts((prevProducts) =>
        prevProducts ? [newProduct, ...prevProducts] : [newProduct],
      );
      setFormData({
        name: '',
        category: 'SOCCER',
        price: 0,
        description: '',
        images: [],
        discountPrice: 0,
        discountStartDate: '',
        discountEndDate: '',
      });
      setIsOpen(false);
    } catch {
      alert('상품 추가에 실패했습니다.');
      setFormData({
        name: '',
        category: 'SOCCER',
        price: 0,
        description: '',
        images: [],
        discountPrice: 0,
        discountStartDate: '',
        discountEndDate: '',
      });
      setIsOpen(false);
    }
  }

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

  if (!mounted || !products || !filteredProducts) {
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
          <Card className="border-slate-700 bg-slate-800 backdrop-blur mb-8">
            <CardContent className="">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2 h-5 w-5 text-slate-500" />
                  <Input
                    placeholder="상품 이름으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={
                    setSelectedCategory as (
                      value: item.Category | 'ALL',
                    ) => void
                  }
                >
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="ALL">모든 카테고리</SelectItem>
                    {Categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      상품 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        새 상품 추가
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        새로운 스포츠 상품을 등록합니다.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-300">
                          상품명
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="상품명을 입력하세요"
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-300">
                          카테고리
                        </label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              category: value as item.Category,
                            })
                          }
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            {Categories.map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="text-white"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-slate-300">
                            정가
                          </label>
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: Number(e.target.value),
                              })
                            }
                            placeholder="0"
                            className="bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-300">
                          할인가 (선택)
                        </label>
                        <Input
                          type="number"
                          value={formData.discountPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountPrice: Number(e.target.value),
                            })
                          }
                          placeholder="0"
                          className="bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 px-3 py-2"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">
                              할인 시작날짜
                            </label>
                            <Input
                              type="date"
                              value={formData.discountStartDate || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  discountStartDate: e.target.value,
                                })
                              }
                              className="bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 px-3 py-2"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">
                              할인 종료날짜
                            </label>
                            <Input
                              type="date"
                              value={formData.discountEndDate || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  discountEndDate: e.target.value,
                                })
                              }
                              className="bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 px-3 py-2"
                            />
                          </div>
                        </div>{' '}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-slate-300">
                            상품 이미지
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                <p className="text-sm text-slate-400">
                                  클릭하여 이미지를 선택하거나 드래그하세요
                                </p>
                              </div>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {formData.images!.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                              {formData.images!.map((image, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={image || '/placeholder.svg'}
                                    alt={`미리보기 ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-slate-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 p-1 rounded"
                                  >
                                    <X className="h-3 w-3 text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-300">
                          설명
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="상품 설명을 입력하세요"
                          rows={3}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 px-3 py-2"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                          className="flex-1 border-transparent bg-slate-600 hover:text-white hover:bg-slate-700"
                        >
                          취소
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          추가
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
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
              {filteredProducts.map((product) => (
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
