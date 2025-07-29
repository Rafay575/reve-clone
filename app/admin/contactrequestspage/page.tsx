"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

type ContactRequest = {
  id: number;
  name: string;
  email: string;
  message: string;
  submitted_at: string;
};

type ApiResponse = {
  data: ContactRequest[];
  total: number;
};

const PAGE_SIZES = [5, 10, 20, 50];

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let ignore = false;
    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse>("/contact", {
          params: { page, perPage, sort },
        });
        if (!ignore) {
          setRequests(res.data.data);
          setTotal(res.data.total);
        }
      } catch {
        if (!ignore) {
          setRequests([]);
          setTotal(0);
        }
      }
      if (!ignore) setLoading(false);
    }
    fetchRequests();
    return () => {
      ignore = true;
    };
  }, [page, perPage, sort]);

  const totalPages = Math.ceil(total / perPage);

  const startIdx = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="bg-white shadow rounded-lg">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Contact Requests
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPage(1);
                  setPerPage(Number(e.target.value));
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>
          </div>
          {/* 
          <div className="flex items-center justify-between text-sm mb-3">
            <div>
              {loading
                ? "Loading…"
                : total > 0
                ? `Showing ${startIdx}–${endIdx} of ${total}`
                : "No contacts found."}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={loading || page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>
              <span className="px-2">{page} / {totalPages || 1}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div> */}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
                  >
                    Submitted At
                    <span className="ml-1 text-xs text-gray-500">
                      {sort === "desc" ? "↓" : "↑"}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No contact requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-gray-50">
                      <TableCell>{req.id}</TableCell>
                      <TableCell>{req.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${req.email}`}
                          className="text-indigo-600 underline"
                        >
                          {req.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <span className="whitespace-pre-line break-all">
                          {req.message}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(req.submitted_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center">
            <div>
              {loading
                ? "Loading…"
                : total > 0
                ? `Showing ${startIdx}–${endIdx} of ${total}`
                : "No contacts found."}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={loading || page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>
              <span className="px-2">
                {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
