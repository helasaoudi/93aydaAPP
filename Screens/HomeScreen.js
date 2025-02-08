import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Platform, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import service from '../Service/service';

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null); // Gérer la sélection de l'avatar
  const [showModal, setShowModal] = useState(false); // Modal pour choisir un avatar
  const [gameStarted, setGameStarted] = useState(false); // Gérer si le jeu a commencé ou non

  // Exemple de liste d'avatars, vous pouvez la remplacer par des avatars réels
  const avatars = [
    'https://www.example.com/avatar1.png',
    'https://www.example.com/avatar2.png',
    'https://www.example.com/avatar3.png',
    // Ajoutez d'autres avatars ici
  ];

  const handleYallaClick = async () => {
    if (!text || !selectedAvatar) {
      Alert.alert("Erreur", "Veuillez entrer un nom et choisir un avatar.");
      return;
    }

    try {
      // Appeler le service pour créer le joueur
      const player = await service.createPlayer(text, selectedAvatar);

      // Une fois le joueur créé, naviguer vers la page de catégorie avec les informations
      setText('');
      setSelectedAvatar(null); // Réinitialiser l'état
      setGameStarted(true); // Commencer le jeu
      navigation.navigate('Category', { name: player.user_name, avatar: player.avatar, sessionId: player._id });

      console.log("the palyer is :",player)
    } catch (error) {
      Alert.alert("Erreur", error.message); // Afficher un message d'erreur si quelque chose va mal
    }
  };

  const handleClick = () => {
    if (!text) {
      Alert.alert("Erreur", "Veuillez entrer un nom.");
    } else {
      setGameStarted(true); // Démarrer le jeu quand le nom est rempli
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/5.png')} 
        style={styles.centerImage}
      />

      <Card style={styles.card}>
        <Card.Content>
          {!gameStarted ? (
            <>
              <Text style={styles.text}>باش تبدا تلعب معانا اكتب اسمك هنا</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="اكتب اسمك هنا..."
                  value={text}
                  onChangeText={setText}
                />
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={handleClick}
                >
                  <Text style={styles.buttonText}>هيّا نبداو</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.avatarContainer}>
                {!selectedAvatar && (
                  <View style={styles.emptyAvatarCircle}>
                    <Text style={styles.emptyAvatarText}>؟</Text>
                  </View>
                )}
                {selectedAvatar && (
                  <Avatar.Image size={80} source={{ uri: selectedAvatar }} style={styles.selectedAvatar} />
                )}

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={selectedAvatar ? handleYallaClick : () => setShowModal(true)}
                >
                  <Text style={styles.buttonText}>
                    {selectedAvatar ? 'Yalla' : 'Choisir un avatar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.avatarOption, selectedAvatar === avatar && styles.selectedOption]}
                  onPress={() => {
                    setSelectedAvatar(avatar);
                    setShowModal(false);
                  }}
                >
                  <Avatar.Image size={80} source={{ uri: avatar }} style={styles.avatarImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5e1c9',
  },
  centerImage: {
    width: 400,
    height: 400,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  card: {
    width: '90%',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    marginBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: '5%',
    right: '5%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'red',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginLeft: 0,
    paddingHorizontal: 10,
    height: 50,
  },
  buttonContainer: {
    backgroundColor: '#003366',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  avatarContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8a8a8a',
  },
  selectedAvatar: {
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarOption: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    width: 100,
  },
  avatarImage: {
    margin: 10,
    borderRadius: 40,
  },
  selectedOption: {
    borderColor: '#003366',
    borderWidth: 2,
  },
});
 
export default HomeScreen;
