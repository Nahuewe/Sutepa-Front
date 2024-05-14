import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
const CalendarioChart = () => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <div className="flex justify-center flex-wrap items-center">
      <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse ">
        <div className="date-range-custom relative ">
          <Datepicker
            i18n={"es-AR"}
            startWeekOn="mon"
            value={value}
            inputClassName="input-class"
            containerClassName="container-class"
            onChange={handleValueChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarioChart;
