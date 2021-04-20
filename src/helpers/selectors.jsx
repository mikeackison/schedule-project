export function getAppointmentsForDay(state, day) {
  
  if (state.days.length === 0) {
    return [];
  }

  const dayObject = state.days.find((specificDay) => specificDay.name === day);

  if (dayObject.length === 0) {
    return [];
  }

  const appointmentsArray = dayObject.appointments;
  if (appointmentsArray.length === 0) {
    return [];
  }
  
  console.log("ARRAY",appointmentsArray)
  
  console.log("STATE", state)
  const mappedDays = appointmentsArray.map((id) => state.appointments[id]);

  return mappedDays;

}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const tempIntID = state.interviewers[interviewerId];
  const result = { ...interview, interviewer: tempIntID };

  return result;
}

export function getInterviewersForDay(state, day) {

  if(state.days.length === 0) {
    return []
  }

  const dayObject = state.days.find(specificDay  => specificDay.name === day);

  if (!dayObject) {
    return []
  }

  const appObject = dayObject.interviewers
  const mappedDays = appObject.map((id) => state.interviewers[id])

  return mappedDays;


}