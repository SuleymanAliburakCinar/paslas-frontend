import { React, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import api from '../services/LobbyService';

export default function Lobby() {

  const { id } = useParams();
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const response = await api.getLobbyById(id);
        setLobby(response.data);
      } catch (error) {
        console.error("Lobi alınırken hata oluştu:", error);
      }
    };
    fetchLobby();
  }, [id]);

  return (
    <div>
      <h1>{lobby?.name}</h1>
      <p>This lobby have {lobby?.members.length} members</p>
    </div>
  )
}