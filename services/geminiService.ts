import { GoogleGenAI } from "@google/genai";
import type { FormDataState } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuestions(formData: FormDataState): Promise<string> {
  const prompt = `
    Bạn là một chuyên gia tạo tài liệu giáo dục cho học sinh tiểu học tại Việt Nam.
    Hãy tạo một bộ câu hỏi dựa trên các tiêu chí sau đây. Phải trả lời bằng tiếng Việt.

    - Môn học: ${formData.subject}
    - Lớp: ${formData.grade}
    - Loại câu hỏi: ${formData.questionType}
    - Số lượng: ${formData.quantity}
    - Mức độ: ${formData.difficulty}
    - Chủ đề: ${formData.topic}
    - Loại bài tập: ${formData.exerciseType}
    - Phong cách: ${formData.tone}
    - Yêu cầu bổ sung: ${formData.additionalRequirements || 'Không có'}

    QUY TẮC ĐỊNH DẠNG:
    - Bắt buộc trả về kết quả ở định dạng Markdown.
    - ${formData.includeAnswers ? 'Với mỗi câu hỏi, hãy cung cấp đáp án và lời giải chi tiết, dễ hiểu cho học sinh.' : 'Chỉ cung cấp câu hỏi, không kèm đáp án hay lời giải.'}
    - ${formData.useLatex ? 'Sử dụng LaTeX cho tất cả các công thức và biểu thức toán học. Ví dụ, với phép tính đặt theo cột dọc, hãy định dạng nó bằng môi trường \\begin{array}{r} ... \\end{array} của LaTeX. Bao quanh tất cả các biểu thức LaTeX bằng dấu đô la đơn ($) hoặc kép ($$).' : 'Không sử dụng định dạng LaTeX.'}

    Bắt đầu tạo câu hỏi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to generate questions. Please check the API configuration and try again.");
  }
}
