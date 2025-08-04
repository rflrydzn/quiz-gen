import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileUrl, quizStyle, difficulty, numberOfItems, types } = body;

    if (!fileUrl || !types || !difficulty || !numberOfItems || !quizStyle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch and convert file to base64
    const fileResponse = await fetch(fileUrl);
    const fileBuffer = await fileResponse.arrayBuffer();
    const base64Pdf = Buffer.from(fileBuffer).toString("base64");

    // Format quiz prompt
    const typeBreakdown = types
      .map(
        (t: { type: string; percentage: number }) =>
          `${t.percentage}% ${t.type}`
      )
      .join(", ");

    const prompt = `Create a ${quizStyle.toLowerCase()} quiz from the PDF with ${numberOfItems} questions. 
Use ${typeBreakdown}. Difficulty should be ${difficulty.toLowerCase()}. 
Provide only the questions and answers in JSON.`;

    // Define dynamic schema
    let schemaProperties: any = {};
    let propertyOrdering: string[] = [];

    if (quizStyle === "flashcard") {
      schemaProperties = {
        type: { type: Type.STRING },
        front: { type: Type.STRING },
        back: { type: Type.STRING },
      };
      propertyOrdering = ["type", "front", "back"];
    } else if (quizStyle === "practice") {
      schemaProperties = {
        question: { type: Type.STRING },
        type: { type: Type.STRING },
        difficulty: { type: Type.STRING },
        choices: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        answer: { type: Type.STRING },
        hint: { type: Type.STRING },
        explanation: { type: Type.STRING },
      };
      propertyOrdering = [
        "question",
        "type",
        "difficulty",
        "choices",
        "answer",
        "hint",
        "explanation",
      ];
    } else {
      // Default to exam-style
      schemaProperties = {
        question: { type: Type.STRING },
        type: { type: Type.STRING },
        difficulty: { type: Type.STRING },
        choices: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        answer: { type: Type.STRING },
      };
      propertyOrdering = [
        "question",
        "type",
        "difficulty",
        "choices",
        "answer",
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Pdf,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: schemaProperties,
            propertyOrdering,
          },
        },
      },
    });

    const resText = await response.text;
    if (!resText) {
      return NextResponse.json({ error: "Empty response from Gemini" });
    }

    const resJson = JSON.parse(resText);
    return NextResponse.json(resJson);
  } catch (err) {
    console.error("Gemini Error", err);
    return NextResponse.json(
      { error: "Server error", details: err },
      { status: 500 }
    );
  }
}
