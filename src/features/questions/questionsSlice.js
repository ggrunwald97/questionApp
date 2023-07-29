import { createSlice } from '@reduxjs/toolkit';

/**
  Question / Answer shape:
  questions: [
    {
      questionText: '',
      answerText: ''
    }
  ]
 */

const initialState = {
  questions: [
    {}
  ],

};


export const questionsSlice = createSlice({
  name: 'questionsAndAnswers',
  initialState,
  reducers: {
    setQuestionOrAnswer: (state, action) => {
      state.questions = (action.payload);
    },
  },
});

export const { setQuestionOrAnswer } = questionsSlice.actions;

export default questionsSlice.reducer;
