import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { SignedInStackParamList } from '../types';

export interface IProfileScreenProps {
  route: RouteProp<SignedInStackParamList, 'Profile'>;
  navigation: StackNavigationProp<SignedInStackParamList, 'Profile'>;
}

function ProfileScreen(): JSX.Element {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
}

export default ProfileScreen;
