import React from 'react';
import { Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// import { useAuth } from '../Auth';
import { ChatStackParamList } from '../types';

export interface IChatScreenProps {
  route: RouteProp<ChatStackParamList, 'Chat'>;
  navigation: StackNavigationProp<ChatStackParamList, 'Chat'>;
}

const ChatScreen: React.FC<IChatScreenProps> = (): JSX.Element | null => {
  // const auth = useAuth();
  // const user = auth?.user;

  return (
    <View>
      <Text>Chat</Text>
    </View>
  );
};

export default ChatScreen;
