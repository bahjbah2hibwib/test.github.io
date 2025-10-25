
import React, { useState } from 'react';
// KaTeX CSS is required for proper rendering of display math (arrays, aligned envs)
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import SavedQuestions from './SavedQuestions';

interface OutputPanelProps {
  content: string;
  isLoading: boolean;
  error: string | null;
  onContentChange?: (content: string) => void;
}

type ViewMode = 'markdown' | 'rendered';

const OutputPanel: React.FC<OutputPanelProps> = ({ content, isLoading, error, onContentChange }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('rendered');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [showSavedQuestions, setShowSavedQuestions] = useState<boolean>(false);

  // Hàm sao chép nội dung
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Đã sao chép!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Lỗi khi sao chép:', err);
      setCopySuccess('Lỗi khi sao chép');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  // Hàm lưu vào localStorage
  const handleSave = () => {
    try {
      const savedQuestions = JSON.parse(localStorage.getItem('savedQuestions') || '[]');
      const newQuestion = {
        id: Date.now(),
        content: content,
        timestamp: new Date().toISOString(),
        title: `Câu hỏi ${savedQuestions.length + 1}`
      };
      savedQuestions.push(newQuestion);
      localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions));
      setCopySuccess('Đã lưu!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Lỗi khi lưu:', err);
      setCopySuccess('Lỗi khi lưu');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  // Hàm tải xuống file
  const handleDownload = () => {
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cau-hoi-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setCopySuccess('Đã tải xuống!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Lỗi khi tải xuống:', err);
      setCopySuccess('Lỗi khi tải xuống');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  // Hàm xử lý khi chọn câu hỏi đã lưu
  const handleSelectSavedQuestion = (selectedContent: string) => {
    if (onContentChange) {
      onContentChange(selectedContent);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/20 rounded-full animate-spin border-t-blue-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-semibold mt-6 mb-2">Đang tạo câu hỏi</p>
          <p className="text-blue-200 text-center max-w-md">
            AI đang phân tích yêu cầu và tạo câu hỏi phù hợp với cấu hình của bạn...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-300 mb-2">Đã xảy ra lỗi!</h3>
          <p className="text-red-200 text-center max-w-md">{error}</p>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.28-.28-2.427-.734-3.5-1.286a7.5 7.5 0 0 1-1.286-3.5c-.552-1.073-.866-2.217-.866-3.5s.314-2.427.866-3.5c.552-1.073 1.286-2.427 3.5-3.5a7.5 7.5 0 0 1 7.5 0c1.073.552 2.217.866 3.5.866s2.427-.314 3.5-.866c1.073-.552 2.427-1.286 3.5-3.5a7.5 7.5 0 0 1 1.286 3.5c.552 1.073.866 2.217.866 3.5s-.314 2.427-.866 3.5c-.552 1.073-1.286 2.427-3.5 3.5Z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Chưa có nội dung xem trước</h3>
          <p className="text-blue-200 text-center max-w-md mb-6">
            Nhập các tùy chọn và nhấn "Tạo câu hỏi" để xem kết quả được tạo bởi AI.
          </p>
          <div className="flex items-center gap-2 text-blue-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Sẵn sàng tạo câu hỏi thông minh
          </div>
        </div>
      );
    }

    if (viewMode === 'markdown') {
      return (
        <div className="glass rounded-2xl p-6">
          <pre className="whitespace-pre-wrap text-white text-sm leading-relaxed font-mono">
            {content}
          </pre>
        </div>
      );
    }

    return (
      <div className="glass rounded-2xl p-6">
        <article className="prose prose-invert prose-blue max-w-none prose-headings:text-white prose-p:text-blue-100 prose-strong:text-white prose-code:text-blue-200 prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              // Preserve line breaks and long words in paragraphs and list items
              p: (props: any) => (
                <p className="whitespace-pre-wrap mb-4">{props.children}</p>
              ),
              // Use createElement for <li> to avoid JSX static linting that enforces li inside ul/ol
              li: (props: any) => (
                React.createElement('li', { className: 'whitespace-pre-wrap break-words' }, props.children)
              ),
              pre: (props: any) => (
                <pre className="whitespace-pre-wrap overflow-x-auto">{props.children}</pre>
              ),
              code: (props: any) => {
                const inline = props.inline;
                const className = props.className ?? '';
                return (
                  <code className={`${className} bg-white/10 px-1 py-0.5 rounded ${inline ? '' : 'whitespace-pre-wrap'} break-words`}>
                    {props.children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    );
  };

  return (
    <div className="glass rounded-3xl shadow-professional-lg h-[80vh] flex flex-col hover:shadow-professional-lg transition-all duration-300">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 3 3 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Kết quả tạo câu hỏi</h2>
              <p className="text-blue-200 text-sm">Xem trước và quản lý câu hỏi đã tạo</p>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="glass rounded-xl p-1 flex items-center">
            <button
              onClick={() => setViewMode('markdown')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'markdown'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Markdown
            </button>
            <button
              onClick={() => setViewMode('rendered')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'rendered'
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Rendered
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Nút xem câu hỏi đã lưu - luôn hiển thị */}
          <button
            onClick={() => setShowSavedQuestions(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Xem câu hỏi đã lưu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
            Đã lưu
          </button>

          {/* Các nút khác chỉ hiển thị khi có nội dung */}
          {content && !isLoading && !error && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Sao chép nội dung"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                Sao chép
              </button>
              
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Lưu vào bộ nhớ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                Lưu
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Tải xuống file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Tải xuống
              </button>
            </>
          )}
        </div>
        
        {/* Success Message */}
        {copySuccess && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 text-sm rounded-xl backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {copySuccess}
            </div>
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="flex-grow p-6 overflow-y-auto">
        {renderContent()}
      </div>
      
      {/* Modal SavedQuestions */}
      {showSavedQuestions && (
        <SavedQuestions
          onSelectQuestion={handleSelectSavedQuestion}
          onClose={() => setShowSavedQuestions(false)}
        />
      )}
    </div>
  );
};

export default OutputPanel;
