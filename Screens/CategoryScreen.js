import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons'; // Pour l'icône QR Code

const CategoryScreen = ({ navigation, route }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessionCode, setSessionCode] = useState('');
  
    const { name, avatar, sessionId } = route.params || {};

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Créer une session
    const createSession = async (categoryId) => {
        try {
            const response = await axios.post('http://localhost:3000/game-sessions', {
                categoryId,
                starterPlayerId: sessionId,
                numberOfQuestions: 10,
            });

            const newSessionCode = response.data.code;
            navigation.navigate('WaitingRoom', { 
                sessionCode: newSessionCode, 
                ownerId: sessionId, 
                ownerName: name, 
                ownerAvatar: avatar 
            });        } catch (error) {
            console.error("Error creating session:", error);
        }
    };

    // Rejoindre une session avec un code
    const joinSession = async () => {
        if (!sessionCode.trim()) {
            Alert.alert("Error", "Please enter a session code.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/game-sessions/join', {
                code: sessionCode,
                playerId: sessionId,
            });

            if (response.data) {
                navigation.navigate('WaitingRoom', { 
                    sessionCode, 
                    playerId: sessionId, 
                    playerName: name, 
                    playerAvatar: avatar 
                });            }
        } catch (error) {
            Alert.alert("Error", "Invalid session code.");
            console.error("Error joining session:", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* Section QR Code et Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => Alert.alert("QR Scanner", "QR Scanner not implemented yet.")}>
                    <AntDesign name="qrcode" size={30} color="black" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        flex: 1,
                        borderRadius: 5,
                    }}
                    placeholder="Enter session code"
                    value={sessionCode}
                    onChangeText={setSessionCode}
                />
                <Button title="Join" onPress={joinSession} />
            </View>

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Choose a Category</Text>

            {loading ? (
                <Text>Loading categories...</Text>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 10 }}>
                            <Button title={item.libelle} onPress={() => createSession(item._id)} />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default CategoryScreen;
