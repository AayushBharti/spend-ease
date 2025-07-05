import CustomTabs from '@/components/custom-tabs';
import { AuthProvider } from '@/context/auth-context';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function _layout  () {
  return (
    <AuthProvider>
      <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index"></Tabs.Screen>
        <Tabs.Screen name="statistics"></Tabs.Screen>
        <Tabs.Screen name="wallet"></Tabs.Screen>
        <Tabs.Screen name="more"></Tabs.Screen>
      </Tabs>
    </AuthProvider>
  );
};


const styles = StyleSheet.create({});
