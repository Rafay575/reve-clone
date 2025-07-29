'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/axios'; // adjust path if needed

type TermsSection = {
  heading: string;
  text: string;
};

export default function TermsEditor() {
  const [sections, setSections] = useState<TermsSection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial terms as sections from API
  useEffect(() => {
    async function fetchSections() {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/terms');
        setSections(res.data.length ? res.data : [{
          heading: 'Terms & Conditions',
          text: 'These Terms govern your access to and use of Tivoa Image 1.0. By using our app, you agree to these terms in full.'
        }]);
      } catch {
        toast.error('Failed to load terms from server.');
        setSections([{
          heading: 'Terms & Conditions',
          text: 'These Terms govern your access to and use of Tivoa Image 1.0. By using our app, you agree to these terms in full.'
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
      await api.post('/admin/terms', { sections });
      toast.success('Terms & Conditions saved!');
    } catch {
      toast.error('Failed to save Terms & Conditions.');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="bg-white shadow rounded-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Edit Terms &amp; Conditions
          </h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <div className="text-gray-400 text-sm">
                Loading…
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
                  {isSaving ? 'Saving...' : 'Save Terms'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
