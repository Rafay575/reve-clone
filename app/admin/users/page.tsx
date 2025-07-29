'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { api } from "@/lib/axios";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get('/users', {
      params: { page, perPage, search }
    })
      .then(res => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [page, perPage, search]);

  return (
    <div className="space-y-6">
      <div className="mx-auto px-4 py-8">
        <Card className="bg-white shadow rounded-lg">
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
              <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
              <div className="flex gap-2 items-center">
                <label className="text-gray-700 text-sm mr-2">Show</label>
                <select
                  value={perPage}
                  onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <input
                  type="search"
                  placeholder="Search by name/email"
                  className="ml-4 border border-gray-300 rounded px-3 py-1"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">Loading…</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">No users found.</TableCell>
                  </TableRow>
                ) : users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role === 1 ? "Admin" : "User"}</TableCell>
                    <TableCell>
                      {user.is_deleted
                        ? "Deleted"
                        : user.is_blocked
                          ? "Blocked"
                          : "Active"}
                    </TableCell>
                    <TableCell>{user.credits}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <span className="text-gray-700 text-sm">
                Showing {users.length ? ((page - 1) * perPage + 1) : 0}–{(page - 1) * perPage + users.length} of {total} users
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40"
                  onClick={() => setPage(page - 1)}
                >Prev</button>
                <span className="text-gray-700">{page} / {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40"
                  onClick={() => setPage(page + 1)}
                >Next</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
