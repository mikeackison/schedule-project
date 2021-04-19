import {useState, useEffect} from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

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
  
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(response => setState({...state, appointments}))
  }

  const deleteInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
    .then((response) => { setState({...state, appointments})
  })
  }

  // need to update the day and days state
  // pass a fucntion to setState in setDays
  const setDay = day => setState({ ...state, day });

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
      setState(prev => ({
        ...prev, days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    })
  }, []);

  // empty dependency array when state changes use effect will execute
  // empty dependency prevents infintite loop

  return {setDay, deleteInterview, bookInterview, state}
}