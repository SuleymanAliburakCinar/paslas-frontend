import api from '../lib/axios';

const getAllLobby = (userId) => {
  return api.get(`/api/users/${userId}/lobbies`);
}

const getLobbyById = (lobbyId) => {
  return api.get(`/api/lobbies/${lobbyId}`);
}

const userService = {
  getAllLobby,
  getLobbyById,
};

export default userService;