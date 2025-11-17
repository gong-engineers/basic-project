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
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="flex gap-8 max-w-7xl mx-auto px-4 lg:px-8">
        <ImageSection images={product.images} />
        <DescriptionSection product={product} />
      </div>
    </div>
  );
}

export default ProductPage;
