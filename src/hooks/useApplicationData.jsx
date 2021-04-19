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
    // console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots({...state, appointments})
  
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(response => setState({...state, appointments, days}))
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

    const days = updateSpots({...state, appointments})

    return axios.delete(`/api/appointments/${id}`)
    .then((response) => { setState({...state, appointments, days})
  })
  }

  // need to update the day and days state
  // pass a fucntion to setState in setDays
  const setDay = day => setState({ ...state, day });

  


  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // webSocket.onopen = function (event) {
    //   webSocket.send('ping');
    //   console.log('Message', event)
      
    // };
    
    webSocket.onmessage = function (event) {
      console.log(JSON.parse(event.data));
    }

    const GET_DAYS = '/api/days'
    const GET_APPOINTMENTS = '/api/appointments'
    const GET_INTERVIEWERS = '/api/interviewers'
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then((all) => {
      // console.log(all)
      // console.log(all[2].data)
      setState(prev => ({
        ...prev, days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    })
  }, []);

  // empty dependency array when state changes use effect will execute
  // empty dependency prevents infintite loop

  const updateSpots = (state) => {
    const days = state.days.map((dayObject) => {
      let availableSpots = 0;
      let tempNewDayObject = {...dayObject}
      tempNewDayObject.appointments.forEach(numID => {

        if (!state.appointments[numID].interview) {
          availableSpots++
          }
      })

      dayObject.spots = availableSpots;
      return dayObject;
    })

    return days
  }

  return {setDay, deleteInterview, bookInterview, state}
  // funtion needs to return
}