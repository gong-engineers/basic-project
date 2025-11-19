import { client } from '@/lib/api';
import { item } from '@basic-project/shared-types';

export interface GetProductsParams {
  keyword?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  items: item.Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchProducts(params: GetProductsParams) {
  const { keyword, category, page, limit } = params;
  const query = new URLSearchParams();

  if (page) {
    query.append('page', page.toString());
  }

  if (limit) {
    query.append('limit', limit.toString());
  }

  if (keyword) {
    query.append('keyword', keyword);
  }

  if (category) {
    query.append('category', category);
  }

  const url = `http://localhost:3001/api/v1/products?${query.toString()}`;

  const data = await client.get<null, GetProductsResponse>(url);
  return data;
}
