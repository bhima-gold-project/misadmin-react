import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedStylecodes: [],
  importDataIn: [],
  importDataSg: [],
  deliveryStatusData: [],
  productAttrs:[]
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
      setProductAttrs: (state, action) => {
      state.productAttrs = action.payload;
    },
  },
});

export const { setSelectedStylecodes, setDeliveryStatusData, setImportedDataIn, setImportedDataSg,setProductAttrs } = sliceData.actions;

export default sliceData.reducer;
