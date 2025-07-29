'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';

type User = {
  id: number;
  name: string;
  email: string;
  role: number;
  is_blocked: number;
  is_deleted: number;
  credits: number;
};

type Transaction = {
  id: number;
  payment_id: string;
  trx_id: string;
  amount_bdt: string;
  credits: number;
  status: string;
  created_at: string;
};

type Image = {
  id: number;
  image_url: string;
  created_at: string;
};

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  // Transactions pagination state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txnPage, setTxnPage] = useState(1);
  const [txnPerPage, setTxnPerPage] = useState(10);
  const [txnTotalPages, setTxnTotalPages] = useState(1);
  const [txnTotal, setTxnTotal] = useState(0);
  const [txnLoading, setTxnLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchDetails() {
      try {
        // User + images (from your old /details endpoint)
        const res = await api.get(`/users/${id}/details`);
        setUser(res.data.user);
        setImages(res.data.images);
      } catch (err) {
        setUser(null);
        setImages([]);
      }
    }
    fetchDetails();
  }, [id]);

  // Fetch paginated transactions
  useEffect(() => {
    if (!id) return;
    setTxnLoading(true);
    api.get(`/users/${id}/transactions`, {
      params: { page: txnPage, perPage: txnPerPage }
    })
      .then(res => {
        setTransactions(res.data.transactions);
        setTxnTotal(res.data.total);
        setTxnTotalPages(res.data.totalPages);
      })
      .catch(() => setTransactions([]))
      .finally(() => setTxnLoading(false));
  }, [id, txnPage, txnPerPage]);

  if (!user) return <div className="text-gray-700 flex justify-center py-8">Loading...</div>;

  const statusText = user.is_deleted ? 'Deleted' : user.is_blocked ? 'Blocked' : 'Active';

  return (
    <div className="mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile Header */}
      <Card className="bg-white shadow rounded-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 space-y-6 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-3xl font-medium text-indigo-500">{user.name.charAt(0)}</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-medium text-gray-900">{user.role === 1 ? 'Admin' : 'User'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-medium text-gray-900">{statusText}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Credits</p>
                <p className="text-lg font-medium text-gray-900">{user.credits}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Statcard label="Transactions" value={txnTotal} />
        <Statcard label="Images" value={images.length} />
        <Statcard label="Credits" value={user.credits} />
        <Statcard label="Status" value={statusText} />
      </div>

      {/* Transactions Table (Paginated) */}
      <Card className="bg-white shadow rounded-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Transactions</h3>
            <div className="flex gap-2 items-center">
              <label className="text-gray-700 text-sm mr-2">Show</label>
              <select
                value={txnPerPage}
                onChange={e => { setTxnPerPage(Number(e.target.value)); setTxnPage(1); }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Trx ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txnLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">Loading…</TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">No transactions found.</TableCell>
                  </TableRow>
                ) : transactions.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-gray-50">
                    <TableCell>{txn.id}</TableCell>
                    <TableCell>{txn.payment_id}</TableCell>
                    <TableCell>{txn.trx_id}</TableCell>
                    <TableCell>{txn.amount_bdt} BDT</TableCell>
                    <TableCell>{txn.credits}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          txn.status === 'SUCCESS'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(txn.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-gray-700 text-sm">
              Showing {transactions.length ? ((txnPage - 1) * txnPerPage + 1) : 0}–{(txnPage - 1) * txnPerPage + transactions.length} of {txnTotal} transactions
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={txnPage <= 1}
                onClick={() => setTxnPage(txnPage - 1)}
              >Prev</Button>
              <span className="text-gray-700">{txnPage} / {txnTotalPages}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={txnPage >= txnTotalPages}
                onClick={() => setTxnPage(txnPage + 1)}
              >Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Gallery */}
      <Card className="bg-white shadow rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={img.image_url}
                  alt={`Generated ${img.id}`}
                  className="w-full h-44 object-cover"
                />
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-500">{new Date(img.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable stat card component
function Statcard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
