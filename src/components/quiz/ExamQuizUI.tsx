"use client";
export default function ExamQuizUI({ quiz, questions }: any) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{quiz.style} Quiz</h2>
      {questions.map((q: any, index: number) => (
        <div key={q.id} className="border p-4 rounded-lg mb-4">
          <p className="font-semibold">
            {index + 1}. {q.question}
          </p>
          {q.choices && (
            <ul className="mt-2 space-y-1">
              {q.choices.map((choice: string, i: number) => (
                <li key={i} className="border p-2 rounded">
                  {choice}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
