import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';
import {
  BottomTabParamList,
  ChatStackParamList,
  HomeStackParamList,
  SignedInStackParamList,
  SignedOutStackParamList,
} from '../types';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const SignedOutStack = createStackNavigator<SignedOutStackParamList>();

const SignedInStack = createStackNavigator<SignedInStackParamList>();

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const HomeStack = createStackNavigator<HomeStackParamList>();

const ChatStack = createStackNavigator<ChatStackParamList>();

export default function Navigation({
  isSignedIn,
  isProfileComplete,
}: {
  isSignedIn: boolean;
  isProfileComplete: boolean;
}): JSX.Element | null {
  return (
    <NavigationContainer>
      {isSignedIn ? (
        <SignedInNavigator isProfileComplete={isProfileComplete} />
      ) : (
        <SignedOutNavigator />
      )}
    </NavigationContainer>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="Chat" component={ChatScreen} />
    </ChatStack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="HomeTab">
      <BottomTab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <BottomTab.Screen
        name="ChatTab"
        component={ChatStackNavigator}
        options={{ title: 'Chat' }}
      />
    </BottomTab.Navigator>
  );
}

function SignedInNavigator({
  isProfileComplete,
}: {
  isProfileComplete: boolean;
}) {
  return (
    <SignedInStack.Navigator>
      {isProfileComplete ? (
        <>
          <SignedInStack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <SignedInStack.Screen name="Profile" component={ProfileScreen} />
      )}
    </SignedInStack.Navigator>
  );
}

function SignedOutNavigator() {
  return (
    <SignedOutStack.Navigator screenOptions={{ headerShown: false }}>
      <SignedOutStack.Screen name="SignIn" component={SignInScreen} />
      <SignedOutStack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
      />
    </SignedOutStack.Navigator>
  );
}
