import api from '../lib/axios';

const getAllLobby = (userId) => {
  return api.get(`/api/users/${userId}/lobbies`);
}

const getLobbyById = (lobbyId) => {
  return api.get(`/api/lobbies/${lobbyId}`);
}

const updateLobbyMemberRole = (request) => {
  return api.put(`/api/users`, request);
}

const joinLobby = (joinCode) => {
  return api.get(`/api/lobbies/join/${joinCode}`);
}

const createLobby = (lobbyName) => {
  return api.get(`/api/lobbies/create/${lobbyName}`);
}

const userService = {
  getAllLobby,
  getLobbyById,
  updateLobbyMemberRole,
  joinLobby,
  createLobby,
};

export default userService;