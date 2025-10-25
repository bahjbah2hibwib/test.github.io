import React, { useState, useEffect } from 'react';

interface SavedQuestion {
  id: number;
  content: string;
  timestamp: string;
  title: string;
}

interface SavedQuestionsProps {
  onSelectQuestion: (content: string) => void;
  onClose: () => void;
}

const SavedQuestions: React.FC<SavedQuestionsProps> = ({ onSelectQuestion, onClose }) => {
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<SavedQuestion | null>(null);

  // Truncate helper: collapse whitespace and avoid cutting mid-word awkwardly
  const truncate = (text: string, n: number) => {
    if (!text) return '';
    const singleLine = text.replace(/\s+/g, ' ').trim();
    if (singleLine.length <= n) return singleLine;
    // try to cut at last space within limit to avoid word-break
    const cut = singleLine.slice(0, n);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > Math.floor(n * 0.6) ? cut.slice(0, lastSpace) : cut).trim() + '...';
  };

  useEffect(() => {
    loadSavedQuestions();
  }, []);

  const loadSavedQuestions = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedQuestions') || '[]');
      setSavedQuestions(saved.reverse()); // Hiển thị mới nhất trước
    } catch (err) {
      console.error('Lỗi khi tải câu hỏi đã lưu:', err);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    try {
      const updatedQuestions = savedQuestions.filter(q => q.id !== id);
      setSavedQuestions(updatedQuestions);
      localStorage.setItem('savedQuestions', JSON.stringify(updatedQuestions));
      if (selectedQuestion?.id === id) {
        setSelectedQuestion(null);
      }
    } catch (err) {
      console.error('Lỗi khi xóa câu hỏi:', err);
    }
  };

  const handleSelectQuestion = (question: SavedQuestion) => {
    setSelectedQuestion(question);
    onSelectQuestion(question.content);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl shadow-professional-lg w-full max-w-6xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Câu hỏi đã lưu</h2>
              <p className="text-blue-200 text-sm">Quản lý và sử dụng lại câu hỏi đã tạo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-xl transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Danh sách câu hỏi */}
          <div className="w-1/3 border-r border-white/10 overflow-y-auto">
            <div className="p-6">
              {savedQuestions.length === 0 ? (
                <div className="text-center text-white py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Chưa có câu hỏi nào được lưu</h3>
                  <p className="text-blue-200 text-sm mb-4">Tạo và lưu câu hỏi để xem chúng ở đây</p>
                  <div className="flex items-center justify-center gap-2 text-orange-300 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Sẵn sàng lưu câu hỏi đầu tiên
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedQuestions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-4 glass rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedQuestion?.id === question.id
                          ? 'bg-blue-500/20 border border-blue-400/30 shadow-lg'
                          : 'hover:bg-white/5 hover:shadow-lg'
                      }`}
                      onClick={() => handleSelectQuestion(question)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm mb-1">{question.title}</h3>
                          <p className="text-xs text-blue-200 mb-2">{formatDate(question.timestamp)}</p>
                          <p className="text-xs text-blue-100 line-clamp-2 leading-relaxed">
                            {truncate(question.content, 120)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(question.id);
                          }}
                          className="ml-3 p-2 hover:bg-red-500/20 rounded-lg text-red-300 hover:text-red-200 transition-colors duration-200"
                          title="Xóa câu hỏi"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nội dung câu hỏi được chọn */}
          <div className="flex-1 flex flex-col">
            {selectedQuestion ? (
              <>
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <h3 className="font-bold text-white text-lg mb-1">{selectedQuestion.title}</h3>
                  <p className="text-blue-200 text-sm">{formatDate(selectedQuestion.timestamp)}</p>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="glass rounded-2xl p-6">
                    <pre className="whitespace-pre-wrap text-white text-sm leading-relaxed font-mono">
                      {selectedQuestion.content}
                    </pre>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 bg-gradient-to-r from-green-500/10 to-blue-500/10">
                  <button
                    onClick={() => {
                      onSelectQuestion(selectedQuestion.content);
                      onClose();
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sử dụng câu hỏi này
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 3 3 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Chọn một câu hỏi để xem</h3>
                  <p className="text-blue-200 text-sm">Nhấp vào câu hỏi bên trái để xem nội dung chi tiết</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedQuestions;
