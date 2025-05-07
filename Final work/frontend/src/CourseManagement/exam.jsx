import React, { useState, useEffect } from "react";
import axios from "axios";

const Exam = () => {
  const [questions, setQuestions] = useState([
    {
      questionText: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctOption: "Paris",
    },
    {
      questionText: "What is the largest planet in our solar system?",
      options: ["Earth", "Saturn", "Jupiter", "Uranus"],
      correctOption: "Jupiter",
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  //  useEffect(() => {
  //  const fetchQuestions = async () => {
  //  try {
  //  const response = await axios.get('/api/questions');
  //  setQuestions(response.data);
  //  } catch (error) {
  //  console.error(error);
  //  };
  //  };
  //  fetchQuestions();
  //  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption === questions[currentQuestion].correctOption) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
    setSelectedOption(null);
  };

  if (questions.length === 0) {
    return <p>Loading...</p>;
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div>
      <h1>Exam</h1>
      {currentQuestionData && (
        <div>
          <h2>{currentQuestionData.questionText}</h2>
          <ul>
            {currentQuestionData.options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleOptionSelect(option)}
                  style={{
                    backgroundColor:
                      selectedOption === option ? "lightblue" : "",
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Next</button>
          <p>Score: {score}</p>
        </div>
      )}
      {/* {currentQuestion >= questions.length && (
        <p>Exam completed! Your final score is: {score}</p>
      )} */}
      {currentQuestion >= questions.length && (
        <div>
          <h2>Exam completed!</h2>
          <p>Your final score is: {score}</p>
        </div>
      )}
    </div>
  );
};

export default Exam;
