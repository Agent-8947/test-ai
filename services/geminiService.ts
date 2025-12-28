
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { ProjectData, TestResult } from '../types';

export const analyzeProject = async (project: ProjectData): Promise<TestResult[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fileSummary = project.files.map(f => {
    const truncatedContent = f.content.length > 2000 ? f.content.substring(0, 2000) + '... [truncated]' : f.content;
    return `FILE: ${f.path}\nCONTENT:\n${truncatedContent}\n---`;
  }).join('\n');

  const prompt = `
    Analyze the following software project: "${project.name}".
    Files provided:
    ${fileSummary}

    You are a Senior Staff QA Engineer. Perform exactly 10 core audit tests.
    For each test, provide a unique ID (e.g., 'logic-01'), name, success status, detailed logs, and a suggested fix if it fails.
    
    CRITICAL: For failed tests, you MUST include a "fix_patch" object that provides a structured code replacement.
    
    Tests to run:
    1. Logic 2. Mounting 3. Dependencies 4. XSS 5. Bundle Size 6. FCP 7. A11y 8. SEO 9. Mobile 10. Quality.

    Return the results strictly as a JSON array of objects with the following schema:
    [
      {
        "id": string,
        "testName": string,
        "success": boolean,
        "logs": string[],
        "suggestedFix": string (detailed text explanation),
        "executionTime": number (ms),
        "codeExcerpt": string (problematic code block),
        "fix_patch": {
          "file": string (path to file),
          "action": "replace",
          "original_code": string (the exact string to find),
          "new_code": string (the code to replace it with)
        }
      }
    ]
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    const text = response.text || '[]';
    return JSON.parse(text) as TestResult[];
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw new Error('Failed to analyze project. Context might be too large or the model is overloaded.');
  }
};
