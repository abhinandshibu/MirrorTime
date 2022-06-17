import './home.css';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from '../components/navbar';
import SideBar from '../components/sidebar';
import Timetable from '../components/timetable';
import Create from '../components/create';
// END OF NORMAL IMPORTS

// Google Calendar API
import ApiCalendar from 'react-google-calendar-api';

const config = {
  "clientId": "1076991918940-nfgjkcmen5rocbd5p87ai8um6okbss20.apps.googleusercontent.com",
  "apiKey": "AIzaSyAdsFECf-w0-CGJG3U7rKRkEWYUfTQ-Q0w",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}

const apiCalendar = new ApiCalendar(config)
// End Of Google Calendar API


function Home() {
  const [windowVisibility, setWindowVisibility] = useState(false);

  // [[name, colour]]
  const [categories, setCategories] = useState([
    ["Eating", 0], ["University", 1], ["Commute", 2], ["Leisure", 3], ["Exercise", 4], ["Chores", 5], ["Social", 6]
  ]);

  const initEvent = {name: "", category: "Eating", start: 0, end: 0};
  const [planEventList, setPlanEventList] = useState([]);
  const [event, setEvent] = useState(initEvent);

  return (

    <div class="home">
      
      <NavBar />

      <div class="main">
        <SideBar 
          setWindowVisibility={setWindowVisibility} 
          categories={categories}
        />
        <Timetable 
          planEventList={planEventList}
          categories={categories}
        />
      </div>

      <Create 
        windowVisibility={windowVisibility} setWindowVisibility={setWindowVisibility}
        categories={categories} setCategories={setCategories}
        planEventList={planEventList} setPlanEventList={setPlanEventList}
        event={event} setEvent={setEvent}
      />
     
    </div>

  );
}

export default Home;
