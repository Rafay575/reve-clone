'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/axios';

type AboutSection = { text: string };
type FAQ = { question: string; answer: string };

export default function AboutEditor() {
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/about');
        setAboutSections(res.data.aboutSections || []);
        setFaqs(res.data.faqs || []);
      } catch {
        setAboutSections([{ text: '' }]);
        setFaqs([{ question: '', answer: '' }]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // About Section Handlers
  const handleAboutChange = (i: number, value: string) => {
    setAboutSections(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], text: value };
      return copy;
    });
  };
  const addAboutSection = () => setAboutSections([...aboutSections, { text: '' }]);
  const deleteAboutSection = (i: number) => setAboutSections(aboutSections.filter((_, idx) => idx !== i));

  // FAQ Handlers
  const handleFaqChange = (i: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  };
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const deleteFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));

  // Save Handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/admin/about', { aboutSections, faqs });
      toast.success('Saved!');
    } catch {
      toast.error('Save failed.');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="bg-white shadow rounded-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit About Page</h2>
          {isLoading ? (
            <div className="py-20 text-center text-gray-400">Loading…</div>
          ) : (
            <>
              <div className="mb-10">
                <h3 className="text-lg font-bold mb-2 text-gray-700">About Paragraphs</h3>
                {aboutSections.map((sec, i) => (
                  <div key={i} className="mb-4 flex items-start gap-2">
                    <textarea
                      value={sec.text}
                      onChange={e => handleAboutChange(i, e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 min-h-[50px]"
                      placeholder={`About section #${i + 1}`}
                    />
                    {aboutSections.length > 1 && (
                      <Button variant="destructive" size="sm" onClick={() => deleteAboutSection(i)}>
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addAboutSection}>+ Add Section</Button>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-bold mb-2 text-gray-700">FAQs</h3>
                {faqs.map((faq, i) => (
                  <div key={i} className="mb-4 border-b pb-4">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={e => handleFaqChange(i, 'question', e.target.value)}
                      placeholder="FAQ Question"
                      className="w-full mb-2 border border-gray-300 rounded p-2 font-semibold"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={e => handleFaqChange(i, 'answer', e.target.value)}
                      placeholder="FAQ Answer"
                      className="w-full border border-gray-300 rounded p-2 min-h-[50px]"
                    />
                    {faqs.length > 1 && (
                      <Button variant="destructive" size="sm" onClick={() => deleteFaq(i)} className="mt-2">
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addFaq}>+ Add FAQ</Button>
              </div>

              <div className="text-right">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
