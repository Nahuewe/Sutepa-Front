import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import dayjs from "dayjs";
import Icon from "@/components/ui/Icon";
const HomeBredCurbs = ({ title, fnReport }) => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
    fnReport(newValue);
  };
  
  return (
    <div className="flex justify-center flex-wrap items-center ">
      <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
        <div className="date-range-custom relative">
          <Datepicker
            i18n={"es-AR"}
            startWeekOn="mon"
            value={value}
            inputClassName="input-class w-full py-2"
            containerClassName="container-class"
            onChange={handleValueChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBredCurbs;
