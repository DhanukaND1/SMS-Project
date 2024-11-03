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

const Calendar = () => {
  const localizer = momentLocalizer(moment);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ id:'', eventTitle: '', start: '', end: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');

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
        start: new Date(event.start),
        end: new Date(event.end),
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
    const formattedDate = moment(slotInfo.start).format("YYYY-MM-DDTHH:mm");
    setSelectedDate(formattedDate);
    setFormData({ ...formData, start: formattedDate, end: formattedDate });
    setShowAddForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setSelectedDate(null);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      eventTitle: event.title,
      start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
    });
    setShowEditForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    if (new Date(formData.start) >= new Date(formData.end)) {
      toast.warn('End time must be after start time.');
      return;
    }

    const newEvent = {
      id: uuidv4(),
      title: formData.eventTitle,
      start: new Date(formData.start),
      end: new Date(formData.end),
      allDay: false,
      role,
      name,
    };

    try {
      await axios.post('http://localhost:5001/api/events', newEvent);
      await fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }finally {
      closeAddForm();
      setFormData({ eventTitle: '', start: '', end: '' });
    }

  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (new Date(formData.start) >= new Date(formData.end)) {
      toast.warn('End time must be after start time.');
      return;
    }

    const updatedEvent = {
      ...selectedEvent,
      title: formData.eventTitle,
      start: new Date(formData.start),
      end: new Date(formData.end),
    };

    try {
      await axios.put(`http://localhost:5001/api/events/${selectedEvent._id}`, updatedEvent); // Update event by ID
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }finally {
      closeAddForm();
      setFormData({ eventTitle: '', start: '', end: '' });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/events/${selectedEvent._id}`);
      await fetchEvents();
      closeEditForm();
      setFormData({ eventTitle: '', start: '', end: '' });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

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
          />
        </div>
      </section>

      {showAddForm && (
        <div className="date-agenda">
          <div className="agenda-content">
            <h3>Add Event on {selectedDate && new Date(selectedDate).toLocaleDateString()}</h3>
            <button onClick={closeAddForm} className="close-button"><i className="fa-solid fa-xmark"></i></button>
            <form onSubmit={handleSubmitAdd}>
              <label>Event Title</label>
              <input type="text" name="eventTitle" value={formData.eventTitle} onChange={handleChange} required />

              <label>Start Time</label>
              <input type="datetime-local" name='start' value={formData.start} onChange={handleChange} required />

              <label>End Time</label>
              <input type="datetime-local" name='end' value={formData.end} onChange={handleChange} required />

              <button type="submit">Save Event</button>
            </form>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="date-agenda">
          <div className="agenda-content">
            <h3>Edit Event on {selectedEvent && new Date(selectedEvent.start).toLocaleDateString()}</h3>
            <button onClick={closeEditForm} className="close-button"><i className="fa-solid fa-xmark"></i></button>
            <form onSubmit={handleSubmitEdit}>
              <label>Event Title</label>
              <input type="text" name="eventTitle" value={formData.eventTitle} onChange={handleChange} required />

              <label>Start Time</label>
              <input type="datetime-local" name='start' value={formData.start} onChange={handleChange} required />

              <label>End Time</label>
              <input type="datetime-local" name='end' value={formData.end} onChange={handleChange} required />

              <button type="submit">Edit Event</button>
              <button type="button" onClick={handleDeleteEvent}>Delete Event</button>
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
