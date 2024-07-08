import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// 데이터 가져오는 함수 타입 정의
interface Data {
  date: string;
  data: string;
}

interface MyCalendarProps {
  onDateChange: (dateInfo: { year: number, month: number, day: number, weekday: string }) => void;
}

// 날짜에 대한 데이터를 가져오는 함수 (예시)
const fetchDataForDate = async (date: Date): Promise<Data> => {
  const dateString = date.toLocaleDateString('en-CA'); // 'en-CA'는 YYYY-MM-DD 형식을 사용합니다.
  return { date: dateString, data: "Sample data for the selected date" };
};

// 날짜를 년도-월-일 형식으로 변환하는 함수
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MyCalendar: React.FC<MyCalendarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDate) {
      const getData = async () => {
        setLoading(true);
        const result = await fetchDataForDate(selectedDate);
        setData(result);
        setLoading(false);

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
        const day = selectedDate.getDate();
        const weekday = selectedDate.toLocaleDateString('ko-KR', { weekday: 'long' });

        onDateChange({year, month, day, weekday});
      };
      getData();
    }
  }, [selectedDate, onDateChange]);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const tileClassName: CalendarProps['tileClassName'] = ({ date, view }) => {
    if (view === 'month' && date.getDay() === 6) {
      return 'saturday'; // 토요일이면 'saturday' 클래스를 추가
    }
    return null;
  };

  return (
    <div className="calendar-page">
      <div className="calendar-sidebar">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={tileClassName} // tileClassName prop 추가
        />
      </div>
      <div className="calendar-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          data && (
            <div className="date-data">
              <h3>Data for {data.date}:</h3>
              <p>{data.data}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
