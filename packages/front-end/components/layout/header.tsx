'use client';

import { useAuthStore } from '@/stores/authStore';
import { Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = !!user;

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/">
            <div className="text-2xl font-bold text-primary">SportHub</div>
          </Link>
          {/* Search - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-full pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          {/* 오른쪽 섹션 */}
          <div className="flex items-center gap-2">
            <div>
              <span className="text-sm text-foreground">
                {user?.email ? user.email.split('@')[0] : ''}
              </span>
            </div>
            {/* Search - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size={'icon'} className="lg:hidden">
                  <Search className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <div className="flex flex-col gap-4 p-4">
                  <SheetTitle className="font-medium">상품 검색</SheetTitle>
                  <SheetDescription className="hidden">
                    검색어를 입력하세요.
                  </SheetDescription>
                  <Input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="w-full"
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="#">내 정보</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="#">주문 내역</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <div onClick={logout}>로그아웃</div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/carts">
                  <Button variant={'ghost'} size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant={'ghost'}>
                  <Link href="/login">로그인</Link>
                </Button>
                <Button variant={'default'} className="hidden sm:inline-flex">
                  <Link href="/register">회원가입</Link>
                </Button>
                <Button variant={'default'} className="sm:hidden">
                  <Link href="/register">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
