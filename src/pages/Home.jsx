import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { VerticalList } from "../components/VerticalList";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/LobbyService';

export default function Home() {

  const { user } = useAuth();
  const [joinCode, setJoinCode] = useState("");
  const [lobbyName, setLobbyName] = useState("");
  const [lobbies, setLobbies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLobbies();
  }, [user]);

  const fetchLobbies = async () => {
    try {
      const response = await api.getAllLobby(user.id);
      setLobbies(response.data);
    } catch (error) {
      console.error("Lobiler alınırken hata oluştu:", error);
    }
  }

  const handleJoin = async () => {
    try {
      const response = await api.joinLobby(joinCode);
      if (response.status === 200) {
        fetchLobbies()
      }
    } catch (error) {
      alert("Lobiye katılma işlemi başarısız oldu. Lütfen join kodunu kontrol edin.");
    }
  };

  const handleCreateLobby = async () => {
    try {
      const response = await api.createLobby(lobbyName);
      if (response.status === 200) {
        navigate(`/lobby/${response.data.id}`);
      }
    } catch (error) {
      alert("Yeni lobi oluştururken bir hata oluştu.");
    }
  };



  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.lobbyUtilContainer}>
          <div className={styles.joinLobby}>
            <input
              type="text"
              placeholder="Join kodunu gir"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className={styles.joinInput}
            />
            <button onClick={handleJoin} className={styles.joinButton}>
              Katıl
            </button>
          </div>
          <div className={styles.joinLobby}>
            <input
              type="text"
              placeholder="Lobi adı gir"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
              className={styles.joinInput}
            />
            <button onClick={handleCreateLobby} className={styles.createLobbyButton}>
              Yeni Lobi Oluştur
            </button>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <VerticalList
          title="Aktif Lobiler"
          items={lobbies}
          onItemClick={(lobbyId) => navigate(`/lobby/${lobbyId}`)}
          renderItem={(lobby) => (
            <div>
              <p style={{ fontWeight: "bold" }}>{lobby.name}</p>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {lobby.members.length} üye
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
