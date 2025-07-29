'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/axios'; // Make sure this path is correct!

type PolicySection = {
  heading: string;
  text: string;
};

export default function PrivacyPolicyEditor() {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sections from API on mount
  useEffect(() => {
    async function fetchSections() {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/privacy-policy');
        setSections(res.data.length ? res.data : [{
          heading: 'Privacy Policy',
          text: 'Add your privacy policy sections here.'
        }]);
      } catch (e) {
        toast.error('Failed to load privacy policy from server.');
        setSections([{
          heading: 'Privacy Policy',
          text: 'Add your privacy policy sections here.'
        }]);
      }
      setIsLoading(false);
    }
    fetchSections();
  }, []);

  const handleSectionChange = (idx: number, field: 'heading' | 'text', value: string) => {
    setSections(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleAddSection = () => {
    setSections([...sections, { heading: '', text: '' }]);
  };

  const handleDeleteSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/admin/privacy-policy', { sections });
      toast.success('Privacy Policy saved!');
    } catch {
      toast.error('Failed to save privacy policy.');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="bg-white shadow rounded-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Edit Privacy Policy
          </h2>
          {(isLoading || isSaving) ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <div className="text-gray-400 text-sm">
                {isLoading ? "Loading…" : "Saving…"}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {sections.map((sec, idx) => (
                  <div key={idx} className="border-b pb-6 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-lg font-bold text-gray-700">
                        {idx + 1}.&nbsp;
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={e =>
                            handleSectionChange(idx, 'heading', e.target.value)
                          }
                          placeholder="Section Heading"
                          className="inline-block border-0 bg-transparent font-bold text-gray-700 focus:ring-0 focus:outline-none w-auto min-w-[60px]"
                          style={{ minWidth: 120, maxWidth: 280 }}
                        />
                      </label>
                      {sections.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSection(idx)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    <textarea
                      value={sec.text}
                      onChange={e =>
                        handleSectionChange(idx, 'text', e.target.value)
                      }
                      placeholder="Section text"
                      className="w-full border border-gray-300 rounded-md p-2 min-h-[60px] focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddSection}>
                  + Add Section
                </Button>
              </div>
              <div className="text-right mt-8">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Policy'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
