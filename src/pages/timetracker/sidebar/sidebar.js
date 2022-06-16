import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import DaySelector from './dayselector'
import DaySchedule from './dayschedule'

function SideBar() {

    return (
        <>
           <DaySelector/>
           <DaySchedule/>
        </>
    )
}

export default SideBar
