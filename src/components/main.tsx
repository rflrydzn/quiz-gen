"use client";
import Quiz from "./Quiz";
import QuizSettings from "./QuizSettings";
import React, { useEffect } from "react";
const MainUI = () => {
  const [quizData, setQuizData] = React.useState<any>(null);
  return (
    <div className="flex">
      <div className="w-1/3">
        <QuizSettings onGenerate={(data) => setQuizData(data)} />
      </div>

      <div className="w-3/4">
        <Quiz />
        {quizData && (
          <div className="border-2 p-4 mt-4">
            <h2 className="text-lg font-bold mb-2">Generated Quiz</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(quizData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainUI;
