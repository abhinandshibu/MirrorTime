import './home.css';
import { useState, useEffect } from 'react';

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


function Home({initCount, initPlanEvents, initLifeEvents, initCategories}) {
  const [windowVisibility, setWindowVisibility] = useState(false);

  const initEvent = {name: "", category: initCategories.keys()[0], start: 0, end: 0};

  const [categories, setCategories] = useState(initCategories);
  
  const [count, setCount] = useState(initCount);
  const [planEvents, setPlanEvents] = useState(initPlanEvents);
  const [lifeEvents, setLifeEvents] = useState(initLifeEvents);
  const [event, setEvent] = useState(initEvent);

  useEffect(() => {
    setPlanEvents(initPlanEvents);
  }, [initPlanEvents]);

  useEffect(() => {
    setLifeEvents(initLifeEvents);
  }, [initLifeEvents]);

  useEffect(() => {
    setCategories(initCategories);
  }, [initCategories]);

  return (

    <div className="home">
      
      <NavBar />

      <div className="main">
        <SideBar 
          setWindowVisibility={setWindowVisibility} 
          categories={categories}
        />
        <Timetable 
          planEvents={planEvents}
          lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
          count={count} setCount={setCount}
          categories={categories}
        />
      </div>

      <Create 
        windowVisibility={windowVisibility} setWindowVisibility={setWindowVisibility}
        categories={categories} setCategories={setCategories}
        planEvents={planEvents} setPlanEvents={setPlanEvents}
        event={event} setEvent={setEvent}
        count={count} setCount={setCount}
      />
     
    </div>

  );
}

export default Home;
