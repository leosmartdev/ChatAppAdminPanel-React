import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: false,
  settings: [],
  settingsList: []
};

const slice = createSlice({
  name: 'settings',
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
    // GET Settings
    getSettingsSuccess(state, action) {
      state.isLoading = false;
      state.settingsList = action.payload;
    },
    // DELETE Setting
    deleteSetting(state, action) {
      const deleteSetting = filter(state.settingsList, (setting) => setting._id !== action.payload);
      state.settingsList = deleteSetting;
    }
  }
});

// Reducer
export default slice.reducer;
// Actions
export const { deleteSetting } = slice.actions;

// ----------------------------------------------------------------------

export function getSettingsList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/settings');
      // console.log(response.data.settings);
      dispatch(slice.actions.getSettingsSuccess(response.data.settings));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
