import { Box, Grid, Table, TableContainer, TableBody, TableRow, TableHead, TableCell, Paper } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const QuestionsTable = ({ options }) => {

  return (
    <Box paddingTop={16}>
      <Grid container justifyContent={'center'}>
        <Grid item>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 250 }} aria-label="question table">
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell align="right">Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {options && options.map((option) => (
                  <TableRow
                    key={option.questionText}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {option.questionText}
                    </TableCell>
                    <TableCell align="right">{option.answerText}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

QuestionsTable.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    questionText: PropTypes.string.isRequired,
    answerText: PropTypes.string,
  })).isRequired,
};

export default QuestionsTable
