import React, { useState, useMemo } from 'react';
import type { FormDataState } from '../types';
import InputGroup from './InputGroup';
import { BookIcon, ClassIcon, EyeIcon, GenerateIcon, LevelIcon, ListIcon, NumberIcon, SparklesIcon, TopicIcon, ExerciseIcon, ToneIcon } from './icons';

interface ConfigPanelProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  onGenerate: () => void;
  isLoading: boolean;
}

// Reusable Select Component
interface SelectGroupProps {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
}

const SelectGroup: React.FC<SelectGroupProps> = ({ label, icon, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-blue-200">
      {icon}
      {label}:
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 glass rounded-xl text-white bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all duration-200 appearance-none"
      >
        {options.map(option => (
          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

// Constants for form fields
const subjects = ['Toán', 'Tiếng Việt', 'Khoa học', 'Lịch sử và Địa lý', 'Đạo đức', 'Âm nhạc', 'Mỹ thuật'];
const grades = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'];
const questionTypes = ['Trắc nghiệm', 'Tự luận', 'Điền vào chỗ trống', 'Đúng/Sai', 'Nối cặp'];
const difficulties = ['Nhận biết', 'Kết nối', 'Vận dụng'];
const allTopics = [
  'Phép cộng trong phạm vi 10', 'Phép trừ trong phạm vi 20', 'Đọc, viết số có hai chữ số', 'So sánh các số',
  'Xem giờ đúng', 'Hình vuông, hình tròn', 'Giải bài toán có lời văn', 'Bảng nhân 2', 'Bảng chia 5',
  'Từ chỉ sự vật', 'Câu Ai là gì?', 'Viết đoạn văn ngắn', 'Kể chuyện'
];
const exerciseTypes = ['Bài tập hàng ngày', 'Bài ôn tập', 'Kiểm tra nhanh', 'Đề thi cuối kỳ'];
const tones = ['Thân thiện, vui vẻ', 'Học thuật, nghiêm túc'];

const ConfigPanel: React.FC<ConfigPanelProps> = ({ formData, setFormData, onGenerate, isLoading }) => {
  const [topicQuery, setTopicQuery] = useState(formData.topic);
  const [isTopicFocused, setIsTopicFocused] = useState(false);

  const topicSuggestions = useMemo(() => {
    if (!topicQuery) return [];
    return allTopics.filter(topic => topic.toLowerCase().includes(topicQuery.toLowerCase()));
  }, [topicQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTopicQuery(value);
    setFormData(prev => ({ ...prev, topic: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setTopicQuery(suggestion);
    setFormData(prev => ({ ...prev, topic: suggestion }));
    setIsTopicFocused(false);
  };

  return (
    <div className="glass rounded-3xl shadow-professional-lg p-8 space-y-8 hover:shadow-professional-lg transition-all duration-300">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Cấu hình tạo câu hỏi
        </h1>
        <p className="text-blue-100 text-sm">
          Thiết lập các thông số để tạo câu hỏi phù hợp
        </p>
      </div>

      {/* Basic Settings */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <ListIcon className="w-5 h-5 text-blue-300" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Cài đặt cơ bản
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InputGroup label="Môn học" icon={<BookIcon />} name="subject" value={formData.subject} onChange={handleInputChange} list="subjects-list" />
            <datalist id="subjects-list">
              {subjects.map(s => <option key={s} value={s} />)}
            </datalist>
            <SelectGroup label="Lớp" icon={<ClassIcon />} name="grade" value={formData.grade} onChange={handleSelectChange} options={grades} />
            <SelectGroup label="Loại câu hỏi" icon={<ListIcon />} name="questionType" value={formData.questionType} onChange={handleSelectChange} options={questionTypes} />
          </div>
          
          <div className="space-y-4">
            <InputGroup label="Số lượng" icon={<NumberIcon />} name="quantity" value={formData.quantity} onChange={handleInputChange} />
            <SelectGroup label="Mức độ" icon={<LevelIcon />} name="difficulty" value={formData.difficulty} onChange={handleSelectChange} options={difficulties} />
            <div className="relative">
              <InputGroup 
                label="Chủ đề" 
                icon={<TopicIcon />} 
                name="topic" 
                value={topicQuery} 
                onChange={handleTopicChange} 
                placeholder="VD: Phép cộng đặt tính" 
                onFocus={() => setIsTopicFocused(true)}
                onBlur={() => setTimeout(() => setIsTopicFocused(false), 200)}
              />
              {isTopicFocused && topicSuggestions.length > 0 && (
                <ul className="absolute z-20 w-full glass rounded-xl mt-2 shadow-professional max-h-40 overflow-y-auto">
                  {topicSuggestions.map(suggestion => (
                    <li key={suggestion} onMouseDown={() => handleSuggestionClick(suggestion)} className="px-4 py-3 cursor-pointer hover:bg-white/10 text-white border-b border-white/10 last:border-b-0">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-purple-300" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Tùy chọn nâng cao
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectGroup label="Loại bài tập" icon={<ExerciseIcon />} name="exerciseType" value={formData.exerciseType} onChange={handleSelectChange} options={exerciseTypes} />
          <SelectGroup label="Phong cách" icon={<ToneIcon />} name="tone" value={formData.tone} onChange={handleSelectChange} options={tones} />
        </div>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-colors">
            <input 
              type="checkbox" 
              name="includeAnswers" 
              checked={formData.includeAnswers} 
              onChange={handleCheckboxChange} 
              className="w-5 h-5 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-2" 
            />
            <span className="text-white font-medium">Kèm theo đáp án và lời giải</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-colors">
            <input 
              type="checkbox" 
              name="useLatex" 
              checked={formData.useLatex} 
              onChange={handleCheckboxChange} 
              className="w-5 h-5 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-2" 
            />
            <span className="text-white font-medium">Sử dụng định dạng Toán nâng cao (LaTeX)</span>
          </div>
        </div>
      </div>
      
      {/* Additional Requirements */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
          </div>
          <label htmlFor="additionalRequirements" className="text-lg font-semibold text-white">
            Yêu cầu bổ sung
          </label>
        </div>
        <textarea
          id="additionalRequirements"
          name="additionalRequirements"
          value={formData.additionalRequirements}
          onChange={handleInputChange}
          rows={4}
          placeholder="VD: Tạo bài có đặt phép tính theo cột dọc, sử dụng số lớn hơn 100..."
          className="w-full px-4 py-3 glass rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all duration-200 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full sm:w-1/2 flex items-center justify-center gap-3 px-6 py-4 text-white font-semibold glass rounded-xl shadow-lg hover:shadow-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <EyeIcon />
          Xem trước
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full sm:w-1/2 flex items-center justify-center gap-3 px-6 py-4 text-white font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-professional hover:shadow-professional-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tạo...
            </>
          ) : (
            <>
              <GenerateIcon />
              Tạo câu hỏi
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfigPanel;
