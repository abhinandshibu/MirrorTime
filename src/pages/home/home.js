import './home.css';
import { useState, useEffect } from 'react';
import { doc, collection, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../../App';

import 'bootstrap/dist/css/bootstrap.min.css';

import SideBar from '../../components/sidebar/sidebar';
import Timetable from '../../components/timetable/timetable';
import Create from '../../components/create/create';
// END OF NORMAL IMPORTS

let fetched = false;

async function fetchData(setCount, setCategories, setPlanEvents, setLifeEvents) {
  const countSnapshot = await getDoc(doc(collection(db, 'info'), 'count'));

  if (countSnapshot.exists()) {
    // User has used app before, load events and categories (if any)
    setCount(countSnapshot.data().count);

    const categorySnapshot = await getDocs(collection(db, 'categories'));
    categorySnapshot.forEach((doc) => {
      setCategories( map => new Map( map.set( doc.id, doc.data().colour ) ) );
    })

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
    await setDoc(doc(collection(db, 'info'), 'count'), {count: 0});
  }
}


function Home() {

  const [windowVisibility, setWindowVisibility] = useState(false);
  const [categories, setCategories] = useState(new Map());
  const [planEvents, setPlanEvents] = useState(new Map());
  const [lifeEvents, setLifeEvents] = useState(new Map());
  const [count, setCount] = useState(0);

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
          setWindowVisibility={setWindowVisibility} 
          categories={categories}
        />
        <Timetable 
          planEvents={planEvents} setPlanEvents={setPlanEvents}
          lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
          count={count} setCount={setCount}
          categories={categories}
        />
      </div>

      <Create 
        windowVisibility={windowVisibility} setWindowVisibility={setWindowVisibility}
        categories={categories} setCategories={setCategories}
        setPlanEvents={setPlanEvents}
        count={count} setCount={setCount}
      />
     
    </div>

  );
}

export default Home;
