import React, { useState } from 'react';
import { Grid, Autocomplete, TextField, Button } from "@mui/material";
import { addAnswer, addQuestion } from './features/questions/questionsSlice';
import { useDispatch, useSelector } from 'react-redux';

const Questions = () => {
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const options = useSelector(state => state.questionsAndAnswers.questions)
    const dispatch = useDispatch();

    const handleTextAreaInput = async () => {
        dispatch(addAnswer(currentAnswer));
    }

    const handleAutocompleteInput = () => {
        dispatch(addQuestion(currentQuestion));
    }



    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                    <Autocomplete
                        options={options}
                        getOptionLabel={() => {options}}
                        includeInputInList
                        value={currentQuestion}
                        renderInput={(params) => (
                            <TextField value={currentAnswer} {...params} label="autoComplete" variant="outlined" />
                        )}
                        helperText="Enter your question here"
                        onChange={(e, newValue) => setCurrentQuestion(newValue)}
                    />
                    <Button
                        onClick={() => handleAutocompleteInput()}
                    >
                        Submit Question
                    </Button>
                </Grid>
                <Grid item xs={6}>
                <TextField
                    value={currentAnswer}
                    onChange={(e) => {
                        setCurrentAnswer(e.target.value)
                    }}
                    label="Answer"
                    variant="outlined"
                    helperText="Enter your answer here"
                />
                <Button
                    onClick={() => handleTextAreaInput(currentAnswer)}
                >
                    Submit
                </Button>
                </Grid>
            </Grid>
            <Grid container justifyContent={'flex-end'}>
                <Grid item xs={6}>
                    
                </Grid>
            </Grid>
        </>
    )
}

export default Questions;