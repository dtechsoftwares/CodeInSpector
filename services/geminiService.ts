import { GoogleGenAI, Type, Chat } from "@google/genai";
import { StoredFile, AnalysisReport } from '../types';

const MAX_PROMPT_LENGTH = 300000; // A safe limit to avoid overly large requests

function buildFileContextString(files: StoredFile[], initialPrompt: string): string {
    let content = initialPrompt;
    let currentLength = content.length;

    for (const file of files) {
        if (['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.php', '.json'].some(ext => file.name.endsWith(ext))) {
            const fileEntry = `--- FILE: ${file.name} ---\n${file.content}\n\n`;
            if (currentLength + fileEntry.length > MAX_PROMPT_LENGTH) {
                console.warn(`Skipping file ${file.name} for context as it exceeds prompt limit.`);
                continue;
            }
            content += fileEntry;
            currentLength += fileEntry.length;
        }
    }
    return content;
}


export async function analyzeCode(files: StoredFile[]): Promise<AnalysisReport> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const analysisInstructions = "You are an expert software engineer and code reviewer. Analyze the following collection of website source code files and generate a comprehensive report in JSON format.\n\n**Instructions:**\n1. **Analyze Technologies:** Identify all languages, frameworks (CSS & JS), libraries, and tools used.\n2. **Identify Visual Theme:** Based on the CSS and HTML, determine the visual theme or design system (e.g., 'Minimalist', 'Corporate', 'Dark Mode', 'Neumorphic', 'Material Design').\n3. **Analyze Architecture:** Describe the overall structure, list main pages, find reusable components, and list external dependencies.\n4. **Analyze Data Flow:** Detail all forms, API calls (fetch/xhr), and data submission points. Identify potential security issues like missing validation.\n5. **Suggest Improvements:** Provide actionable recommendations for performance, security, scalability, UX, SEO, and code quality. Prioritize suggestions.\n\n**Source Code Files:**\n\n";

  let promptContent = buildFileContextString(files, analysisInstructions);

  promptContent += "\n**Output Format:**\nStrictly adhere to the provided JSON schema. Do not add any explanatory text, markdown formatting, or comments before or after the JSON object.";

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: {
        type: Type.OBJECT,
        properties: {
          websiteType: { type: Type.STRING, description: "e.g., 'Portfolio', 'E-commerce', 'Blog'" },
          summary: { type: Type.STRING, description: "A brief summary of the website's purpose and technology stack." },
          theme: { type: Type.STRING, description: "The visual theme or design system used, e.g., 'Minimalist', 'Corporate', 'Dark Mode'." },
          technologies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "e.g., 'React', 'Tailwind CSS', 'jQuery'" },
                category: { type: Type.STRING, description: "e.g., 'JavaScript Library', 'CSS Framework', 'Backend Language'" },
              },
              required: ["name", "category"],
            },
          },
        },
        required: ["websiteType", "summary", "theme", "technologies"],
      },
      architecture: {
        type: Type.OBJECT,
        properties: {
          structureSummary: { type: Type.STRING, description: "Summary of how files are organized." },
          pages: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of main HTML files or routes." },
          reusableComponents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g., 'Header', 'Footer', 'Contact Form'" },
          externalLibraries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the library/CDN." },
                url: { type: Type.STRING, description: "The CDN URL if available." },
              },
              required: ["name", "url"],
            },
          },
          assetFolders: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Folders like '/images', '/assets', '/css'." },
        },
        required: ["structureSummary", "pages", "reusableComponents", "externalLibraries"],
      },
      dataFlow: {
        type: Type.OBJECT,
        properties: {
          dataSummary: { type: Type.STRING, description: "Summary of how data is handled." },
          forms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Form ID or name, 'N/A' if none." },
                action: { type: Type.STRING, description: "Form submission URL or action." },
                method: { type: Type.STRING, description: "'GET' or 'POST'." },
                fields: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Names of form input fields." },
              },
              required: ["id", "action", "method", "fields"],
            },
          },
          apiCalls: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                url: { type: Type.STRING, description: "Endpoint URL." },
                method: { type: Type.STRING, description: "HTTP method used." },
                purpose: { type: Type.STRING, description: "What the API call is for." },
              },
              required: ["url", "method", "purpose"],
            },
          },
          securityIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g., 'No client-side validation on contact form', 'API key visible in script.js'" },
        },
        required: ["dataSummary", "forms", "apiCalls", "securityIssues"],
      },
      improvements: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "'Performance', 'Security', 'Scalability', 'UX', 'Code Quality', 'SEO'" },
            suggestion: { type: Type.STRING, description: "Specific improvement suggestion." },
            priority: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" },
          },
          required: ["category", "suggestion", "priority"],
        },
      },
    },
    required: ["overview", "architecture", "dataFlow", "improvements"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: promptContent,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
}

export function createChatWithContext(files: StoredFile[]): Chat {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fileContext = buildFileContextString(files, "CONTEXT: Here is the source code of the project I want to ask questions about. Do not repeat this code in your answers. Use it as a reference to answer my questions accurately.\n\n");
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-pro',
    history: [
      { role: "user", parts: [{ text: fileContext }] },
      { role: "model", parts: [{ text: "Understood. I have analyzed the code. Ask me anything about this project." }] }
    ],
    config: {
        systemInstruction: "You are a helpful AI assistant and an expert software engineer named 'CodeInspector Bot'. You are having a conversation with a developer about the code they've provided. Answer their questions concisely and accurately based on the provided source code files. When providing code snippets, use markdown code blocks.",
    }
  });

  return chat;
}
