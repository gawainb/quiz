import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
  title: string;
  text: string;
  options: string[];
  answerIndex: number;
  setCorrect: () => void;
  setFailed: (failed: boolean) => void;
};

export default function QuizQuestion({
  title,
  text,
  options,
  answerIndex,
  setCorrect,
  setFailed,
}: Props) {
  function submitQuestion(submittedAnswer: number) {
    if (answerIndex === submittedAnswer) {
      setCorrect();
    } else {
      setFailed(true);
    }
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{text}</p>
      {options.map((option, index) => (
        <button
          className={styles.quizQuestionButton}
          onClick={() => submitQuestion(index)}
          key={index}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
