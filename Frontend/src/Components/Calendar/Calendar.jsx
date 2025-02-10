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
  const [events, setEvents] = useState([[], []]);
  const [addFormData, setAddFormData] = useState({ id:'', eventTitle: '', start: '', end: '' });
  const [editFormData, setEditFormData] = useState({id:'', eventTitle: '', start: '', end: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const {sessionExpired, checkSession} = useSessionTimeout();
  const [isEditing, setIsEditing] = useState(false);

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

        if (response.status === 200) {
            const { allEvents, mentorEvents, sessionEvents } = response.data;

            const newAllEvents = allEvents.map(event => ({
                ...event,
                start: moment.utc(event.start).local().toDate(),
                end: moment.utc(event.end).local().toDate(),
                allDay: false,
                type: 'student'
            }));

            const newMentorEvents = mentorEvents.map(event => ({
                ...event,
                start: moment.utc(event.start).local().toDate(),
                end: moment.utc(event.end).local().toDate(),
                allDay: false,
                type: 'mentor'
            }));

            const newSessionEvents = sessionEvents.map(event => ({
                ...event,
                start: moment(event.start).toDate(),
                end: moment(event.end).toDate(),
                allDay: true,
                type: 'session'
            }));

            const combinedEvents = [...newAllEvents, ...newMentorEvents, ...newSessionEvents];
            setEvents(combinedEvents);
        }
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

const handleSelectEvent = async (event) => {
  setSelectedEvent(event);

  if (event.type === 'session') {
      try {
          const response = await axios.get(`http://localhost:5001/api/sessions/${event.id}`);
          if (response.status === 200) {
              setEditFormData({
                  department: response.data.Department,
                  mentor: response.data.Mentor,
                  year: response.data.Year,
                  students: response.data.Index,
                  date: moment(response.data.Date).format("YYYY-MM-DD"),
                  mode: response.data.SessionMode,
                  note: response.data.AdditionalNote
              });
              setShowEditForm(true);
              setIsEditing(false); // Show details first
          }
      } catch (error) {
          console.error('Error fetching session details:', error);
      }
  } else {
    setEditFormData({
        eventTitle: event.title,
        start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
        end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
    });
    setShowEditForm(true);
    setIsEditing(false);
}
};

// Toggle edit mode when clicking "Edit"
const toggleEditSession = () => {
  setIsEditing(true);
};

const toggleEditEvent = () => {
  setIsEditing(true);
}

// Save and exit edit mode
const handleSaveEditSession = async () => {
  try {
      const updatedSession = {
          Department: editFormData.department,
          Mentor: editFormData.mentor,
          Year: editFormData.year,
          Index: editFormData.students,
          Date: editFormData.date,
          SessionMode: editFormData.mode,
          AdditionalNote: editFormData.note
      };

      const response = await axios.put(`http://localhost:5001/api/sessions/${selectedEvent.id}`, updatedSession);
      if (response.status === 200) {
          toast.success('Session updated successfully!');
          fetchEvents(); // Refresh events
          setIsEditing(false); // Switch back to details mode
      }
  } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session.');
  }
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

  useEffect(() => {
    checkSession(); // Trigger session check on component mount
  }, []);

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

  const handleSubmitEditSession = async () => {
    try {
        const updatedSession = {
            Department: editFormData.department,
            Mentor: editFormData.mentor,
            Year: editFormData.year,
            Index: editFormData.students,
            Date: editFormData.date,
            SessionMode: editFormData.mode,
            AdditionalNote: editFormData.note
        };

        const response = await axios.put(`http://localhost:5001/api/sessions/${selectedEvent.id}`, updatedSession);
        if (response.status === 200) {
            toast.success('Session updated successfully!');
            fetchEvents();
            closeEditForm();
        }
    } catch (error) {
        console.error('Error updating session:', error);
        toast.error('Failed to update session.');
    }
};

/*
const handleConfirmSession = async () => {
  try {
      const response = await axios.put(`http://localhost:5001/api/sessions/confirm/${selectedEvent.id}`);
      if (response.status === 200) {
          toast.success('Session confirmed!');
          fetchEvents();
          closeEditForm();
      }
  } catch (error) {
      console.error('Error confirming session:', error);
      toast.error('Failed to confirm session.');
  }
};
*/

const handleDeleteSession = async (sessionId) => {
  if (!window.confirm("Are you sure you want to delete this session?")) return;

  try {
      const response = await axios.delete(`http://localhost:5001/api/sessions/${sessionId}`);
      if (response.status === 200) {
          toast.success('Session deleted successfully!');
          fetchEvents();
          setShowSessionDetails(false);
      }
  } catch (error) {
      console.error('Error deleting session:', error);
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
            onNavigate={(date) => setCurrentViewDate(date)}
            eventPropGetter={(event) => {
              let style = {
                backgroundColor: 'blue', // Default background color
                opacity: 0.8
              };
          
              if (event.type === 'mentor') {
                style.backgroundColor = 'orange'; // Change color for mentor events
              }return {
                className: 'hover-effect',
                style: style,
              };
            }} 
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
  <div className="session-details-modal">
    <div className="session-details-content">
      <h3>Session Details - {editFormData.department}</h3>
      <i className="fa-solid fa-xmark session-close" onClick={closeEditForm}></i>

{selectedEvent?.type === 'session' ? (
      (!isEditing ? (
        <>
          <label>Mentor:</label>
          <p>{editFormData.mentor}</p>

          <label>Year:</label>
          <p>{editFormData.year}</p>

          <label>Students:</label>
          <p>{editFormData.students}</p>

          <label>Date:</label>
          <p>{editFormData.date}</p>

          <label>Mode of Session:</label>
          <p>{editFormData.mode}</p>

          <label>Additional Note:</label>
          <p>{editFormData.note || "No additional notes"}</p>

          <div className="session-buttons">
            <button className="session-btn" onClick={toggleEditSession}>Edit</button>
            <button className="session-btn" onClick={() => handleDeleteSession(selectedEvent.id)}>Delete</button>
          </div>
        </>
      ) : (
        <>
          <label>Mentor:</label>
          <input type="text" name="mentor" value={editFormData.mentor} onChange={handleEditChange} />

          <label>Year:</label>
          <input type="text" name="year" value={editFormData.year} onChange={handleEditChange} />

          <label>Students:</label>
          <textarea name="students" value={editFormData.students} onChange={handleEditChange}></textarea>

          <label>Date:</label>
          <input type="date" name="date" value={editFormData.date} onChange={handleEditChange} />

          <label>Mode of Session:</label>
          <select name="mode" value={editFormData.mode} onChange={handleEditChange}>
            <option value="Online">Online</option>
            <option value="Physical">Physical</option>
          </select>

          <label>Additional Note:</label>
          <textarea name="note" value={editFormData.note} onChange={handleEditChange}></textarea>

          <div className="session-buttons">
            <button className="session-btn" onClick={handleSaveEditSession}>Save</button>
            <button className="session-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ))
    ):(
      (!isEditing ? (
      <>
          <label>Event Title</label>
          <p>{editFormData.eventTitle} </p>

          <label>Start Time</label>
          <p>{editFormData.start}</p>

          <label>End Time</label>
          <p>{editFormData.end}</p>

          <div className="calc-btns">
            <button type="submit" className='cal-btn' onClick={toggleEditEvent}>Edit Event</button>
            <button type="button" className='cal-btn' onClick={handleDeleteEvent}>Delete Event</button>
          </div>
        </>
        ):(
          <>
          <label>Event Title</label>
          <input type="text" name="eventTitle" value={editFormData.eventTitle} onChange={handleEditChange} required />

          <label>Start Time</label>
          <input type="datetime-local" name="start" value={editFormData.start} onChange={handleEditChange} required />

          <label>End Time</label>
          <input type="datetime-local" name="end" value={editFormData.end} onChange={handleEditChange} required />

          <div className="calc-btns">
            <button type="submit" className='cal-btn' onClick={handleSubmitEdit}>Save</button>
            <button type="button" className='cal-btn' onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
        ))
    )}
    </div>
  </div>
)}

        {role === 'Student' && (
          <div className='root event-point'>
            <div className='stud-events'></div>
            <strong>Your Events</strong>
            <div className='mentor-events'></div>
            <strong>Mentor Added Events</strong>
          </div>
        )}


      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Calendar;
