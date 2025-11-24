import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedStylecodes: [],
  importDataIn: [],
  importDataSg: [],
  deliveryStatusData: [],
};

const sliceData = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedStylecodes: (state, action) => {
      state.selectedStylecodes = action.payload;
    },
    setImportedDataIn: (state, action) => {
      state.importDataIn = action.payload;
    },
    setImportedDataSg: (state, action) => {
      state.importDataSg = action.payload;
    },
    setDeliveryStatusData: (state, action) => {
      state.deliveryStatusData = action.payload;
    },
  },
});

export const { setSelectedStylecodes, setDeliveryStatusData, setImportedDataIn, setImportedDataSg } = sliceData.actions;

export default sliceData.reducer;
