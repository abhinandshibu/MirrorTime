import './home.css';
import { useState, useEffect } from 'react';
import { doc, collection, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../../App';

import 'bootstrap/dist/css/bootstrap.min.css';

import SideBar from '../../components/sidebar/sidebar';
import Timetable from '../../components/timetable/timetable';
import NewPlan from '../../components/create/new-plan';
import NewLife from '../../components/create/new-life';
import NewCategory from '../../components/create/new-category';
// END OF NORMAL IMPORTS

let fetched = false;

async function fetchData(setCount, setCategories, setPlanEvents, setLifeEvents) {
  const countSnapshot = await getDoc(doc(db, 'info', 'count'));

  if (countSnapshot.exists()) {
    // User has used app before, set current event index and load events (if any)
    setCount(countSnapshot.data().count);

    const planSnapshot = await getDocs(collection(db, 'plan'));
    planSnapshot.forEach((e) => {
      setPlanEvents( map => new Map ( map.set( e.id, e.data() ) ) );
    })

    const lifeSnapshot = await getDocs(collection(db, 'life'));
    lifeSnapshot.forEach((e) => {
      setLifeEvents( map => new Map ( map.set( e.id, e.data() ) ) );
    })
  }
  else {
    await setDoc(doc(db, 'info', 'count'), {count: 0});
  }

  const categorySnapshot = await getDocs(collection(db, 'categories'));
    categorySnapshot.forEach((doc) => {
      setCategories( map => new Map( map.set( doc.id, doc.data().colour ) ) );
    })
}


function Home() {

  const [planWindowShow, setPlanWindowShow] = useState(false);
  const [lifeWindowShow, setLifeWindowShow] = useState(false);
  const [categoryWindowShow, setCategoryWindowShow] = useState(false);
  const [categories, setCategories] = useState(new Map());
  const [planEvents, setPlanEvents] = useState(new Map());
  const [lifeEvents, setLifeEvents] = useState(new Map());
  const [count, setCount] = useState(0);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!fetched) {
      fetchData(setCount, setCategories, setPlanEvents, setLifeEvents).catch(console.error);
      fetched = true;
    }
  }, []);

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
