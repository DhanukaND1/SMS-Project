import React , { useState } from 'react';
import './Calendar.css';
import { Calendar as Calend, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Footer from '../Footer/Footer.jsx';

const Calendar = () => {

  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([
    {
      title: '',
      start:'',
      end: '',
      allDay: false,
    },
  ]);
  
  return (
    <div>
      <Sidebar />
    <div className='calc'>
      <Calend
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />

    </div>
    <Footer />
    </div> 
  )
}

export default Calendar