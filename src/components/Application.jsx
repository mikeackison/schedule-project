import React, { useState, useEffect } from 'react';
import DayList from 'components/DayList'
import Appointment from 'components/Appointment';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"
import axios from 'axios'

import 'styles/Application.scss';

export default function Application(props) {
  
  // const [day, setDay] = useState('Monday');
  // // set default day to Monday
  // const [ days, setDays ] = useState([])
  // // add a days state - needs to be inside the function

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
 
  const interviewers = getInterviewersForDay(state, state.day)

  const bookInterview = (id, interview) => {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // setState({
    //   ...state,
    //   appointments
    // });
   
    return axios.put(`/api/appointments/${id}`, {interview}).then(response => setState({...state, appointments}))
  }


 
  // need to update the day and days state
  // pass a fucntion to setState in setDays
  const setDay = day => setState({ ...state, day });
    
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
      
      />
    );
  })

  useEffect(() => {
    const GET_DAYS = '/api/days'
    const GET_APPOINTMENTS = '/api/appointments'
    const GET_INTERVIEWERS = '/api/interviewers'
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then((all) => {
      console.log(all)
      console.log(all[2].data)
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, [])

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
