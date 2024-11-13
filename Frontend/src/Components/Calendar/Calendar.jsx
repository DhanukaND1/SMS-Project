import React, { useState, useEffect } from 'react';
import './Calendar.css';
import { Calendar as Calend, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Footer from '../Footer/Footer.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import useSessionTimeout from '../../Hooks/useSessionTimeout.jsx'
import  {Link} from 'react-router-dom'

const Calendar = () => {
  const localizer = momentLocalizer(moment);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [addFormData, setAddFormData] = useState({ id:'', eventTitle: '', start: '', end: '' });
  const [editFormData, setEditFormData] = useState({id:'', eventTitle: '', start: '', end: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const sessionExpired = useSessionTimeout();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
        setRole(response.data.role);
        setName(response.data.name);
      } catch (error) {
        console.error('Error fetching role:', error.response ? error.response.data : error.message);
      }
    };
    fetchRole();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/get-events', {
        params: {
          role,
          name,
        },
      });
      setEvents(response.data.map(event => ({
        ...event,
        start:  moment.utc(event.start).local().toDate(),
        end:  moment.utc(event.end).local().toDate(),
        allDay: false,
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [role, name]);

  const handleDayClick = (slotInfo) => {

     // Get the currently viewed month's start and end dates
  const currentMonthStart = moment(currentViewDate).startOf('month');
  const currentMonthEnd = moment(currentViewDate).endOf('month');

  // Check if the selected date falls within the current month
  const isOffRange = moment(slotInfo.start).isBetween(currentMonthStart, currentMonthEnd, 'day', '[]');

  if (isOffRange) {
    const formattedDate = moment(slotInfo.start).format("YYYY-MM-DDTHH:mm");
    setSelectedDate(formattedDate);
    setAddFormData({ ...addFormData, start: formattedDate, end: formattedDate });
    setShowAddForm(true);
  }
};

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEditFormData({
      eventTitle: event.title,
      start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
    });
    setShowEditForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setSelectedDate(null);
    setAddFormData({ id: '', eventTitle: '', start: '', end: '' });
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setSelectedEvent(null);
    setEditFormData({ id: '', eventTitle: '', start: '', end: '' });
  };

  

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    if (new Date(addFormData.start) >= new Date(addFormData.end)) {
      toast.warn('End time must be after start time.');
      return;
    }

    const newEvent = {
      id: uuidv4(),
      title: addFormData.eventTitle,
      start: new Date(addFormData.start).toISOString(),
      end: new Date(addFormData.end).toISOString(),
      allDay: false,
      role,
      name,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    
    try {
      const response = await axios.post('http://localhost:5001/api/events', newEvent);
      await fetchEvents();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error saving event:', error);
    }finally{
      closeAddForm();
      setEditFormData({ id:'', eventTitle: '', start: '', end: '' });
    }

  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (new Date(editFormData.start) >= new Date(editFormData.end)) {
      toast.warn('End time must be after start time.');
      return;
    }

    const updatedEvent = {
      ...selectedEvent,
      title: editFormData.eventTitle,
      start: new Date(editFormData.start),
      end: new Date(editFormData.end),
    };

    try {
      const response = await axios.put(`http://localhost:5001/api/events/${selectedEvent._id}`, updatedEvent);
      await fetchEvents();

      if(response.data.message === 'Event updated successfully'){
      toast.success(response.data.message);
      }else if(response.data.message === 'Event not found'){
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response.data.message);
    }finally {
      closeEditForm();
      setEditFormData({ id:'', eventTitle: '', start: '', end: '' });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/events/${selectedEvent._id}`);
      await fetchEvents();
      closeEditForm();
      setEditFormData({ eventTitle: '', start: '', end: '' });

      if(response.data.message === 'Event deleted successfully'){
        toast.success(response.data.message);
        }else if(response.data.message === 'Event not found'){
          toast.warn(response.data.message);
        }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response.data.message);
    }finally {
      closeEditForm();
      setEditFormData({ id:'', eventTitle: '', start: '', end: '' });
    }
  };


  if (sessionExpired) {
    return (
      <div className="session-expired-overlay">
        <div className="session-expired-message">
          <h2><i class='bx bxs-error warning'></i>Session Expired</h2>
          <p>Your session has expired. Please log in again.</p>
          <Link to="/login" className='link'>Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <section id="home">
        <div className='calc'>
          <Calend
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleDayClick}
            views={{ month: true, agenda: true }}
            onSelectEvent={handleSelectEvent}
            onNavigate={(date) => setCurrentViewDate(date)}
          />
        </div>
      </section>

      {showAddForm && (
        <div className="date-agenda">
          <div className="agenda-content">
            <h3>Add Event on {selectedDate && new Date(selectedDate).toLocaleDateString()}</h3>
            <i className="fa-solid fa-xmark" onClick={closeAddForm}></i>
            <form onSubmit={handleSubmitAdd}>
              <label>Event Title</label>
              <input type="text" name="eventTitle" value={addFormData.eventTitle} onChange={handleAddChange} required />

              <label>Start Time</label>
              <input type="datetime-local" name='start' value={addFormData.start} onChange={handleAddChange} required />

              <label>End Time</label>
              <input type="datetime-local" name='end' value={addFormData.end} onChange={handleAddChange} required />

              <button type="submit" className='save-btn'>Save Event</button>
            </form>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="date-agenda">
          <div className="agenda-content">
            <h3>Edit Event on {selectedEvent && new Date(selectedEvent.start).toLocaleDateString()}</h3>
            <i className="fa-solid fa-xmark" onClick={closeEditForm}></i>
            <form onSubmit={handleSubmitEdit}>
              <label>Event Title</label>
              <input type="text" name="eventTitle" value={editFormData.eventTitle} onChange={handleEditChange} required />

              <label>Start Time</label>
              <input type="datetime-local" name='start' value={editFormData.start} onChange={handleEditChange} required />

              <label>End Time</label>
              <input type="datetime-local" name='end' value={editFormData.end} onChange={handleEditChange} required />

               <div className="calc-btns">
              <button type="submit" className='cal-btn'>Edit Event</button>
              <button type="button" className='cal-btn' onClick={handleDeleteEvent}>Delete Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Calendar;
