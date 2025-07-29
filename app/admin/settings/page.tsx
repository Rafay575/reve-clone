'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

export default function SettingsPage() {
  const router = useRouter();
  const [creditsPerDollar, setCreditsPerDollar] = useState<number>(1);
  const [usdToBdt, setUsdToBdt] = useState<number>(120);
  const [freeSignupCredits, setFreeSignupCredits] = useState<number>(0);
  const [errors, setErrors] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.get('/settings');
        const data = res.data;
        setCreditsPerDollar(data.creditsPerDollar ?? 1);
        setUsdToBdt(data.usdToBdt ?? 120);
        setFreeSignupCredits(data.freeSignupCredits ?? 0);
      } catch (err) {
        toast.error('Failed to load settings');
      }
    }
    loadSettings();
  }, []);

  const validate = () => {
    const errs: any = {};
    if (creditsPerDollar < 1) errs.creditsPerDollar = 'Must be at least 1';
    if (usdToBdt < 1) errs.usdToBdt = 'Must be at least 1';
    if (freeSignupCredits < 0) errs.freeSignupCredits = 'Cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    try {
      await api.post('/settings', {
        creditsPerDollar,
        usdToBdt,
        freeSignupCredits,
      });
      toast.success('Settings saved');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card className="bg-white shadow rounded-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Credits per Dollar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits per Dollar <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={creditsPerDollar}
                onChange={e => setCreditsPerDollar(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.creditsPerDollar && (
                <p className="mt-1 text-sm text-red-600">{errors.creditsPerDollar}</p>
              )}
            </div>

            {/* USD to BDT Conversion Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                USD to BDT Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={usdToBdt}
                onChange={e => setUsdToBdt(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.usdToBdt && (
                <p className="mt-1 text-sm text-red-600">{errors.usdToBdt}</p>
              )}
            </div>

            {/* Free Credits on Signup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Credits on Signup <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={freeSignupCredits}
                onChange={e => setFreeSignupCredits(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.freeSignupCredits && (
                <p className="mt-1 text-sm text-red-600">{errors.freeSignupCredits}</p>
              )}
            </div>

            <div className="text-right">
              <Button type="submit" disabled={isSaving} className="px-6">
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
