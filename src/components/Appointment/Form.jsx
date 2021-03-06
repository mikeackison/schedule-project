import React, { useState } from 'react';

import Button from 'components/Button';
import InterviewerList from 'components/InterviewerList';

// import bookInterview from "components/Application"

export default function Form(props) {
  // console.log("-------->", props.interviewer)

  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState('')

  const reset = () => {
    setName('');
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  const validate = () => {
    if (name === '') {
      setError('Student name cannot be blank')
      return;
    }
    if (!interviewer) {
      setError('Interviewer name cannot be blank');
      return;
    }

    // clear error when validation passes
    setError('');
    props.onSave(name, interviewer);
  }

  return(

  <main className="appointment__card appointment__card--create">
  <section className="appointment__card-left">
    <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
      <input
        className="appointment__create-input text--semi-bold"
        name="name"
        type="text"
        placeholder="Enter Student Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        /*
          This must be a controlled component
        */
      />
    </form>
    <section className='appointment__validation'>{error}</section>
    <InterviewerList 
     interviewers={props.interviewers}
     value={interviewer}
     onChange={setInterviewer}
    />
  </section>
  <section className="appointment__card-right">
    <section className="appointment__actions">
      <Button onClick={cancel} danger>Cancel</Button>
      <Button onClick={validate} confirm>Save</Button>
    </section>
  </section>
</main>
  );
}