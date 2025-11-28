import { client } from '@/lib/api';
import { item } from '@basic-project/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface GetProductsParams {
  keyword?: string;
  category?: string;
  page?: number;
}

export interface GetProductsResponse {
  items: item.Product[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchProducts(params: GetProductsParams) {
  const { keyword, category, page } = params;
  const query = new URLSearchParams();

  if (keyword) {
    query.append('keyword', keyword);
  }

  if (category) {
    query.append('category', category);
  }

  if (page) {
    query.append('page', page.toString());
  }

  const url = `${API_URL}/api/v1/products?${query.toString()}`;

  const data = await client.get<null, GetProductsResponse>(url);
  return data;
}
