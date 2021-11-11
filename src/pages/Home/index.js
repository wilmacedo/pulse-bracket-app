import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AsyncStorage, Dimensions, Text, TouchableOpacity } from 'react-native';

import init from 'react_native_mqtt';

import {
  Container,
  Title,
  Header,
  ButtonContainer,
  CardContainer,
  HearhCardContainer,
  HearthHeader,
  HearthContent,
} from './styles';

import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function App() {
  const [recentData, setRecentData] = useState([0]);
  const [bpm, setBPM] = useState(0);

  const host = 'broker.mqtt-dashboard.com';
  const port = 8000;
  const topic = 'PulseBracket/BPM';
  const storageKey = '@PulseBracket:pulses';

  const putData = async data => {
    let pulses = await AsyncStorage.getItem(storageKey);

    if (pulses === null) {
      let initialData = [{ value: data, date: new Date().getTime() }];
      await AsyncStorage.setItem(storageKey, JSON.stringify(initialData));
      return;
    }

    let parsedPulses = JSON.parse(pulses);

    console.log(new Date().getTime());

    parsedPulses.push({ value: data, date: new Date().getTime() });

    const filtered = parsedPulses
      .filter(pulse => pulse.date > new Date().getTime() - 90000)
      .map(pulse => Number(pulse.value));

    await AsyncStorage.setItem(storageKey, JSON.stringify(parsedPulses));
    setRecentData(filtered);
  };

  const showData = async () => {
    const pulses = await AsyncStorage.getItem(storageKey);
    console.log(pulses);
  };

  const clearData = async () => {
    await AsyncStorage.removeItem(storageKey);
  };

  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      sync: {},
    });

    const client = new Paho.MQTT.Client(
      host,
      port,
      `randomClient#${Math.random() * 100}`,
    );
    client.onMessageArrived = entry => {
      const data = entry.payloadString;

      if (!isNaN(data)) {
        setBPM(data);
        putData(data);
      }

      console.log('Message arrivied: ', data);
    };
    client.onConnectionLost = err => {
      console.log('Connection losted: ', err.errorMessage);
    };
    client.connect({
      onSuccess: () => {
        console.log('Connected');
        client.subscribe(topic);
      },
      onFailure: err => {
        console.log('Failure when try new connection: ', err.errorMessage);
      },
      useSSL: false,
    });
  }, []);

  const Chart = () => {
    const labels = ['10s', '30s', '60s', '90s'];

    const data = {
      labels,
      datasets: [{ data: recentData }],
    };

    return (
      <LineChart
        data={data}
        width={Dimensions.get('screen').width - 50}
        height={230}
        withDots={false}
        chartConfig={{
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          color: (opacity = 1) => `rgba(0, 125, 242, ${opacity})`,
        }}
        bezier
        style={{
          borderRadius: 32,
        }}
      />
    );
  };

  return (
    <Container>
      <StatusBar style="dark" />
      <Header>
        <Title>Pulse Bracelet</Title>
        <ButtonContainer>
          <TouchableOpacity onPress={clearData}>
            <MaterialIcons name="clear" size={24} color="black" />
          </TouchableOpacity>
        </ButtonContainer>
      </Header>

      <CardContainer>
        <Chart />
      </CardContainer>
      <HearhCardContainer>
        <HearthContent>
          <FontAwesome5 name="heartbeat" size={32} color="red" />
          <HearthHeader>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Tempo Real</Text>
            <Text style={{ color: 'gray' }}>Batimos por segundo</Text>
          </HearthHeader>
        </HearthContent>
        <Text style={{ fontSize: 32, fontWeight: '700' }}>{bpm}</Text>
      </HearhCardContainer>
    </Container>
  );
}
