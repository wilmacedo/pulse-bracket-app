import React, { useEffect, useState } from 'react';
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
import { Container, Information, Input, Status, Title, Button } from './styles';

export default function App() {
  const [mqttClient, setMqttClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const host = 'broker.mqttdashboard.com';
  const port = 8000;
  const topic = 'PulseBracket/BPM';

  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      sync: {},
    });

    const client = new Paho.MQTT.Client(host, port, 'randomClient');
    client.onMessageArrived = entry => {
      console.log('Message arrivied: ', entry.payloadString);
    };
    client.onConnectionLost = err => {
      console.log('Connection losted: ', err.errorMessage);
      setIsConnected(false);
    };
    client.connect({
      onSuccess: () => {
        console.log('Connected');
        client.subscribe(topic);
        setIsConnected(true);
      },
      onFailure: err => {
        console.log('Failure when try new connection: ', err);
      },
      useSSL: false,
    });

    setMqttClient(client);
  }, []);

  const sendMessage = message => {
    const payload = new Paho.MQTT.Message(message);
    payload.destinationName = topic;

    mqttClient.send(payload);
    setIsConnected(true);
  };

  const handleInput = text => {
    setInputMessage(text);
  };

  return (
    <Container>
      <Title>Pulse Bracket MQTT</Title>
      <Information>
        Status:{' '}
        <Status isConnected={isConnected}>
          {isConnected ? 'Conectado' : 'Aguardando conexão...'}
        </Status>
      </Information>
      <Input onChangeText={handleInput} placeholder="Envie uma mensagem" />
      <Button onPress={() => sendMessage(inputMessage)} title="Enviar" />
    </Container>
  );
}
