import { convertCategory } from '@/utils/item.util';
import { Categories } from '@basic-project/shared-types/item';
import Link from 'next/link';

export default function Footer() {
  const categories = Categories.map(convertCategory);
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Section 1 */}
          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold text-primary">SportHub</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              최고의 스포츠 굿즈를 제공하는 전문 쇼핑몰입니다.
            </p>
          </div>
          {/* Section 2 */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">스포츠</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {categories.map((categories) => (
                <li key={categories.label}>
                  <a href="#">{categories.label}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* Section 3 */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">지원</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <a href="#">고객 문의</a>
              </li>
              <li>
                <a href="#">배송 정보</a>
              </li>
              <li>
                <a href="#">반품 정책</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 SportHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
