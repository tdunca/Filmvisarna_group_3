import React, { useRef, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Footer from "./layout/Footer/Footer";
import Header from "./layout/Header/Header";
import Main from "./layout/Main/Main";

const App: React.FC = () => {
  const scheduleRef = useRef<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSelectDate = (daysAhead: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysAhead);
    setSelectedDate(newDate);
    scheduleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app container g-0 p-0">
      <div className="row w-100 g-0">
        <Router>
          <div className="col-12 sticky-top">
            <Header onSelectDate={handleSelectDate} />
          </div>
          <div className="col-12 g-0">
            <Main scheduleRef={scheduleRef} selectedDate={selectedDate} />
          </div>
          <div className="col-12">
            <Footer />
          </div>
        </Router>
      </div>
    </div>
  );
};

export default App;
