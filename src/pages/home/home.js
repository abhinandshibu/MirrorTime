import './home.css';
import { useState, useEffect } from 'react';
// import { doc, collection, setDoc, getDoc, getDocs, where, query } from "firebase/firestore";
// import { db, toYmd } from '../../App';

import 'bootstrap/dist/css/bootstrap.min.css';

import SideBar from '../../components/sidebar/sidebar';
import Timetable from '../../components/timetable/timetable';
import NewPlan from '../../components/create/new-plan';
import NewLife from '../../components/create/new-life';
import NewCategory from '../../components/create/new-category';
// END OF NORMAL IMPORTS

function Home({
  categories, setCategories, planEvents, setPlanEvents, lifeEvents, setLifeEvents,
  count, setCount, date, setDate
}) {

  const [planWindowShow, setPlanWindowShow] = useState(false);
  const [lifeWindowShow, setLifeWindowShow] = useState(false);
  const [categoryWindowShow, setCategoryWindowShow] = useState(false);

  return (

    <div className="home"> 
 
      <div className="main">
        <SideBar 
          setCategoryWindowShow={setCategoryWindowShow}
          categories={categories}
          date={date} setDate={setDate}
        />

        <Timetable 
          setPlanWindowShow={setPlanWindowShow} 
          setLifeWindowShow={setLifeWindowShow} 
          planEvents={planEvents} setPlanEvents={setPlanEvents}
          lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
          count={count} setCount={setCount}
          categories={categories}
          date={date}
        />
      </div>

      <NewPlan 
        planWindowShow={planWindowShow} setPlanWindowShow={setPlanWindowShow}
        categories={categories}
        setPlanEvents={setPlanEvents}
        count={count} setCount={setCount}
        date={date}
      />

      <NewLife 
        lifeWindowShow={lifeWindowShow} setLifeWindowShow={setLifeWindowShow}
        categories={categories}
        setLifeEvents={setLifeEvents}
        count={count} setCount={setCount}
        date={date}
      />

      <NewCategory
        categoryWindowShow={categoryWindowShow} setCategoryWindowShow={setCategoryWindowShow}
        setCategories={setCategories}
      />
     
    </div>

  );
}

export default Home;
