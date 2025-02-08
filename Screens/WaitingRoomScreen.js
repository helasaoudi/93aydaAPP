import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:3000"; // Remplace par l'IP de ton serveur si besoin

const WaitingRoom = ({ route }) => {
  const { sessionCode, OwnerId, ownerName, ownerAvatar, playerId } = route.params;
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connexion au serveur Socket.io
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Rejoindre la session spécifique
    newSocket.emit("joinSession", sessionCode);

    // Récupérer la liste initiale des joueurs
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${SOCKET_SERVER_URL}/game-sessions/${sessionCode}/players`);
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();

    // Écouter les mises à jour en temps réel des joueurs
    newSocket.on("playerJoined", (newPlayer) => {
      setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    });

    // Nettoyage lors du démontage du composant
    return () => {
      newSocket.disconnect();
    };
  }, [sessionCode]);

  const addPlayerToSession = (newPlayer) => {
    // Envoie un événement à ton serveur pour ajouter un joueur
    socket.emit("newPlayer", { sessionCode, player: newPlayer });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Waiting for other players to join...</Text>

      {/* QR Code */}
      <QRCode
        value={`http://localhost:3000/game-sessions/join/${sessionCode}`}
        size={200}
        color="black"
        backgroundColor="white"
      />

      <Text style={{ marginTop: 20, fontSize: 16 }}>Session Code: {sessionCode}</Text>

      {/* Owner Information */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Image 
          source={{ uri: ownerAvatar }} 
          style={{ width: 80, height: 80, borderRadius: 40 }} 
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{ownerName} (Host)</Text>
      </View>

      {/* List of Players */}
      <FlatList
        data={players}
        keyExtractor={(item) => item.playerId}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Image 
              source={{ uri: item.playerAvatar }} 
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} 
            />
            <Text style={{ fontSize: 16 }}>{item.playerName}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default WaitingRoom;
