import React, { useState, useEffect } from 'react';
import DayList from 'components/DayList'
import Appointment from 'components/Appointment';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"

import useApplicationData from 'hooks/useApplicationData'

import 'styles/Application.scss';

export default function Application(props) {
  
  const {
    state, 
    setDay,
    bookInterview,
    deleteInterview

  } = useApplicationData();
 
  const interviewers = getInterviewersForDay(state, state.day)
    
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointment = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview); 

    return(
  
      <Appointment
      key={appointment.id}
      {...appointment}
      // id={appointment.id}
      // time={appointment.time}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      cancelInterview={deleteInterview}
      
      />
    );
  })

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
        <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
      </section>
      <section className='schedule'>

        {appointment}
      <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
