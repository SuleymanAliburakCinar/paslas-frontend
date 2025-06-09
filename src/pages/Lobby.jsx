import { React, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import lobbyApi from '../services/LobbyService';
import eventApi from '../services/EventService';
import { VerticalList } from "../components/VerticalList";
import styles from "./Lobby.module.css";
import { DropdownMenu } from "../components/DropdownMenu";
import FormField from "../components/FormField";
import { validateEvent } from "../utils/validation/EventValidation";
import { set } from "react-hook-form";

export default function Lobby() {

  const { id } = useParams();
  const [lobby, setLobby] = useState(null);
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errors, setErrors] = useState('');

  const [formData, setFormData] = useState({
    lobbyId: "",
    name: "",
    description: "",
    eventTime: "",
    capacity: "",
  });

  useEffect(() => {
    fetchLobby().then(() => {
      fetchEventsAndParticipants();
    });
  }, [id, selectedEvent]);

  const fetchLobby = async () => {
    try {
      const response = await lobbyApi.getLobbyById(id);
      setLobby(response.data);
      setFormData((prev) => ({
        ...prev,
        lobbyId: response.data.id,
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEvent(formData);
    const isValid = Object.values(validationErrors).every((val) => val === null);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await eventApi.createEvent(formData);
      setSelectedEvent(response.data);
    } catch (err) {
      let errorMessage = "Bilinmeyen bir hata oluştu.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setErrors((prev) => ({
        ...prev,
        server: errorMessage
      }));
    }
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const fetchApplyEvent = async (eventId) => {
    try {
      const response = await eventApi.applyEvent(eventId);
      if (response.status === 200) {
        const participants = await fetchParticipants(eventId);
        setSelectedEvent(prev => ({
          ...prev, participants: participants || []
        }));
      }
      console.log("Etkinliğe katılım başarılı:", response.data);
    } catch (error) {
      console.error("Etkinliğe katılım sırasında hata oluştu:", error);
    }
  }

  const fetchLeaveEvent = async (eventId) => {
    try {
      const response = await eventApi.leaveEvent(eventId);
      if (response.status === 204) {
        const participants = await fetchParticipants(eventId);
        setSelectedEvent(prev => ({
          ...prev, participants: participants || []
        }));
      }
      console.log("Etkinlikten ayrılma başarılı:", response.data);
    } catch (error) {
      console.error("Etkinlikten ayrılma sırasında hata oluştu:", error);
    }
  }

  const updateMemberRole = async (requestData) => {
    try {
      const response = await lobbyApi.updateLobbyMemberRole(requestData);
      if (response.status === 200) {
        setLobby((prev) => ({
          ...prev,
          members: prev.members.map((member) =>
            member.userId === requestData.userId
              ? response.data
              : member
          ),
        }));
      }
    } catch (error) {
      console.error("Admin yapma sırasında hata oluştu:", error);
    }
  }

  const fetchPromoteAdmin = (memberId) => {
    const requestData = {
      userId: memberId,
      lobbyId: lobby.id,
      role: "ADMIN"
    };
    updateMemberRole(requestData);
  }

  const fetchDemoteAdmin = async (memberId) => {
    const requestData = {
      userId: memberId,
      lobbyId: lobby.id,
      role: "PARTICIPANT"
    };
    updateMemberRole(requestData);
  }

  const memberListRender = (member) => {
    const memberRoleColors = {
      OWNER: "#ff5e00",
      ADMIN: "#007bff",
      PARTICIPANT: "#333",
    };
    const memberStyle = {
      color: memberRoleColors[member.role] || "#333",
      fontWeight: "bold",
      display: "inline-block"
    };
    const canManage =
      (lobby.currentUserRole === "OWNER" && member.role !== "OWNER")
    const isAdmin = member.role !== "PARTICIPANT" && member.role !== "OWNER"

    return (
      <div className="wrapper" style={{ display: "flex", alignItems: "center", padding: "4px 8px", justifyContent: "space-between" }}>
        <div style={memberStyle}>{member.username}</div>

        {canManage && (
          <div style={{ marginLeft: "auto", display: "inline-block" }}>
            <DropdownMenu
              options={!isAdmin ? [{ label: "Yetki Ver" }] : [{ label: "Yetki Al" }]}
              onSelect={!isAdmin ? () => fetchPromoteAdmin(member.userId) : () => fetchDemoteAdmin(member.userId)}
            />
          </div>
        )}
      </div>
    );
  }

  const participantListRender = (participant) => {
    const statusColors = {
      CONFIRMED: "#28a745",
      WAITLISTED: "#ffc107",
      DECLINED: "#dc3545",
    }
    const participantStyle = {
      color: statusColors[participant.status] || "#333",
      fontWeight: "bold",
    };
    return (
      <div>
        <div style={participantStyle}>{participant.username}</div>
      </div>
    );
  }

  const eventSortOptions = [
    {
      label: "Tarihe Göre Artan",
      value: "asc-date",
      sortFn: (a, b) => new Date(a.eventTime) - new Date(b.eventTime),
    },
    {
      label: "Tarihe Göre Azalan",
      value: "desc-date",
      sortFn: (a, b) => new Date(b.eventTime) - new Date(a.eventTime),
    },
  ];

  const rolePriority = { OWNER: 1, ADMIN: 2, PARTICIPANT: 3 };

  const userSortOptions = [
    {
      label: "Üyelik Sırası",
      value: "byRoleThenName",
      sortFn: (a, b) =>
        rolePriority[a.role] - rolePriority[b.role] ||
        a.name.localeCompare(b.name),
    }
  ]

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

  const eventCreateForm = () => {
    return (
      <div >
        <h2>Yeni Etkinlik Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Etkinlik Adı *"
            value={formData.name}
            onChange={(val) => handleChange('name', val)}
            error={errors.name}
          />
          <FormField
            label="Açıklama"
            value={formData.description}
            onChange={(val) => handleChange('description', val)}
            error={errors.description}
          />
          <FormField
            label="Etkinlik Tarihi ve Saati *"
            type="datetime-local"
            value={formData.eventTime}
            onChange={(val) => handleChange('eventTime', val)}
            error={errors.eventTime}
          />
          <FormField
            label="Kapasite *"
            type="number"
            value={formData.capacity}
            onChange={(val) => handleChange("capacity", val)}
            error={errors.capacity}
          />
          {errors.server && <p style={{ color: 'red', marginBottom: '1rem' }}>{errors.server}</p>}

          <button type="submit">Event Oluştur</button>
        </form>
      </div>
    )
  }

  const memberTitle = () => {
    return (
    <div style={{ display: "flex", alignItems: "center", padding: "2px 0px", justifyContent: "space-between", width: "100%" }}>
      <span style={{ fontWeight: 'bold', fontSize: '20px' }}>
        Üyeler
      </span>
      <span style={{ fontSize: '14px', color: '#888', whiteSpace: 'nowrap' }}>
        {lobby?.joinCode}
      </span>
    </div>
    )
  }

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.userList}>
        {selectedEvent
          ? (
            <VerticalList
              title="Katılımcılar"
              items={selectedEvent?.participants || []}
              renderItem={(participant) => participantListRender(participant)}
            />
          )
          : (
            <VerticalList
              title={lobby?.currentUserRole !== "PARTICIPANT" ? memberTitle() : "Üyeler"}
              items={lobby?.members || []}
              renderItem={(member) => memberListRender(member)}
              sortOptions={userSortOptions}
              defaultSort="byRoleThenName"
              dropdownVisible={false}
            />)
        }
      </div>

      <div className={styles.selectedEventInfo}>
        {selectedEvent ? (
          eventDisplay(selectedEvent)
        ) : (eventCreateForm())}
      </div>

      <div className={styles.eventList}>
        <VerticalList
          title="Etkinlikler"
          items={events || []}
          onItemClick={(id) => {
            const selected = events.find((e) => e.id === id);
            if (selected?.id === selectedEvent?.id) { setSelectedEvent(null); return; }
            setSelectedEvent(selected);
          }}
          renderItem={(event) => eventListRender(event)}
          sortOptions={eventSortOptions}
        />
      </div>
    </div>
  )
}