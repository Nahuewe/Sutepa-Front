import React from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'

const flatpickrOptions = {
  dateFormat: 'Y-m-d',
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    months: {
      shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    }
  }
}

const DatePicker = ({ value, onChange, id, placeholder, disabled }) => {
  return (
    <Flatpickr
      options={flatpickrOptions}
      className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
      value={value}
      id={id}
      placeholder={placeholder}
      onChange={(dates) => onChange(dates)} // Modificado para enviar la fecha directamente
      disabled={disabled}
    />
  )
}

export default DatePicker
