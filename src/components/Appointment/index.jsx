import React from 'react';
import 'styles/styles.scss';

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";

import useVisualMode from 'hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";



// const classNames = require('classnames')

export default function Appointment(props) {


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

return(

  <article className="appointment">
    {/* all appointments render header with time props */}
    <Header time={props.time}/>
    
    {/* if props interview is true show the appointment, otherwise show empty */}
    {/* need to update the props to incled interview */}
    {/* { (props.interview) ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty/> } */}
    {mode === EMPTY && <Empty onAdd={() => console.log("Clicked onAdd")} />}
    {mode === SHOW && (
  <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
  />
)}
  </article>
);
}