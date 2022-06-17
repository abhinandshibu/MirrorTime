import './home.css';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from '../components/navbar';
import SideBar from '../components/sidebar';
import Timetable from '../components/timetable';
import Create from '../components/create';
// END OF NORMAL IMPORTS

function Home({initCount, initPlanEvents, initLifeEvents}) {
  const [windowVisibility, setWindowVisibility] = useState(false);

  // [[name, colour]]. sample values
  const [categories, setCategories] = useState([
    ["Eating", 0], ["University", 1], ["Commute", 2], ["Leisure", 3], ["Exercise", 4], ["Chores", 5], ["Social", 6]
  ]);

  const initEvent = {name: "", category: "Eating", start: 0, end: 0};

  const [count, setCount] = useState(initCount);
  const [planEvents, setPlanEvents] = useState(initPlanEvents);
  const [lifeEvents, setLifeEvents] = useState(initLifeEvents);
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
          planEvents={planEvents}
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
