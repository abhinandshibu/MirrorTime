
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

// iimport "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";


function DaySchedule() {

    const view = 'dayGridMonth' 

    return (
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
      />
    )
}

export default DaySchedule
