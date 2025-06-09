import api from '../lib/axios';

const getAllEvents = (lobbyId) => {
  return api.get(`/api/event/getAll/${lobbyId}`);
}

const getParticipant = (eventId) => {
  return api.get(`/api/event/participations/${eventId}`);
}

const applyEvent = (eventId) => {
  return api.get(`/api/event/apply/${eventId}`);
}

const leaveEvent = (eventId) => {
  return api.get(`/api/event/leave/${eventId}`);
}

const createEvent = (eventForm) => {
  return api.post('/api/event', eventForm);
}

const lobbyService = {
  getAllEvents,
  getParticipant,
  applyEvent,
  leaveEvent,
  createEvent,
};

export default lobbyService;