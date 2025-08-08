import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, userAnswer } = body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "Grade the following answer to the question: " +
        question +
        ". The user's answer is: " +
        userAnswer +
        ". Provide a score from 0 to 1 based on correctness and relevance. Include a brief explanation of the grading criteria used.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: {
              type: Type.NUMBER,
            },

            criteria: {
              type: Type.STRING,
            },
          },
          required: ["grade", "criteria"],
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
