import './home.css';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import SideBar from '../../components/sidebar/sidebar';
import Timetable from '../../components/timetable/timetable';

function Home({
  categories, setCategories, planEvents, setPlanEvents, lifeEvents, setLifeEvents,
  count, setCount, date, setDate
}) {

  // when inactive, has the form {isRunning: false}
  // if play button is pressed, has the form {category, start, isRunning: true, isIncreasing: true}
  // if countdown timer is pressed, has the form {index, isRunning: true, isIncreasing: false}
  const [current, setCurrent] = useState({isRunning: false});

  return (

    <div className="home"> 
 
      <SideBar 
        lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
        count={count} setCount={setCount}
        categories={categories} setCategories={setCategories}
        date={date} setDate={setDate}
        current={current} setCurrent={setCurrent}
      />

      <Timetable 
        planEvents={planEvents} setPlanEvents={setPlanEvents}
        lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
        count={count} setCount={setCount}
        categories={categories}
        date={date}
        current={current} setCurrent={setCurrent}
      />
      
    </div>

  );
}

export default Home;
