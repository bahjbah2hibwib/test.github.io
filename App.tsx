import React, { useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import OutputPanel from './components/OutputPanel';
import { generateQuestions } from './services/geminiService';
import type { FormDataState } from './types';

function App() {
  const [formData, setFormData] = useState<FormDataState>({
    subject: 'Toán',
    grade: 'Lớp 3',
    questionType: 'Trắc nghiệm',
    quantity: '3 câu',
    difficulty: 'Thông hiểu',
    topic: 'Phép cộng đặt tính',
    includeAnswers: true,
    useLatex: true,
    additionalRequirements: '',
    exerciseType: 'Bài tập hàng ngày',
    tone: 'Thân thiện, vui vẻ',
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent('');
    try {
      const content = await generateQuestions(formData);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black bg-opacity-10 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center font-sans">
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ConfigPanel
          formData={formData}
          setFormData={setFormData}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <OutputPanel
          content={generatedContent}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}

export default App;
