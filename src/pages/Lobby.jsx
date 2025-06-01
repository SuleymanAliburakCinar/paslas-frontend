import { React, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import lobbyApi from '../services/LobbyService';
import eventApi from '../services/EventService';
import { VerticalList } from "../components/VerticalList";
import styles from "./Lobby.module.css";
import { set } from "react-hook-form";

export default function Lobby() {

  const { id } = useParams();
  const [lobby, setLobby] = useState(null);
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const response = await lobbyApi.getLobbyById(id);
        setLobby(response.data);
      } catch (error) {
        console.error("Lobi alınırken hata oluştu:", error);
      }
    };
    const fetchEventsAndParticipants = async () => {
      try {
        const response = await eventApi.getAllEvents(id);
        const eventList = response.data;

        const eventsWithParticipants = await Promise.all(
          eventList.map(async (event) => {
            const participants = await fetchParticipants(event.id);
            return { ...event, participants: participants || [] };
          })
        );
        setEvents(eventsWithParticipants);
        console.log(eventsWithParticipants);
      } catch (error) {
        console.error("Etkinlikler alınırken hata oluştu:", error);
      }
    };
    const fetchParticipants = async (eventId) => {
      try {
        const response = await eventApi.getParticipant(eventId);
        return response.data;
      } catch (error) {
        console.error("Katılımcılar alınırken hata oluştu:", error);
      }
    };
    fetchLobby().then(() => {
      fetchEventsAndParticipants();
    });
  }, [id]);

  const fetchApplyEvent = async (eventId) => {
    try {
      const response = await eventApi.applyEvent(eventId);
      console.log("Etkinliğe katılım başarılı:", response.data);
    } catch (error) {
      console.error("Etkinliğe katılım sırasında hata oluştu:", error);
    }
  }

  const fetchLeaveEvent = async (eventId) => {
    try {
      const response = await eventApi.leaveEvent(eventId);
      console.log("Etkinlikten ayrılma başarılı:", response.data);
    } catch (error) {
      console.error("Etkinlikten ayrılma sırasında hata oluştu:", error);
    }
  }

  const memberListRender = (member) => {
    const isOwner = member.role === "OWNER";
    const memberStyle = {
      color: isOwner ? "#007bff" : "#333", // mavi: bootstrap mavi tonu
      fontWeight: isOwner ? "bold" : "normal",
    };
    return (
      <div>
        <div style={memberStyle}>{member.username}</div>
      </div>
    );
  }

  const eventListRender = (event) => {
    const formatDateTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleString("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    };

    return (
      <div>
        <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>{event.name}</div>
        <div style={{ fontSize: "0.95em", margin: "4px 0" }}>
          {event.description}
        </div>
        <div style={{ fontSize: "0.85em", color: "#555" }}>
          <div>
            <strong>Etkinlik Tarihi:</strong> {formatDateTime(event.eventTime)}
          </div>
          <div>
            <strong>Kontenjan:</strong> {event.capacity} kişi
          </div>
          <div>
            <strong>Durum:</strong> {event.status === "OPEN" ? "Açık" : "Kapalı"}
          </div>
        </div>
      </div>
    );
  }

  const eventDisplay = (event) => {
    if (!event) {
      return <p>Etkinlik seçilmedi.</p>;
    }

    const formatDateTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleString("tr-TR", {
        dateStyle: "full",
        timeStyle: "short",
      });
    };

    const participantCount = {
      confirmed: event.participants?.confirmedParticipation?.length || 0,
      waitlisted: event.participants?.waitlistedParticipation?.length || 0,
      declined: event.participants?.declinedParticipation?.length || 0,
    };

    return (
      <div style={{ lineHeight: "1.6" }}>
        <h2>{event.name}</h2>
        <p>{event.description}</p>

        <div>
          <strong>Etkinlik Tarihi:</strong> {formatDateTime(event.eventTime)}
        </div>
        <div>
          <strong>Oluşturan:</strong> {event.createdBy}
        </div>
        <div>
          <strong>Oluşturulma Tarihi:</strong> {formatDateTime(event.createdAt)}
        </div>
        <div>
          <strong>Kontenjan:</strong> {event.capacity}
        </div>
        <div>
          <strong>Durum:</strong>{" "}
          {event.status === "OPEN" ? "Açık" : "Kapalı"}
        </div>

        <hr style={{ margin: "12px 0" }} />

        <h4>Katılım Durumu</h4>
        <ul>
          <li>Onaylanan: {participantCount.confirmed}</li>
          <li>Bekleyen: {participantCount.waitlisted}</li>
          <li>Reddedilen: {participantCount.declined}</li>
        </ul>

        <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
          <button
            onClick={() => fetchApplyEvent(event.id)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Katıl
          </button>
          <button
            onClick={() => fetchLeaveEvent(event.id)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            İptal Et
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.userList}>
        <VerticalList
          title="Katılımcılar"
          items={lobby?.members || []}
          renderItem={(member) => memberListRender(member)}
        />
      </div>

      <div className={styles.selectedEventInfo}>
        {selectedEvent && (
          eventDisplay(selectedEvent)
        )}
      </div>

      <div className={styles.eventList}>
        <VerticalList
          title="Etkinlikler"
          items={events || []}
          onItemClick={(id) => {
            const selected = events.find((e) => e.id === id);
            if (selected === selectedEvent) { setSelectedEvent(null); return; }
            setSelectedEvent(selected);
          }}
          renderItem={(event) => eventListRender(event)}
        />
      </div>
    </div>
  )
}