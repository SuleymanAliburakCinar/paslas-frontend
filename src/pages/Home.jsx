import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { VerticalList } from "../components/VerticalList";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/LobbyService';

export default function Home() {

  const { user } = useAuth();
  const [joinCode, setJoinCode] = useState("");
  const [lobbies, setLobbies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const response = await api.getAllLobby(user.id);
        setLobbies(response.data);
        console.log("Lobiler:", response.data);
      } catch (error) {
        console.error("Lobiler alınırken hata oluştu:", error);
      }
    }
    fetchLobbies();
  }, [user]);

  const handleJoin = () => {
    alert(`${joinCode} kodu ile lobiye katılma işlemi gerçekleştirilecek.`);
  };

  const handleCreateLobby = () => {
    alert("Yeni lobi oluşturma işlemi tetiklendi.");
  };



  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
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

        <button onClick={handleCreateLobby} className={styles.createLobbyButton}>
          Yeni Lobi Oluştur
        </button>
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
