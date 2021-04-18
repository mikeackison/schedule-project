export function getAppointmentsForDay(state, day) {
  
  if (state.days.length === 0) {
    return [];
  }

  const dayObject = state.days.find((specificDay) => specificDay.name === day);

  if (!dayObject) {
    return [];
  }

  const appointmentsObject = dayObject.appointments;
  const mappedDays = appointmentsObject.map((id) => state.appointments[id]);

  return mappedDays;

}