import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { Button } from 'react-bootstrap';

import useCollapse from 'react-collapsed'

function DaySelector() {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

    return (
        <>
            <Button variant="secondary" {...getToggleProps()}>
                {isExpanded ? 'Collapse Calendar' : 'Expand Calender'}
            </Button>
        
            <section {...getCollapseProps()}>
                <Calendar />
            </section>
        </>
    )
}

export default DaySelector
