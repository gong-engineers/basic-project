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
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User } from '../dashboard/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<null | User[]>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    (async () => {
      try {
        const response = await client.get<null, User[]>(`${API_URL}/user`);
        setUser(response);
      } catch {}
    })();
  }, [mounted]);

  async function handleDeleteUser(userId: number) {
    if (!confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await client.delete(`${API_URL}/user/${userId}`);
      setUser((prevUsers) =>
        prevUsers ? prevUsers.filter((user) => user.id !== userId) : null,
      );
    } catch {
      alert('회원 삭제에 실패했습니다.');
    }
  }

  async function handleUpdateUser(userId: number) {
    const userRole = user?.find((u) => u.id === userId)?.role;

    if (!userRole) return;

    const newRole = userRole === 'ADMIN' ? 'USER' : 'ADMIN';

    if (
      !confirm(
        `이 회원의 권한을 ${userRole} 에서 ${newRole} (으)로 변경하시겠습니까?`,
      )
    ) {
      return;
    }

    try {
      await client.patch(`${API_URL}/user/${userId}`, { role: newRole });
      setUser((prevUsers) =>
        prevUsers
          ? prevUsers.map((user) =>
              user.id === userId ? { ...user, role: newRole } : user,
            )
          : null,
      );
    } catch {
      alert('회원 권한 변경에 실패했습니다.');
    }
  }

  if (!user) {
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
              <h1 className="text-3xl font-bold text-white">회원 관리</h1>
              <p className="text-slate-400 mt-1">전체 회원 정보 관리</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-linear-to-br from-slate-950 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Table>
            <TableHeader className="bg-slate-900 border-b border-slate-700">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-slate-300">이메일</TableHead>
                <TableHead className="text-slate-300">가입일</TableHead>
                <TableHead className="text-slate-300">권한</TableHead>
                <TableHead className="text-slate-300 text-right">
                  작업
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.map((u) => (
                <TableRow
                  key={u.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <TableCell className="text-white font-medium">
                    {u.email}
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-slate-400">{u.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-slate-400 hover:text-blue-400"
                        onClick={() => handleUpdateUser(u.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => handleDeleteUser(u.id)}
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
