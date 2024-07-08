import React, { useCallback, useState } from 'react'
import MyCalendar from './Calender/Calender';

const Exercise: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);

    const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
        setDateInfo(info);
      }, []);


    return(
        <div className='exercise'>
            <div className='calendar'>
                <MyCalendar onDateChange={handleDateChange} />
                {dateInfo && (
                    <div className='date-info'>
                        <p>{`${dateInfo.year}-${dateInfo.month}-${dateInfo.day} (${dateInfo.weekday})`}</p>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Exercise