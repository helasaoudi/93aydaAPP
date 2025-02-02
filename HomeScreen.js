import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Avatar, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


// Simulate SQLite for web
const openDatabase = (name) => {
  console.log(`Opening database: ${name}`);
  return {
    transaction: (callback) => {
      console.log('Starting transaction...');
      callback({
        executeSql: (sql, params, successCallback, errorCallback) => {
          console.log(`Executing SQL: ${sql} with params: ${JSON.stringify(params)}`);
          if (sql.startsWith('CREATE TABLE')) {
            console.log('Table created');
            successCallback();
          } else if (sql.startsWith('INSERT INTO')) {
            console.log('Data inserted');
            successCallback();
          } else {
            errorCallback(null, new Error('Unknown SQL command'));
          }
        },
      });
    },
  };
};

export default function HomeScreen() {
  const db = openDatabase('93ayda.db');
  const [text, setText] = useState('');
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation(); // Déplace cette ligne à l'intérieur du composant fonctionnel


  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, avatar TEXT);`,
        [],
        () => {
          console.log('Table created successfully (simulated)');
        },
        (tx, error) => {
          console.log('Error creating table:', error);
        }
      );
    });
  };

  const insertData = (name, avatar) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO users (name, avatar) VALUES (?, ?)`,
        [name, avatar],
        () => {
          console.log('Data inserted (simulated)');
        },
        (tx, error) => {
          console.log('Error inserting data:', error);
        }
      );
    });
  };
  const createSaisonTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS saison (id INTEGER PRIMARY KEY AUTOINCREMENT, etat BOOLEAN);`,
        [],
        () => console.log('Table saison créée avec succès'),
        (tx, error) => console.log('Erreur lors de la création de la table saison:', error)
      );
    });
  };
  

  useEffect(() => {
    createTable();
    createSaisonTable();
  }, []);

  const avatarStyles = ['pixel-art', 'avataaars', 'identicon', 'bottts', 'gridy'];

  const generateAvatars = () => {
    const newAvatars = [];
    avatarStyles.forEach(style => {
      for (let i = 0; i < 4; i++) {
        const url = `https://api.dicebear.com/5.x/${style}/svg?seed=${text}${i}`;
        newAvatars.push(url);
      }
    });
    setAvatars(newAvatars);
  };
  


  const handleClick = () => {
    if (!text) {
      Alert.alert("Erreur", "Veuillez entrer un nom.");
      return;
    }
    setGameStarted(true); // Passer à l'étape suivante
  };
  const insertSaison = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO saison (etat) VALUES (1);`,
        [],
        () => console.log('État de la saison ajouté'),
        (tx, error) => console.log('Erreur lors de lajout de létat de la saison:', error)
      );
    });
  };

  const handleYallaClick = () => {
    if (!text || !selectedAvatar) {
      Alert.alert("Erreur", "Veuillez entrer un nom et choisir un avatar.");
      return;
    }

    // Insérer les données dans la base de données
    insertData(text, selectedAvatar);
    insertSaison();
    // Afficher un message de succès
    Alert.alert("Succès", "Joueur ajouté avec succès !");
    setGameStarted(false); // Réinitialiser l'état pour recommencer
    setText(''); // Réinitialiser le texte
    setSelectedAvatar(null); // Réinitialiser l'avatar
   navigation.navigate('ShareScreen'); 
  };

  useEffect(() => {
    if (text.length > 0) {
      generateAvatars();
    }
  }, [text]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {!gameStarted ? (
            // Étape 1 : Entrer le nom
            <>
              <Text style={styles.text}>باش تبدا تلعب معانا اكتب اسمك هنا</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="اكتب اسمك هنا..."
                  value={text}
                  onChangeText={setText}
                  mode="outlined"
                />
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={handleClick} // Passer à l'étape suivante
                >
                  <Text style={styles.buttonText}>هيّا نبداو</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Étape 2 : Choisir un avatar
            <>
              <View style={styles.avatarContainer}>
                {/* Cercle vide pour l'avatar sélectionné */}
                {!selectedAvatar && (
                  <View style={styles.emptyAvatarCircle}>
                    <Text style={styles.emptyAvatarText}>؟</Text>
                  </View>
                )}
                {selectedAvatar && (
                  <Avatar.Image size={80} source={{ uri: selectedAvatar }} style={styles.selectedAvatar} />
                )}

                {/* Bouton pour choisir un avatar ou confirmer avec Yalla */}
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={selectedAvatar ? handleYallaClick : () => setShowModal(true)} // handleYallaClick pour Yalla, sinon ouvrir la modale
                >
                  <Text style={styles.buttonText}>
                    {selectedAvatar ? 'Yalla' : 'Choisir un caractère'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Modale pour choisir un avatar */}
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
                    setSelectedAvatar(avatar); // Sélectionner l'avatar
                    setShowModal(false); // Fermer la modale
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  card: {
    width: '90%',
    padding: 40,
    backgroundColor: '#B09FE5',
    borderRadius: 30,
    elevation: 7,
    marginBottom: 40,
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
  },
  buttonContainer: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 2,
    borderColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
  },
  selectedAvatar: {
    borderWidth: 4,
    borderColor: '#003366',
    borderRadius: 40,
    marginTop: 10,
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