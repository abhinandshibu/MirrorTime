import './sidebar.css'
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useContext } from 'react';
import { toYmd, ColourTheme } from '../../App';
import NewCategory from './new-category';
import { CategoryGroup } from './category-group';

function SideBar({
    categories, setCategories, date, setDate, stopAndSave
}) {
    const theme = useContext(ColourTheme);
    const [categoryWindow, setCategoryWindow] = useState(false);
    
    return (
        <div className="sidebar">
            <div id="datepicker">
                <DatePicker 
                    selected={new Date(date.year, date.month, date.date)} 
                    onChange={d => setDate(toYmd(d))}
                    inline fixedHeight
                />
            </div>

            <div className="categories">
                <Button id="new-category" 
                    variant={theme === "light" ? "outline-dark" : "outline-light"}
                    onClick={() => setCategoryWindow(true)}
                >
                    New Category
                </Button>
                <div className="category-list">
                    {Array.from(categories).map(([name, colour]) => (
                        <CategoryGroup name={name} colour={colour} 
                            stopAndSave={stopAndSave} categories={categories} key={name} />
                    ))}
                </div>
            </div>

            <NewCategory
                visibility={categoryWindow} setVisibility={setCategoryWindow}
                setCategories={setCategories}
            />
        </div>
    );
}

export default SideBar;