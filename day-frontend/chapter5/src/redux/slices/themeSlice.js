import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: "light",
  },
  reducers: {
    // toggleTheme: (state) => {
    //     state.value = state.value === 'light' ? 'dark' : 'light';
    // }

    changeThemeToLight: (state) => {
      state.value = "light";
    },

    changeThemeToDark: (state) => {
      state.value = "dark";
    },
    changeThemeToBrown: (state) => {
      state.value = "brown";
    },
  },
});

export const { changeThemeToLight, changeThemeToDark, changeThemeToBrown } = themeSlice.actions;
export default themeSlice.reducer;
