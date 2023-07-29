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
import { addQuestion, updateQuestionWithAnswer } from '../features/questions/questionsThunk';
import { useFormik } from 'formik';
import QuestionsTable from './QuestionAnswerTable';

const Questions = () => {
  const [foundAnswer, setFoundAnswer] = React.useState(undefined);
  const [helperText, setHelperText] = React.useState('');
  const options = useSelector(state => state.questionsAndAnswers.questions)
  const dispatch = useDispatch();

  // formik IDS
  const questionId = 'question';
  const answerId = 'answer';

  const formik = useFormik({
    initialValues: {
      question: '',
      answer: '',
    },
  })

  // Search for answers for questions that are already in the store, and update boolean state variables accordingly.
  useEffect(() => {
    if ((formik.values.question)) {
      // look for the question in the list. If we find a match then check for the answer.
      const foundQuestion = options.find((question) => ((question.questionText === formik.values.question.questionText) && question.answerText));
      const foundAnswer = foundQuestion && foundQuestion.answerText ? foundQuestion.answerText : undefined;
      if (foundAnswer) {
        setFoundAnswer(foundAnswer);
      } else {
        setFoundAnswer(undefined);
      }
    } else {
      // question was empty.
      setFoundAnswer(undefined);
    }
  }, [formik.values.question, formik.values.answer])

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
  }

  useEffect(() => {
    if (formik.values.question && !!foundAnswer) {
      setHelperText('That question has an answer already.');
    } else if (formik.values.question && formik.values.answer) {
      setHelperText('Both fields are filled out. You can submit the question and answer now.');
    } else if (formik.values.question && !foundAnswer) {
      setHelperText('You have entered a question. Please enter an answer.');
    } else if (!formik.values.question && formik.values.answer) {
      setHelperText('You have entered an answer. Please enter a question.');
    } else {
      setHelperText('Please enter a question and answer.');
    }

  }, [formik.values.question, formik.values.answer, foundAnswer])

  const questionGridItem = (
    <>
      <Grid item xs={12}>
        <Typography>
          {helperText}
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Autocomplete
          sx={{marginTop: 2}}
          id="question"
          freeSolo
          fullWidth
          options={options}
          getOptionLabel={(option) => option.questionText ? option.questionText : ''}
          includeInputInList
          onBlur={formik.handleBlur}
          onChange={(e, newValue) => {
            formik.setFieldValue(questionId, newValue);
            if (newValue && formik.values.answer) {
              setFoundAnswer(undefined);
              formik.setFieldValue(answerId, '');
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Question"
              variant="outlined"
              helperText="Enter your question here"
              onChange={(e) => {
                if (e.target.value) {
                  formik.setFieldValue(questionId, e.target.value);
                  if (formik.values.answer && e.target.value.length === 1) {
                    setFoundAnswer(undefined);
                    formik.setFieldValue(answerId, '');
                  }
                }
              }}
            />
          )}
        />
        <Button padding={2}
          onClick={() => handleSubmitQuestion()}
          disabled={!formik.values.question || foundAnswer}
        >
          Submit Question
        </Button>
      </Grid>
    </>
  )

  const answerGridItem = (
    <>
      <Grid item md={6} xs={12}>
        {foundAnswer ? (
          <Box>
            <Paper elevation={2}>
              <Box padding={2} marginBottom={.5}>
                {foundAnswer}
              </Box>
            </Paper>
          </Box>
        ) : (
          <>
            <TextField
              id="answer"
              sx={{marginTop: 2}}
              fullWidth
              value={formik.values.answer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Answer"
              variant="outlined"
              helperText="Enter your answer here"
            />
          </>
        )}
        <Button
          disabled={!formik.values.answer || !formik.values.question || foundAnswer}
          onClick={() => handleSubmitAnswer()}
        >
          Submit Answer
        </Button>
      </Grid>
    </>
  )

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <Grid container spacing={2} direction="row" alignItems="center">
          {questionGridItem}
          {answerGridItem}
        </Grid>
      </Paper>
      <QuestionsTable options={options} />
    </>

  )
}

export default Questions;
