'use client';

import { useAuthStore } from '@/stores/authStore';
import { ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
          {/* 오른쪽 섹션 */}
          <div className="flex items-center gap-2">
            <div>
              <span className="text-sm text-foreground">
                {user?.email ? user.email.split('@')[0] : ''}
              </span>
            </div>

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
                      <Link href="/orderHistory">주문 내역</Link>
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
