import '../App.css';
import { useState, createContext } from 'react';
import { ColourContext } from '../App';

import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from '../components/navbar';
import SideBar from '../components/sidebar';
import Timetable from '../components/timetable';
import Create from '../components/create';
// END OF NORMAL IMPORTS

function Main() {
  const [windowVisibility, setWindowVisibility] = useState(false);

  // [[name, colour]]
  const [categories, setCategories] = useState([
    ["Eating", 0], ["University", 1], ["Commute", 2], ["Leisure", 3], ["Exercise", 4], ["Chores", 5], ["Social", 6]
  ]);

  const colours = ["fc8b8b", "9ed9d8", "e8c07c", "c38d9e", "41b3a3", "8282b9", "f4d1d1", "e27d60"]

  const initEvent = {name: "", category: "", start: 0, end: 0};
  const [eventList, setEventList] = useState([]);
  const [event, setEvent] = useState(initEvent);

  return (

    <div class="App">
      <ColourContext.Provider value={colours}>
        <NavBar />

        <div class="main">
          <SideBar 
            setWindowVisibility={setWindowVisibility} 
            categories={categories}
          />
          <Timetable 
            eventList={eventList}
            categories={categories}
          />
        </div>

        <Create 
          windowVisibility={windowVisibility} setWindowVisibility={setWindowVisibility}
          categories={categories} setCategories={setCategories}
          eventList={eventList} setEventList={setEventList}
          event={event} setEvent={setEvent}
        />
      </ColourContext.Provider>
    </div>

  );
}

export default Main;
