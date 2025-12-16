
"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStartDate, setEndDate } from "../redux/slice"; 
import { startOfDay, endOfDay, format, parseISO } from "date-fns";

const DateRangePickerPopup = () => {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state) => state);

  // Initialize local state from Redux or today
  const today = new Date();
  const [start, setStart] = useState(startDate ? parseISO(startDate) : today);
  const [end, setEnd] = useState(endDate ? parseISO(endDate) : today);

  // Handle start date change
  const handleStartChange = (e) => {
    const selected = startOfDay(new Date(e.target.value));
    setStart(selected);
    dispatch(setStartDate(format(selected, "yyyy-MM-dd HH:mm:ss.SSS")))
  };

  // Handle end date change
  const handleEndChange = (e) => {
    const selected = endOfDay(new Date(e.target.value));
    setEnd(selected);
    dispatch(setEndDate(format(selected, "yyyy-MM-dd HH:mm:ss.SSS"))); 
  };

  return (
    <div className="flex gap-4 items-center ">
      <div className=" max-w-[300px] w-full">
        <label className="block text-sm font-semibold text-[#8a5a20]">
          From Date
        </label>
        <input
          type="date"
          value={format(start, "yyyy-MM-dd")}
          onChange={handleStartChange}
          className="border-2 border-amber-300  outline-amber-200 p-2 rounded w-full"
        />
      </div>

    <div className=" max-w-[300px] w-full">
        <label className="block text-sm font-semibold text-[#8a5a20]">
          To Date
        </label>
        <input
          type="date"
          value={format(end, "yyyy-MM-dd")}
          onChange={handleEndChange}
          className="border-2 border-amber-300 p-2 outline-amber-200 rounded w-full"
        />
      </div>
    </div>
  );
};

export default DateRangePickerPopup;

