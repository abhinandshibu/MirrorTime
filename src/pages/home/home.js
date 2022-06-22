import './home.css';
import { useState, useEffect } from 'react';
import { doc, collection, setDoc, getDoc, getDocs, where, query } from "firebase/firestore";
import { db, toYmd } from '../../App';

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
  
  const categories = props.categories
  const setCategories = props.setCategories
  const planEvents = props.planEvents
  const setPlanEvents = props.setPlanEvents
  const lifeEvents = props.lifeEvents
  const setLifeEvents = props.setLifeEvents

  const [count, setCount] = useState(0);
  const [date, setDate] = useState(toYmd(new Date()));

  useEffect(() => {console.log("useeffect 2");
    const fetchData = async () => {
      let temp = new Map();
      const planSnapshot = await getDocs(query(collection(db, 'plan'), where("date", "==", date)));
      planSnapshot.forEach((e) => {
        temp.set(e.id, e.data());
      })
      setPlanEvents(new Map(temp));

      temp.clear();
      const lifeSnapshot = await getDocs(query(collection(db, 'life'), where("date", "==", date)));
      lifeSnapshot.forEach((e) => {
        temp.set(e.id, e.data());
      })
      setLifeEvents(new Map(temp));
    };
    fetchData().catch(console.error);
  }, [date]);

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
