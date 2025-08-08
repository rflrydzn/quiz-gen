"use client";
import Quiz from "./Quiz";
import QuizSettings from "./QuizSettings";
import React, { useEffect, useState } from "react";
import QuizRenderer from "./quizRenderer";
const MainUI = () => {
  const [quizId, setQuizId] = useState<any>(null);
  useEffect(() => console.log("quiz id received from main", quizId), []);
  return (
    <div className="flex">
      <div className="w-1/3">
        <QuizSettings onGenerate={(data) => setQuizId(data)} />
      </div>

      <div className="w-3/4">
        {quizId ? (
          <QuizRenderer quizId={quizId} />
        ) : (
          <p className="text-gray-500">Generate a quiz to see it here.</p>
        )}
      </div>
    </div>
  );
};

export default MainUI;
