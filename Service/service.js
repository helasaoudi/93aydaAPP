import axios from 'axios';

// URL de votre API backend
const API_URL = 'http://localhost:3000/players'; // Adaptez cette URL selon votre backend

const createPlayer = async (userName, avatar) => {
  try {
    const response = await axios.post(API_URL, {
      user_name: userName,
      avatar: avatar,
    });
    return response.data; // Si tout se passe bien, on renvoie les données du joueur créé
  } catch (error) {
    throw new Error('Erreur lors de la création du joueur : ' + error.message);
  }
};

export default {
  createPlayer,
};
