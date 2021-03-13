import React from 'react';
import { Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// import { useAuth } from '../Auth';
import { HomeStackParamList } from '../types';

export interface IHomeScreenProps {
  route: RouteProp<HomeStackParamList, 'Home'>;
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>;
}

const HomeScreen: React.FC<IHomeScreenProps> = (): JSX.Element | null => {
  // const auth = useAuth();
  // const user = auth?.user;

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default HomeScreen;
