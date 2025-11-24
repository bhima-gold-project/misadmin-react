import { createSlice } from "@reduxjs/toolkit";

const bmcSlice = createSlice({
  name: "bmc",
  initialState: {
    bmcReportData: [],
  },
  reducers: {
    setBmcReportData: (state, action) => {
      state.bmcReportData = action.payload;
    },
  },
});

export const { setBmcReportData } = bmcSlice.actions;

export default bmcSlice.reducer;
