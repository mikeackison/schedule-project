// import {useState, useEffect} from "react";
import {useReducer, useEffect} from "react";
import axios from "axios";

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


export default function useApplicationData() {

  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

function reducer(state, action){
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.value
      }
    case SET_APPLICATION_DATA:
      return { 
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case SET_INTERVIEW: 
    const buffer = {
      ...state, 
      appointments: {
        ...state.appointments,
        [action.id]: {
          ...state.appointments[action.id],
          interview: action.interview
        }
      },
      
    };
      return {
        ...buffer, 
        days: updateSpots(buffer)
      };
    
    default:
       throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

 const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, value: day  });

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

    // const days = updateSpots({...state, appointments})
  
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(response => dispatch({type: SET_INTERVIEW, appointments, id, interview}))
  }

  const deleteInterview = (id) => {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: null
    // };

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    // const days = updateSpots({...state, appointments})

    return axios.delete(`/api/appointments/${id}`)
    .then((response) => { dispatch({type: SET_INTERVIEW, id, interview: null})
  })
  }

  // need to update the day and days state
  // pass a fucntion to setState in setDays
  
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // webSocket.onopen = function (event) {
    //   webSocket.send('ping');
    //   console.log('Message', event)
      
    // };
    
    webSocket.onmessage = function (event) {
      console.log("WEB SOCKET", JSON.parse(event.data));
      const websocketJSON = JSON.parse(event.data)
      dispatch({
        type: websocketJSON.type,
        interview: websocketJSON.interview,
        id: websocketJSON.id

      })
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
      dispatch({
          type: SET_APPLICATION_DATA, 
          days: all[0].data, 
          appointments: all[1].data, 
          interviewers: all[2].data 

        // ...prev, days: all[0].data,
        // appointments: all[1].data,
        // interviewers: all[2].data
      });
    })
    return () => webSocket.close
  }, []);

  // empty dependency array when state changes use effect will execute
  // empty dependency prevents infintite loop

  return {setDay, deleteInterview, bookInterview, state}
  // funtion needs to return
}