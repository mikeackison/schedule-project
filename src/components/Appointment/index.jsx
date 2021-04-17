import React from 'react';
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";

import 'styles/styles.scss';


// const classNames = require('classnames')

export default function Appointment(props) {

return(

  <article className="appointment">
    {/* all appointments render header with time props */}
    <Header time={props.time}/>
    {/* if props interview is true show the appointment, otherwise show empty */}
    {/* need to update the props to incled interview */}
    { (props.interview) ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty/> }
  </article>
);
}