import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';
import { SignedInStackParamList, SignedOutStackParamList } from '../types';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';

const SignedOutStack = createStackNavigator<SignedOutStackParamList>();

const SignedInStack = createStackNavigator<SignedInStackParamList>();

export default function Navigation({
  isSignedIn,
}: {
  isSignedIn: boolean;
}): JSX.Element | null {
  return (
    <NavigationContainer>
      {isSignedIn ? <SignedInNavigator /> : <SignedOutNavigator />}
    </NavigationContainer>
  );
}

function SignedInNavigator() {
  return (
    <SignedInStack.Navigator screenOptions={{ headerShown: false }}>
      <SignedInStack.Screen name="Home" component={HomeScreen} />
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
