import './home.css';
import { db, getToday, getTimeNow, getCategoryName } from '../../App'
import SideBar from './sidebar/sidebar';
import Timetable from './timetable/timetable';

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Current = createContext();

function Home({
  categories, setCategories, planEvents, setPlanEvents, lifeEvents, setLifeEvents,
  count, setCount, date, setDate
}) {

    // when inactive, has the form {isRunning: false}
    // if play button is pressed, has the form {category, start, isRunning: true, isIncreasing: true}
    // if countdown timer is pressed, has the form {index, isRunning: true, isIncreasing: false}
    const [current, setCurrent] = useState({isRunning: false});

    const writeCurrent = async (curr) => {
        if (curr.isRunning) {
        setDate(getToday());
        }
        setCurrent(curr);
        await setDoc(doc(db, 'info/current'), curr);
    }

    useEffect(() => {
        const checkDb = async () => {
            const currentSnapshot = await getDoc(doc(db, 'info/current'));
            if (currentSnapshot.exists()) {
                setCurrent(currentSnapshot.data());
            } else {
                await setDoc(doc(db, 'info/current'), {isRunning: false});
            }
        }
        checkDb().catch(console.error);
    }, [])

    const stopAndSaveCurrent = async () => {
        writeCurrent({isRunning: false});

        const event = {category: current.category, start: current.start, 
            end: getTimeNow(), date: getToday(), hasDescription: false};

        event.name = current.hasOwnProperty('name')
            ? current.name 
            : getCategoryName(categories, current.category);

        setLifeEvents(map => new Map(map.set(count, event)));
        await setDoc(doc(db, `life/${count}`), event);

        setCount(count => count+1);
        await updateDoc(doc(db, "info/count"), {events: count+1});
    }

    return (
        <Current.Provider value={[current, writeCurrent]}>
            <div className="home"> 
                
                <SideBar 
                    categories={categories} setCategories={setCategories}
                    date={date} setDate={setDate}
                    stopAndSave={stopAndSaveCurrent}
                />

                <Timetable 
                    planEvents={planEvents} setPlanEvents={setPlanEvents}
                    lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
                    count={count} setCount={setCount}
                    categories={categories}
                    date={date}
                />
                
            </div>
        </Current.Provider>
    );
}

export default Home;
