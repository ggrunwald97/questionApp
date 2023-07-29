import React, { useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion, updateQuestionWithAnswer } from './features/questions/questionsThunk';
import { useFormik } from 'formik';
import QuestionsTable from './Table';

const Questions = () => {
  const [shouldShowAnswer, setShouldShowAnswer] = React.useState(false);
  const [foundAnswer, setFoundAnswer] = React.useState(undefined);
  const [emptyQuestion, setEmptyQuestion] = React.useState(true);
  const options = useSelector(state => state.questionsAndAnswers.questions)
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      question: '',
      answer: '',
    },
  })

  // Search for answers for questions that are already in the store, and update boolean state variables accordingly.
  useEffect(() => {
    if ((formik.values.question)) {
      setEmptyQuestion(false);
      // look for the question in the list. If we find a match then check for the answer.
      const foundQuestion = options.find((question) => ((question.questionText === formik.values.question.questionText) && question.answerText));
      const foundAnswer = foundQuestion && foundQuestion.answerText ? foundQuestion.answerText : undefined;
      if (foundAnswer) {
        setShouldShowAnswer(true);
        setFoundAnswer(foundAnswer);
      } else {
        setShouldShowAnswer(false);
      }
    } else {
      // question was empty.
      setShouldShowAnswer(false);
      setEmptyQuestion(true);
    }
  }, [formik.values.question, formik.values.answer])

  useEffect(() => {
    // upon question change, we should clear the answer and reset shouldShowAnswer.
    if (emptyQuestion) {
      formik.setFieldValue('answer', '');
      setShouldShowAnswer(false);
    }
  }, [emptyQuestion])

  /**
   * handleSubmitQuestion
   * Updates the store with a new question.
   */
  const handleSubmitQuestion = () => {
    dispatch(addQuestion({
      questionText: formik.values.question,
      answerText: undefined,
    }));
  }

  /**
   * handleSubmitAnswer
   * Updates the store with an answer to a question.
   * If the corresponding question is new and has not been submitted yet, it also will submit the question.
   */
  const handleSubmitAnswer = () => {
    dispatch(updateQuestionWithAnswer({
      questionText: formik.values.question?.questionText || formik.values.question,
      answerText: formik.values.answer,
    }));
    setFoundAnswer(formik.values.answer);
    setShouldShowAnswer(true);
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12} marginTop={3}>
        {emptyQuestion ? (
          <Typography>
            Please enter a question below.
          </Typography>
        ) : (
          <Box paddingTop={1}/>
        )}
        <Autocomplete
          id="question"
          noOptionsText='No questions found. Please enter a new question.'
          freeSolo
          options={options}
          getOptionLabel={(option) => option.questionText ? option.questionText : ''}
          includeInputInList
          onBlur={formik.handleBlur}
          onChange={(e, newValue) => {
            formik.setFieldValue('question', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Question"
              variant="outlined"
              helperText="Enter your question here"
              onChange={(e) => {
                if (e.target.value) {
                  formik.setFieldValue('question', e.target.value);
                }
              }}
            />
          )}
        />
          <Button padding={2}
            onClick={() => handleSubmitQuestion()}
            disabled={!formik.values.question || emptyQuestion || shouldShowAnswer}
          >
            Submit Question
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
        {shouldShowAnswer ? (
          <Box paddingTop={1}>
            <Typography>
              That question has an answer:
            </Typography>
            <Paper>
              <Box padding={1}>
                {foundAnswer}
              </Box>
            </Paper>
          </Box>
          ) : (
            <>
              {!emptyQuestion ? (
                <Typography>
                  That question does not have an answer yet. Please enter one below:
                </Typography>
              ) : (
                <Box paddingTop={6} />
              )}
              <TextField
                id="answer"
                fullWidth
                value={formik.values.answer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Answer"
                variant="outlined"
                helperText="Enter your answer here"
              />
              <Button padding={2}
                disabled={emptyQuestion || !formik.values.answer || !formik.values.question}
                onClick={() => handleSubmitAnswer()}
              >
                Submit Answer
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      <QuestionsTable options={options} />
    </>
  )
}

export default Questions;
