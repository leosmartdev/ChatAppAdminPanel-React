import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: false,
  words: [],
  wordList: []
};

const slice = createSlice({
  name: 'blocklimitedword',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // GET USERS
    getWordsSuccess(state, action) {
      state.isLoading = false;
      state.wordList = action.payload;
    },
    // DELETE Word
    deleteWord(state, action) {
      const deleteWord = filter(state.wordList, (word) => word._id !== action.payload);
      state.wordList = deleteWord;
    }
  }
});

// Reducer
export default slice.reducer;
// Actions
export const { deleteWord } = slice.actions;

// ----------------------------------------------------------------------

export function getWordList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/block-limited-words');
      dispatch(slice.actions.getWordsSuccess(response.data.limitblockwords));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
