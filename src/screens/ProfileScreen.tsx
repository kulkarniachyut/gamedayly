import React, { useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { SignedInStackParamList } from '../types';
import { IAuth, useAuth } from '../Auth';
import Axios from '../utils/axiosAuthenticated';
import { IAuthUserInfo, IConsole, IUserConsole } from '../interfaces';
import { CONSOLES } from '../config/constants';

export interface IProfileScreenProps {
  route: RouteProp<SignedInStackParamList, 'Profile'>;
  navigation: StackNavigationProp<SignedInStackParamList, 'Profile'>;
}

const ProfileScreen: React.FC<IProfileScreenProps> = () => {
  const auth = useAuth() as IAuth;
  const user = auth.user as IAuthUserInfo;
  const axios = Axios(auth);

  const [isUpdating, setIsUpdating] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user.username || '',
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    consoles: user.consoles || [],
  });

  const handleChange = (key: string, value: string) => {
    setUserInfo((info) => ({
      ...info,
      [key]: value,
    }));
  };

  const handleConsoleButtonPress = (console: IConsole) => {
    setUserInfo((info) => {
      const consoles = info.consoles.filter(
        (userConsole) => userConsole.consoleId !== console.id,
      );
      if (consoles.length === info.consoles.length) {
        consoles.push({
          consoleId: console.id,
          userConsoleId: '',
          games: [],
        });
      }

      return {
        ...info,
        consoles,
      };
    });
  };

  const handleUserConsoleIdChange = (
    userConsole: IUserConsole,
    userConsoleId: string,
  ) => {
    setUserInfo((info) => {
      const consoles = info.consoles.map((item) =>
        item.consoleId === userConsole.consoleId
          ? { ...item, userConsoleId }
          : item,
      );

      return { ...info, consoles };
    });
  };

  const handleUpdatePress = () => {
    setIsUpdating(true);

    axios
      .post(`/profile/${auth.user?.userId}/update`, { ...userInfo })
      .then(() => {
        setIsUpdating(false);
      })
      .catch(() => {
        setIsUpdating(false);
      });
  };

  return (
    <View>
      <TextInput
        label="Phone Number"
        style={styles.textInput}
        value={userInfo.phoneNumber}
        onChangeText={(value) => handleChange('phoneNumber', value)}
        disabled={!!userInfo.phoneNumber}
      />
      <TextInput
        label="Username"
        style={styles.textInput}
        value={userInfo.username}
        onChangeText={(value) => handleChange('username', value)}
        disabled={!!user.username}
      />
      <TextInput
        label="Name"
        style={styles.textInput}
        value={userInfo.name}
        onChangeText={(value) => handleChange('name', value)}
      />
      <TextInput
        label="Email"
        style={styles.textInput}
        value={userInfo.email}
        onChangeText={(value) => handleChange('email', value)}
      />

      <Text>Choose your console</Text>
      <View style={styles.consolesContainer}>
        {CONSOLES.map((console) => {
          const exists = userInfo.consoles.find(
            (userConsole) => userConsole.consoleId === console.id,
          );

          const containerStyle = {
            backgroundColor: exists ? 'skyblue' : 'gray',
          };
          const textStyle = { color: exists ? 'blue' : 'black' };

          return (
            <View key={console.id} style={styles.consoleContainer}>
              <TouchableOpacity
                style={[styles.consoleButton, containerStyle]}
                onPress={() => handleConsoleButtonPress(console)}
              >
                <Text style={textStyle}>{console.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {userInfo.consoles.map((userConsole) => {
        const console = CONSOLES.find(
          (item) => userConsole.consoleId === item.id,
        );

        return console ? (
          <TextInput
            key={console.id}
            label={console.idTextInputLabel}
            style={styles.textInput}
            value={userConsole.userConsoleId}
            onChangeText={(value) =>
              handleUserConsoleIdChange(userConsole, value)
            }
          />
        ) : null;
      })}

      <Button mode="contained" onPress={handleUpdatePress} loading={isUpdating}>
        <Text>Update</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    margin: 10,
  },
  consolesContainer: { flexDirection: 'row' },
  consoleContainer: { margin: 20 },
  consoleButton: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
