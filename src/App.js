import "./App.css";
import Home from './pages/home/home';
import Landing from './pages/landing/landing';
import Login from './pages/login/login';
import Analytics from './pages/analytics/analytics'
import NavBar from "./components/navbar/navbar";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const firebaseConfig = {
	apiKey: "AIzaSyAdsFECf-w0-CGJG3U7rKRkEWYUfTQ-Q0w",
	authDomain: "timetracker2-4137b.firebaseapp.com",
	projectId: "timetracker2-4137b",
	storageBucket: "timetracker2-4137b.appspot.com",
	messagingSenderId: "1076991918940",
	appId: "1:1076991918940:web:c9e7f0b0cb53487e5a3799"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

// END OF FIREBASE AND AUTH SETUP

export const ColourTheme = createContext();

export const toYmd = (date) => {
	return {year: date.getFullYear(), month: date.getMonth(), date: date.getDate()};
};

export const getTimeNow = () => {
		const date = new Date();
		return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

export const getToday = () => {
		return toYmd(new Date());
}

export const isToday = (ymd) => {
		const today = getToday();
		return today.year===ymd.year && today.month===ymd.month && today.date===ymd.date;
}

export const months = ["January", "February", "March", "April", "May", "June", 
		"July", "August", "September", "October", "November", "December"];

let fetched = false;

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Runs once when the app starts, links up the authentication to the isLoggedIn variable
	useEffect(() => {
		return () => onAuthStateChanged(auth, async (user) => {
			setIsLoggedIn(user);
		});
	}, []);
	 
	const [categories, setCategories] = useState(new Map());
	const [count, setCount] = useState(0);

	// Runs once the app starts, fetches data on categories and current event index
	useEffect(() => {
		if (!fetched) {
			fetched = true;

			const fetchData = async () => {
				const countSnapshot = await getDoc(doc(db, 'info', 'count'));
				if (countSnapshot.exists()) {
					setCount(countSnapshot.data().events);
				} else {
					await setDoc(doc(db, 'info', 'count'), {events: 0, categories: 0});
				}

				const prefsSnapshot = await getDoc(doc(db, 'info', 'prefs'));
				if (prefsSnapshot.exists()) {
					setTheme(prefsSnapshot.data().theme);
				} else {
					await setDoc(doc(db, 'info', 'prefs'), {theme: "light"});
				}

				const categorySnapshot = await getDocs(collection(db, 'categories'));
				const temp = new Map();
				categorySnapshot.forEach((doc) => {
					const subCategories = new Map();
					for (const [key, value] of Object.entries(doc.data().subs)) {
						subCategories.set(+key, value);
					}
					temp.set( +doc.id, {name: doc.data().name, colour: doc.data().colour, 
									   subs: subCategories, count: doc.data().count} );
				})
				setCategories(new Map(temp));console.log(temp);
			}

			fetchData().catch(console.error);
		}
	}, []);

	const [date, setDate] = useState(toYmd(new Date()));
	const [planEvents, setPlanEvents] = useState(new Map());
	const [lifeEvents, setLifeEvents] = useState(new Map());

	// Runs every time user selects a date, fetches plan and life events for that day
	useEffect(() => {
		const fetchData = async () => {
			let temp = new Map();
			const planSnapshot = await getDocs(query(collection(db, 'plan'), where("date", "==", date)));
			planSnapshot.forEach((e) => {
				temp.set(+e.id, e.data());
			})
			setPlanEvents(new Map(temp));

			temp.clear();
			const lifeSnapshot = await getDocs(query(collection(db, 'life'), where("date", "==", date)));
			lifeSnapshot.forEach((e) => {
				temp.set(+e.id, e.data());
			})
			setLifeEvents(new Map(temp));
		};

		fetchData().catch(console.error);
	}, [date]);

	const [theme, setTheme] = useState("light");
	const toggleTheme = async () => {
		const newTheme = theme === "light" ? "dark" : "light"
		setTheme(newTheme);
		await setDoc(doc(db, 'info', 'prefs'), {theme: newTheme});
	}

	return (
		<div className={theme + "-theme"}>
			<ColourTheme.Provider value={theme}>
				<Router>
					<NavBar 
						isLoggedIn={isLoggedIn}
						theme={theme} toggleTheme={toggleTheme}
					/>

					<Switch>
						<Route exact path="/">
							<Landing />
						</Route>
						<Route exact path="/login">
							<Login setIsLoggedIn={setIsLoggedIn}/>
						</Route>
						<Route exact path="/home">
							<Home 
								categories={categories} setCategories={setCategories} 
								planEvents={planEvents} setPlanEvents={setPlanEvents}
								lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
								count={count} setCount={setCount}
								date={date} setDate={setDate}
							/>
						</Route>
						<Route exact path="/analytics">
							<Analytics 
								categories={categories}
								planEvents={planEvents} lifeEvents={lifeEvents}
								date={date} setDate={setDate}
							/>
						</Route>
					</Switch>
				</Router>
			</ColourTheme.Provider>
		</div>
	);
}

export default App;
