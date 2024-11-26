import "./Calendar.css";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { calculateDailyBalances } from "../../utils/financeCalculations";
import { Balance, CalendarContent, Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { isSameMonth } from "date-fns";


interface CalenderProp {
  monthTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
}

const Calendar = ({ monthTransactions, setCurrentMonth, setCurrentDay, currentDay, today }: CalenderProp) => {

  const dailyBalances = calculateDailyBalances(monthTransactions);
  // console.log(dailyBalances);

  // ***2.FullCalendar用のイベントを生成する関数📅
  const createCalendarEvents = (
    dailyBalances: Record<string, Balance>
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  const calendarEvents = createCalendarEvents(dailyBalances);

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: "lightblue",
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className="money" id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>
        <div className="money" id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

    //月の日付取得
    const handleDateSet = (datesetInfo: DatesSetArg) => {
      const currentMonth = datesetInfo.view.currentStart;
      setCurrentMonth(currentMonth);
      const todayDate = new Date();
      setCurrentDay(today);
      if (isSameMonth(todayDate, currentMonth)) {
        setCurrentDay(today);
      }
    };

    const handleDateClick = (dateInfo: DateClickArg) => {
      // console.log(dateInfo);
      setCurrentDay(dateInfo.dateStr);
    };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={handleDateClick}
    />
  );
};

export default Calendar;
