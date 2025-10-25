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
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              AI Question Generator
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Tạo câu hỏi học tập thông minh với trí tuệ nhân tạo
            </p>
          </div>
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
              onContentChange={setGeneratedContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
