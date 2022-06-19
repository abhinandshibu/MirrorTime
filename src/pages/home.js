import './home.css';
import { useState, useEffect } from 'react';
import { doc, collection, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../App';

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



export const EventConverter = {
  toFirestore(event) {
    return {
      name: event.name, 
      category: event.category, 
      start: event.start, 
      end: event.end
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      name: data.name, 
      category: data.category, 
      start: data.start, 
      end: data.end
    };
  }
}

let fetched = false;

async function fetchData(setCount, setCategories, setPlanEvents, setLifeEvents) {
  console.log("fetching...");
  const countSnapshot = await getDoc(doc(collection(db, 'info'), 'count'));

  if (countSnapshot.exists()) {
    // User has used app before, load events and categories (if any)
    setCount(countSnapshot.data().count);

    const categorySnapshot = await getDocs(collection(db, 'categories'));
    categorySnapshot.forEach((doc) => {
      setCategories( map => new Map( map.set( doc.id, doc.data().colour ) ) );
      console.log(`category ${doc.id} added`);
    })

    const planSnapshot = await getDocs(collection(db, 'plan').withConverter(EventConverter));
    planSnapshot.forEach((e) => {
      setPlanEvents( map => new Map ( map.set( e.id, e.data() ) ) );
      console.log(`plan event ${e.id} added`);
    })

    const lifeSnapshot = await getDocs(collection(db, 'life').withConverter(EventConverter));
    lifeSnapshot.forEach((e) => {
      setLifeEvents( map => new Map ( map.set( e.id, e.data() ) ) );
      console.log(`life event ${e.id} added`);
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
        setPlanEvents={setPlanEvents}
        count={count} setCount={setCount}
      />
     
    </div>

  );
}

export default Home;
