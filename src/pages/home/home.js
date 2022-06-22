import './home.css';
import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import SideBar from '../../components/sidebar/sidebar';
import Timetable from '../../components/timetable/timetable';
import NewPlan from '../../components/create/new-plan';
import NewLife from '../../components/create/new-life';
import NewCategory from '../../components/create/new-category';
// END OF NORMAL IMPORTS




function Home(props) {

  const [planWindowShow, setPlanWindowShow] = useState(false);
  const [lifeWindowShow, setLifeWindowShow] = useState(false);
  const [categoryWindowShow, setCategoryWindowShow] = useState(false);

  // const [categories, setCategories] = useState(new Map());
  // const [planEvents, setPlanEvents] = useState(new Map());
  // const [lifeEvents, setLifeEvents] = useState(new Map());
  
  const categories = props.categories
  const setCategories = props.setCategories
  const planEvents = props.planEvents
  const setPlanEvents = props.setPlanEvents
  const lifeEvents = props.lifeEvents
  const setLifeEvents = props.setLifeEvents
  const count = props.count
  const setCount = props.setCount   

  return (

    <div className="home"> 
 
      <div className="main">
        <SideBar 
          setCategoryWindowShow={setCategoryWindowShow}
          categories={categories}
        />

        <Timetable 
          setPlanWindowShow={setPlanWindowShow} 
          setLifeWindowShow={setLifeWindowShow} 
          planEvents={planEvents} setPlanEvents={setPlanEvents}
          lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
          count={count} setCount={setCount}
          categories={categories}
        />
      </div>

      <NewPlan 
        planWindowShow={planWindowShow} setPlanWindowShow={setPlanWindowShow}
        categories={categories}
        setPlanEvents={setPlanEvents}
        count={count} setCount={setCount}
      />

      <NewLife 
        lifeWindowShow={lifeWindowShow} setLifeWindowShow={setLifeWindowShow}
        categories={categories}
        setLifeEvents={setLifeEvents}
        count={count} setCount={setCount}
      />

      <NewCategory
        categoryWindowShow={categoryWindowShow} setCategoryWindowShow={setCategoryWindowShow}
        setCategories={setCategories}
      />
     
    </div>

  );
}

export default Home;
