// "use client";
// import { useEffect, useState, useRef, use } from "react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";
// import { createClient } from "@/utils/supabase/client";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { X } from "lucide-react";
// import questions from "@/../exam.json";
// import quiz from "@/../examq.json";
// type quiz = {
//   id: string;
//   user_id: string;
//   created_at: string;
//   difficulty: string;
//   number_of_items: number;
//   source_file_url?: string;
//   source_text?: string;
//   style: string;
//   status: string;
// };

// type question = {
//   id: string;
//   quiz_id: string;
//   answer: string;
//   back: string;
//   choices: string[];
//   created_at: string;
//   difficulty: string;
//   explanation: string;
//   front: string;
//   hint: string;
//   question: string;
//   type: string;
// };

// // const supabase = createClient();

// export default function ExamQuizUI({}: //   quiz,
// //   questions,
// {
//   //   quiz: quiz;
//   //   questions: question[];
// }) {
//   //   useEffect(() => {
//   //     const loadSavedAnswers = async () => {
//   //       const { data, error } = await supabase
//   //         .from("quiz_answers")
//   //         .select("*")
//   //         .eq("quiz_id", quiz.id)
//   //         .eq("user_id", quiz.user_id);

//   //       if (error) {
//   //         console.error("Error loading saved answers", error);
//   //         return;
//   //       }

//   //       if (data && data.length > 0) {
//   //         const savedUserAnswers: { [key: string]: string } = {};
//   //         const savedFeedback: {
//   //           [questionId: string]: { criteria: string; grade: number };
//   //         } = {};

//   //         let scoreSum = 0;

//   //         for (const answer of data) {
//   //           if (answer.submitted_text !== null) {
//   //             savedUserAnswers[answer.question_id] = answer.submitted_text;
//   //           } else if (answer.selected_choice !== null) {
//   //             savedUserAnswers[answer.question_id] = answer.selected_choice;
//   //           }

//   //           if (answer.ai_feedback) {
//   //             savedFeedback[answer.question_id] = {
//   //               criteria: answer.ai_feedback,
//   //               grade: answer.score ?? 0,
//   //             };
//   //           }

//   //           scoreSum += answer.score ?? 0;
//   //         }

//   //         setUserAnswers(savedUserAnswers);
//   //         setAIFeedback(savedFeedback);
//   //         setScore({
//   //           score: scoreSum,
//   //           totalItems: quiz.number_of_items,
//   //         });
//   //         isSubmitted(true);
//   //       }
//   //     };

//   //     loadSavedAnswers();
//   //   }, [quiz.id, quiz.user_id]);
//   const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

//   const [userAnswers, setUserAnswers] = useState<{
//     [questionId: string]: string;
//   }>({});
//   const [correctAnswers, setCorrectAnswers] = useState<any>([]);
//   const [quizStatus, setQuizStatus] = useState<string>("");
//   const [submitted, isSubmitted] = useState(false);
//   const [score, setScore] = useState<{
//     score: number;
//     totalItems: number;
//   }>();
//   const [aiFeedback, setAIFeedback] = useState<{
//     [questionId: string]: {
//       criteria: string;
//       grade: number;
//     };
//   }>({});

//   const inputRef = useRef<HTMLInputElement>(null);
//   console.log("quiz types", quiz);
//   console.log("questions types", questions);

//   useEffect(() => {
//     const answers = questions.map((q) => q.answer);
//     setCorrectAnswers(answers);
//   }, [questions]);

//   useEffect(() => console.log("user answ", userAnswers), [userAnswers]);

//   console.log("answ", correctAnswers);

//   const handleSubmitScore = async () => {
//     //     let calculatedScore = 0;
//     //     const newAIFeedback: {
//     //       [questionId: string]: {
//     //         criteria: string;
//     //         grade: number;
//     //       };
//     //     } = {};
//     //     isSubmitted(true);
//     //     // Grade all questions
//     //     const gradingPromises = questions.map(async (q) => {
//     //       const userAnswer = userAnswers[q.id];
//     //       if (q.type === "Open-Ended") {
//     //         const res = await getAIGradedScore(q);
//     //         calculatedScore += res?.grade || 0;
//     //         newAIFeedback[q.id] = {
//     //           criteria: res?.criteria,
//     //           grade: res?.grade,
//     //         };
//     //       } else {
//     //         if (userAnswer === q.answer) {
//     //           calculatedScore += 1;
//     //         }
//     //       }
//     //     });
//     //     await Promise.all(gradingPromises);
//     //     setAIFeedback(newAIFeedback);
//     //     setScore({ score: calculatedScore, totalItems: quiz.number_of_items });
//     //     // Now safe to save to DB
//     //     const responses = questions.map((q) => ({
//     //       quiz_id: quiz.id,
//     //       question_id: q.id,
//     //       user_id: quiz.user_id,
//     //       selected_choice: q.type === "Multiple Choice" ? userAnswers[q.id] : null,
//     //       submitted_text: q.type === "Open-Ended" ? userAnswers[q.id] : null,
//     //       ai_feedback:
//     //         q.type === "Open-Ended" ? newAIFeedback[q.id]?.criteria : null,
//     //       score:
//     //         q.type === "Open-Ended"
//     //           ? newAIFeedback[q.id]?.grade
//     //           : q.answer === userAnswers[q.id]
//     //           ? 1
//     //           : 0,
//     //     }));
//     //     // You can now POST `responses` to your backend
//     //     const supabase = createClient();
//     //     const { error } = await supabase.from("quiz_answers").insert(responses);
//     //     if (error) {
//     //       console.error("Error saving to db", error);
//     //     } else {
//     //       console.log("Saved to db");
//     //     }
//     //     const { error: statusError } = await supabase
//     //       .from("quizzes")
//     //       .update({ status: "taken" })
//     //       .eq("id", quiz.id);
//     //     if (statusError) {
//     //       console.error("Error updating quiz status");
//     //     } else {
//     //       ("Marked quiz as taken");
//     //     }
//   };

//   const scrollToNextUnanswered = () => {
//     const unansweredIndex = questions.findIndex((q) => !userAnswers[q.id]);
//     if (unansweredIndex !== -1 && questionRefs.current[unansweredIndex]) {
//       questionRefs.current[unansweredIndex]?.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   };

//   const getAIGradedScore = async (q: any) => {
//     console.log();
//     const res = await fetch("/api/grade-answer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         question: q.question,
//         userAnswer: userAnswers[q.id],
//       }),
//     });
//     if (!res.ok) {
//       const error = await res.json();
//       console.error("Error generating quiz:", error);
//       return;
//     }
//     const data = await res.json();
//     setAIFeedback((prev) => ({
//       ...prev,
//       [q.id]: {
//         criteria: data?.criteria,
//         grade: data?.grade,
//       },
//     }));

//     return data;
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="grid grid-cols-3 items-center border-b p-4">
//         <div>
//           <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
//             Solar system practice exam
//           </h3>
//         </div>
//         <div className="flex justify-center">
//           <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
//             {Object.keys(userAnswers).length} / {questions.length} &middot;
//             20:00
//           </h3>
//         </div>
//         <div className="flex justify-end">
//           <Button variant="ghost">
//             <X />
//           </Button>
//         </div>
//       </div>

//       <div className="mx-32 my-10 ">
//         {/* <div className="flex justify-between">
//         <h2 className="text-2xl font-bold mb-4">Exam Quiz</h2>{" "}
//         <h2>
//           {score?.score}/{score?.totalItems}
//         </h2>
//       </div> */}

//         {questions.map((q: any, index: number) => (
//           <div
//             key={`${q.quiz_id}-${index}`}
//             className="p-4 mb-6 "
//             ref={(el) => (questionRefs.current[index] = el)}
//           >
//             {/* Question Text */}
//             <p className="font-semibold mb-3">
//               {index + 1}. {q.question}
//             </p>

//             {/* Multiple Choice */}
//             {q.type === "Multiple Choice" && q.choices.length > 0 && (
//               <RadioGroup
//                 value={userAnswers[q.quiz_id + index] || ""}
//                 onValueChange={(value) =>
//                   setUserAnswers((prev) => ({
//                     ...prev,
//                     [q.quiz_id + index]: value,
//                   }))
//                 }
//                 className="space-y-2"
//               >
//                 {q.choices.map((choice: string, i: number) => (
//                   <div key={i} className="flex items-center gap-3">
//                     <RadioGroupItem
//                       value={choice}
//                       id={`${q.quiz_id}-${index}-${i}`}
//                     />
//                     <Label htmlFor={`${q.quiz_id}-${index}-${i}`}>
//                       {choice}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             )}

//             {/* True / False */}
//             {q.type === "True/False" && (
//               <RadioGroup
//                 value={userAnswers[q.quiz_id + index] || ""}
//                 onValueChange={(value) =>
//                   setUserAnswers((prev) => ({
//                     ...prev,
//                     [q.quiz_id + index]: value,
//                   }))
//                 }
//                 className="space-y-2"
//               >
//                 {["True", "False"].map((val) => (
//                   <div key={val} className="flex items-center gap-3">
//                     <RadioGroupItem
//                       value={val}
//                       id={`${q.quiz_id}-${index}-${val}`}
//                     />
//                     <Label htmlFor={`${q.quiz_id}-${index}-${val}`}>
//                       {val}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             )}

//             {/* Fill in the Blank */}
//             {q.type === "Fill in the Blank" && (
//               <div className="mt-3">
//                 <Textarea
//                   placeholder="Enter your answer..."
//                   value={userAnswers[q.quiz_id + index] || ""}
//                   onChange={(e) =>
//                     setUserAnswers((prev) => ({
//                       ...prev,
//                       [q.quiz_id + index]: e.target.value,
//                     }))
//                   }
//                   className="w-full"
//                 />
//               </div>
//             )}

//             {/* Open-Ended */}
//             {q.type === "Open-Ended" && (
//               <div className="mt-3">
//                 <Textarea
//                   placeholder="Write your detailed answer..."
//                   value={userAnswers[q.quiz_id + index] || ""}
//                   onChange={(e) =>
//                     setUserAnswers((prev) => ({
//                       ...prev,
//                       [q.quiz_id + index]: e.target.value,
//                     }))
//                   }
//                   className="w-full"
//                 />
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {aiFeedback[q.quiz_id + index]?.grade ??
//                     "Your answer will be graded by AI."}
//                 </p>
//               </div>
//             )}
//           </div>
//         ))}
//         {/* <Button onClick={handleSubmitScore} hidden={submitted}>
//           Submit
//         </Button> */}
//       </div>
//       <div className="sticky bottom-0 justify-between flex w-full  border-t bg-background p-4">
//         <Button onClick={handleSubmitScore} hidden={submitted} size="lg">
//           Submit test
//         </Button>
//         <Button
//           onClick={scrollToNextUnanswered}
//           hidden={submitted}
//           variant="outline"
//           size="lg"
//         >
//           Next unanswered question
//         </Button>
//       </div>
//     </div>
//   );
// }
