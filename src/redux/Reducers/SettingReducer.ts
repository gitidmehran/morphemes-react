import { createSlice } from "@reduxjs/toolkit";

export interface RootState {
  morphemeSwitch: boolean;
  wordSwitch: boolean;
  darkMode: boolean;
  quranicWords: boolean;
  fonts: string;
  fontSize: number;
  color: string;
  language: any;
  activeKey: any;
}

const initialState: RootState = {
  morphemeSwitch: false,
  wordSwitch: false,
  darkMode: false,
  quranicWords: false,
  fonts: "",
  fontSize: 16,
  color: "#1677FF",
  language: ["English"],
  activeKey:[]
};

export const SettingReducer = createSlice({
  name: "SettingReducer",
  initialState,
  reducers: {
    setWordSwitch: (state, action) => {
      return {
        ...state,
        wordSwitch: action.payload,
      };
    },
    setMorphemeSwitch: (state, action) => {
      return {
        ...state,
        morphemeSwitch: action.payload,
      };
    },
    setDarkMode: (state, action) => {
      return {
        ...state,
        darkMode: action.payload,
      };
    },
    setQuranicWords: (state, action) => {
      return {
        ...state,
        quranicWords: action.payload,
      };
    },
    setFonts: (state, action) => {
      return {
        ...state,
        fonts: action.payload,
      };
    },
    setFontSize: (state, action) => {
      return {
        ...state,
        fontSize: action.payload,
      };
    },
    setColor: (state, action) => {
      return {
        ...state,
        color: action.payload,
      };
    },
    setLanguage: (state, action) => {
      return {
        ...state,
        language: action.payload,
      };
    },
    setGroupActiveKey: (state, action) => {
      return {
        ...state,
        activeKey: action.payload,
      };
    },
  },
});

export const {
  setMorphemeSwitch,
  setWordSwitch,
  setDarkMode,
  setQuranicWords,
  setFonts,
  setFontSize,
  setColor,
  setLanguage,
  setGroupActiveKey,
} = SettingReducer.actions;
export default SettingReducer.reducer;
