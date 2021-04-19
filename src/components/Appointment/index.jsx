import React from 'react';
import 'styles/styles.scss';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status'
import Confirm from 'components/Appointment/Confirm'

import bookInterview from "components/Application"

import useVisualMode from 'hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETE = 'DELETE'
const CONFIRM = 'CONFIRM'



// const classNames = require('classnames')

export default function Appointment(props) {


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview).then(response => transition(SHOW))

  }

  const cancelInterview = () => {

    transition(DELETE)
    props.cancelInterview(props.id).then(() => {
      transition(EMPTY)
    })
  }


return(

  <article className='appointment'>
    {/* all appointments render header with time props */}
    <Header time={props.time}/>

    {/* if props interview is true show the appointment, otherwise show empty */}
    {/* need to update the props to incled interview */}
    {/* { (props.interview) ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty/> } */}
    {mode === EMPTY && <Empty onAdd={() =>transition(CREATE)} />}
    {mode === SHOW && (
  <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
    // onDelete={cancelInterview}
    onDelete={() => transition(CONFIRM)}
  />
)}
    {mode === CREATE && <Form onSave={save}  interviewers={props.interviewers} onCancel={() => back(EMPTY)} />}
    {mode === SAVING && <Status message='Saving'/>}
    {mode === DELETE && <Status message='Deleteing' />}
    {mode === CONFIRM && <Confirm  message='Delete Appointment?' onConfirm={cancelInterview} />}
  </article>
);
}