import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
  nome: string;
}

interface IBGECityResponse {
  nome: string;
}

interface PickerValue {
  label: string;
  value: string;
}

const Home = () => {
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [ufs, setUfs] = useState<PickerValue[]>([]);
  const [cities, setCities] = useState<PickerValue[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then(response => {
        const ufInitials = response.data.map(uf => ({
          label: uf.nome,
          value: uf.sigla,
        }));

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (!selectedUf) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then(response => {
        const cityName = response.data.map(city => ({
          label: city.nome,
          value: city.nome,
        }));

        setCities(cityName);
      });
  }, [selectedUf]);

  const handleNavigateToPoints = () => {
    if (!selectedUf || !selectedCity) {
      return;
    }

    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de residuos.
            </Text>

            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coletas de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View>
          <View style={styles.containerPicker}>
            <RNPickerSelect
              value={selectedUf}
              onValueChange={value => setSelectedUf(value)}
              placeholder={{ label: 'Selecione o estado' }}
              items={ufs}
              Icon={() =>
                Platform.OS === 'ios' && (
                  <Icon name="chevron-down" color="#A0A0B2" size={20} />
                )
              }
            />
          </View>

          <View style={styles.containerPicker}>
            <RNPickerSelect
              value={selectedCity}
              onValueChange={value => setSelectedCity(value)}
              placeholder={{ label: 'Selecione uma Cidade' }}
              items={cities}
              Icon={() =>
                Platform.OS === 'ios' && (
                  <Icon name="chevron-down" color="#A0A0B2" size={20} />
                )
              }
            />
          </View>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
  containerPicker: {
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});

export default Home;
