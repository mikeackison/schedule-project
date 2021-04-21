import React, { useEffect } from 'react';
import 'styles/styles.scss';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status'
import Confirm from 'components/Appointment/Confirm'
import Error from "components/Appointment/Error";

import useVisualMode from 'hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETE = 'DELETE'
const CONFIRM = 'CONFIRM'
const EDIT = 'EDIT'
const ERROR_SAVE = 'ERROR_SAVE'
const ERROR_DELETE = 'ERROR_DELETE'



// const classNames = require('classnames')

export default function Appointment(props) {

  // console.log("Appointment", props.interview)

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (mode === EMPTY && props.interview) {
      transition(SHOW)
    }

    if (mode === SHOW && !props.interview) {
      transition(EMPTY)
    }
  }, [props.interview, mode, transition])

  const save = (name, interviewer) => {

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
      .then(response => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  const cancelInterview = () => {

    transition(DELETE, true)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }


  return (

    <article className='appointment'>
      {/* all appointments render header with time props */}
      <Header time={props.time} />

      {/* if props interview is true show the appointment, otherwise show empty */}
      {/* need to update the props to incled interview */}
      {/* { (props.interview) ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty/> } */}
      {mode === EMPTY && !props.interview && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (

        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          // onDelete={cancelInterview}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (<Form onSave={save} interviewers={props.interviewers} onCancel={() => back(EMPTY)}
      />
      )}
      {mode === EDIT && (<Form
        name={props.interview.student}
        interviewers={props.interviewers}
        interviewer={props.interview.interviewer.id}
        student={props.student}
        onSave={save}
        onCancel={() => back()}
      />
      )}
      {mode === SAVING && (<Status message='Saving' />)}
      {mode === DELETE && (<Status message='Deleting' />)}
      {mode === CONFIRM && (<Confirm
        message='Delete Appointment?'
        onConfirm={cancelInterview}
        onCancel={() => back()}
      />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="There was an error saving your appointment"
          onClose={back}
        />
      )}

      {mode === ERROR_DELETE && (
        <Error
          message="There was an error deleteign your appoinment"
          onClose={back}
        />
      )}
    </article>
  );
}