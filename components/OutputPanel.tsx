
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface OutputPanelProps {
  content: string;
  isLoading: boolean;
  error: string | null;
}

type ViewMode = 'markdown' | 'rendered';

const OutputPanel: React.FC<OutputPanelProps> = ({ content, isLoading, error }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('rendered');

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">Đang tạo câu hỏi, vui lòng chờ...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50 p-4 rounded-lg">
          <p className="font-bold">Đã xảy ra lỗi!</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.28-.28-2.427-.734-3.5-1.286a7.5 7.5 0 0 1-1.286-3.5c-.552-1.073-.866-2.217-.866-3.5s.314-2.427.866-3.5c.552-1.073 1.286-2.427 3.5-3.5a7.5 7.5 0 0 1 7.5 0c1.073.552 2.217.866 3.5.866s2.427-.314 3.5-.866c1.073-.552 2.427-1.286 3.5-3.5a7.5 7.5 0 0 1 1.286 3.5c.552 1.073.866 2.217.866 3.5s-.314 2.427-.866 3.5c-.552 1.073-1.286 2.427-3.5 3.5Z" />
            </svg>
          </div>
          <p className="font-semibold text-lg">Chưa có nội dung xem trước</p>
          <p className="text-sm text-center">Nhập các tùy chọn và nhấn "Tạo câu hỏi" để xem kết quả.</p>
        </div>
      );
    }

    if (viewMode === 'markdown') {
      return (
        <pre className="whitespace-pre-wrap bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
          <code>{content}</code>
        </pre>
      );
    }

    return (
      <article className="prose prose-blue max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </article>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 h-[80vh] flex flex-col">
      <div className="flex-shrink-0 p-2">
        <div className="bg-blue-100/50 rounded-lg p-1 flex items-center w-full max-w-xs mx-auto">
          <button
            onClick={() => setViewMode('markdown')}
            className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 ${
              viewMode === 'markdown'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Markdown
          </button>
          <button
            onClick={() => setViewMode('rendered')}
            className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 ${
              viewMode === 'rendered'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Rendered
          </button>
        </div>
      </div>
      <div className="flex-grow p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputPanel;
