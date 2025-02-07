import Footer from '../Footer/Footer'
import Sidebar from '../Sidebar/Sidebar'
import React,{useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


export default function SessionTable() {
  const [mentorName, setMentorName] = useState("");
  const [selectedDate, setSelectedDate] = useState('');
  const [sessionReports, setSessionReports] = useState([]);

  useEffect(() =>{
    const fetchmentorname = async() =>{
      try {
        const response = await axios.get ("http://localhost:5001/api/dashboard",{
          withCredentials: true, // Ensures cookies (session) are sent with the request

        });
        if(response.data.role === 'Mentor'){
          setMentorName(response.data.name)
          }
      }
      catch(error){
        console.error("mentor name can't be fetched", error.message)
      }
    }
    fetchmentorname();
  },[]);

  const fetchSessionReports = async () => {
    if (!selectedDate || !mentorName) return;

    const dateObj = new Date(selectedDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Months are zero-based in JS

    try {
      const response = await axios.get(`http://localhost:5001/api/sessions?year=${year}&month=${month}&mentor=${mentorName}`);
      setSessionReports(response.data);
    } catch (error) {
      console.error("Error fetching session reports:", error);
    }
  };


  return (
    <div>
      <Sidebar/>
        
        <div className='session-table-content'>
            <br /><br /><br />
        <h2>Session Reports for {mentorName}</h2><br />

        <form action="">
          <label htmlFor="selectDate">Select a Date</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </form><br />
        
        <Button variant="primary" onClick={fetchSessionReports}>see reports</Button>
        
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>Report num</th>
          <th>Date</th>
          <th>Department</th>
          <th>Mentor</th>
          <th>Batch Year</th>
          <th>Index numbers</th>
          <th>Session Mode</th>
          <th>Additional Note</th>
        </tr>
      </thead>
      <tbody>
      {sessionReports.map((report, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{new Date(report.Date).toLocaleDateString()}</td>
                <td>{report.Department}</td>
                <td>{report.Mentor}</td>
                <td>{report.Year}</td>
                <td>{report.Index}</td>
                <td>{report.SessionMode}</td>
                <td>{report.AdditionalNote}</td>
              </tr>
            ))}
      
      </tbody>
    </Table>
      </div>
    <Footer/>

      
    </div>
  )
}
