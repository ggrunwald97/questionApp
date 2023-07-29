import { createAsyncThunk } from "@reduxjs/toolkit";
import { setQuestionOrAnswer } from "./questionsSlice";

// addQuestion will be used to add Questions without Answers.
export const addQuestion = createAsyncThunk(
  'questions/addQuestion',
  async(data, thunkAPI) => {
    const store = thunkAPI.getState();
    let questionsAnswersList = JSON.parse(JSON.stringify(store.questionsAndAnswers.questions));
    // check to see if the question already exists.
    const questionExists = questionsAnswersList.some((question) => question.questionText === data.questionText);
    if (!questionExists) {
      questionsAnswersList.unshift(data);
    } else {
      window.alert('Question already exists. Please enter a new question.');
    }
    thunkAPI.dispatch(setQuestionOrAnswer(questionsAnswersList));

  }
);


// updateQuestion will be used to add Answers to an existing question. However, if the question doesn't exist,
// it will create a new question and answer.
export const updateQuestionWithAnswer = createAsyncThunk(
  'questions/updateQuestionWithAnswer',
  async(data, thunkAPI) => {

    const store = thunkAPI.getState();
    let questionsAnswersList = JSON.parse(JSON.stringify(store.questionsAndAnswers.questions));
    // A question must exist in order to add an answer. However, An answer does not need to always exist. So, we need to filter by questionText.
    const questionIndexToUpdate = questionsAnswersList.findIndex((question) => question.questionText === data.questionText);

    if (questionIndexToUpdate === -1) {
      // question was not found. So, the user never submitted it. In this case, we will add the question and answer.
      const question = {
        questionText: data.questionText,
        answerText: data.answerText
      }
      questionsAnswersList.unshift(question);
      thunkAPI.dispatch(setQuestionOrAnswer(questionsAnswersList));
    } else {
      let updatedQuestion = {
        ...questionsAnswersList[questionIndexToUpdate],
        answerText: data.answerText
      };
      questionsAnswersList.splice(questionIndexToUpdate, 1, updatedQuestion)
      thunkAPI.dispatch(setQuestionOrAnswer(questionsAnswersList));
    }
  }
);
