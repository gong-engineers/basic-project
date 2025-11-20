import { item } from '@basic-project/shared-types';
import { notFound } from 'next/navigation';
import DescriptionSection from './components/DescriptionSection';
import ImageSection from './components/ImageSection';

interface Props {
  params: Promise<{ id: string }>;
}

async function ProductPage(props: Props) {
  const resolvedParams = await props.params;

  const res = await fetch(
    `${process.env.API_URL}/api/v1/products/${resolvedParams.id}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    return notFound();
  }

  const product: item.Product = await res.json();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6 divide-gray-300">
        <ImageSection images={product.images} />
        <hr className="w-full md:hidden" />
        <DescriptionSection product={product} />
      </div>
    </div>
  );
}

export default ProductPage;
