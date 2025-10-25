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
  <div className="space-y-1">
    <label htmlFor={name} className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
      {icon}
      {label}:
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-gray-700 bg-white/80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

// Constants for form fields
const subjects = ['Toán', 'Tiếng Việt', 'Khoa học', 'Lịch sử và Địa lý', 'Đạo đức', 'Âm nhạc', 'Mỹ thuật'];
const grades = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'];
const questionTypes = ['Trắc nghiệm', 'Tự luận', 'Điền vào chỗ trống', 'Đúng/Sai', 'Nối cặp'];
const difficulties = ['Nhận biết', 'Thông hiểu', 'Nâng cao'];
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
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 space-y-6 border border-white/20">
      <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <SparklesIcon />
        Cấu hình tạo câu hỏi
      </h1>

      <div className="bg-white/80 rounded-xl p-4 space-y-4 shadow-inner">
        <h2 className="text-md font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <ListIcon className="w-5 h-5" />
          Cài đặt cơ bản
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputGroup label="Môn học" icon={<BookIcon />} name="subject" value={formData.subject} onChange={handleInputChange} list="subjects-list" />
            <datalist id="subjects-list">
              {subjects.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
          <SelectGroup label="Lớp" icon={<ClassIcon />} name="grade" value={formData.grade} onChange={handleSelectChange} options={grades} />
          <SelectGroup label="Loại câu hỏi" icon={<ListIcon />} name="questionType" value={formData.questionType} onChange={handleSelectChange} options={questionTypes} />
          <InputGroup label="Số lượng" icon={<NumberIcon />} name="quantity" value={formData.quantity} onChange={handleInputChange} />
          <SelectGroup label="Mức độ" icon={<LevelIcon />} name="difficulty" value={formData.difficulty} onChange={handleSelectChange} options={difficulties} />
          <div className="relative md:col-span-2">
            <InputGroup 
              label="Chủ đề" 
              icon={<TopicIcon />} 
              name="topic" 
              value={topicQuery} 
              onChange={handleTopicChange} 
              placeholder="VD: Phép cộng đặt tính" 
              onFocus={() => setIsTopicFocused(true)}
              onBlur={() => setTimeout(() => setIsTopicFocused(false), 200)} // Delay to allow click on suggestion
            />
            {isTopicFocused && topicSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
                {topicSuggestions.map(suggestion => (
                  <li key={suggestion} onMouseDown={() => handleSuggestionClick(suggestion)} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-sky-50/80 rounded-xl p-4 space-y-4 shadow-inner">
        <h2 className="text-md font-semibold text-gray-700 flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-blue-500" />
          Tùy chọn nâng cao
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectGroup label="Loại bài tập" icon={<ExerciseIcon />} name="exerciseType" value={formData.exerciseType} onChange={handleSelectChange} options={exerciseTypes} />
            <SelectGroup label="Phong cách" icon={<ToneIcon />} name="tone" value={formData.tone} onChange={handleSelectChange} options={tones} />
        </div>
        <div className="pt-2 space-y-2">
            <label className="flex items-center gap-3 text-gray-600 cursor-pointer">
              <input type="checkbox" name="includeAnswers" checked={formData.includeAnswers} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
              Kèm theo đáp án và lời giải
            </label>
            <label className="flex items-center gap-3 text-gray-600 cursor-pointer">
              <input type="checkbox" name="useLatex" checked={formData.useLatex} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
              Sử dụng định dạng Toán nâng cao (đặt tính LaTeX)
            </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="additionalRequirements" className="block text-md font-semibold text-gray-700">Yêu cầu bổ sung:</label>
        <textarea
          id="additionalRequirements"
          name="additionalRequirements"
          value={formData.additionalRequirements}
          onChange={handleInputChange}
          rows={3}
          placeholder="VD: Tạo bài có đặt phép tính theo cột dọc, sử dụng số lớn hơn 100..."
          className="w-full px-4 py-2 text-gray-700 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gray-400 rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <EyeIcon />
          Xem trước
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
