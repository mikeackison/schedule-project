import React, { useState, useEffect } from 'react';
import DayList from 'components/DayList'
import Appointment from 'components/Appointment';
import axios from 'axios'

import 'styles/Application.scss';

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },

  {
    id: 3,
    time: "2pm",
    interview: {
      student: "A. Student",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },

  {
    id: 4,
    time: "3pm",
  },

  {
    id: 5,
    time: "4pm",
    interview: {
      student: "R. Andom",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  }
];



export default function Application(props) {
  
  const [day, setDay] = useState('Monday');
  // set default day to Monday
  
  const [ days, setDays ] = useState([])
  // add a days state - needs to be inside the function

  const appointment = appointments.map(appointment => {
    return(
  
      <Appointment
      key={appointment.id}
      {...appointment}
      
      />
    );
  })

  const daysURL = '/api/days'
  useEffect(() =>{
    axios.get(daysURL).then(response => {
      setDays([...response.data])
      console.log(response.data);
    });
  }, [] )
  // empty dependency array when state changes use effect will execute
  // empty dependency prevents infintite loop

  return (
    <main className='layout'>
      <section className='sidebar'>
        <img
          className='sidebar--centered'
          src='images/logo.png'
          alt='Interview Scheduler'
        />
        <hr className='sidebar__separator sidebar--centered' />
        <nav className='sidebar__menu'>

        {/* receive the value and the function */}
        <DayList days={days} day={day} setDay={setDay} />
        </nav>
      </section>
      <section className='schedule'>

        {appointment}
      <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
