import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, Button, Text, Pressable } from 'react-native';
import { supabase } from '~/utils/supabase';


export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View className="pt-10 gap-3 p-5 flex-1 bg-white">
        <Stack.Screen options={{ title: 'Sign in'}} />
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          className="border rounded-md border-grey-200 p-3"
        />

        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          className="border rounded-md border-grey-200 p-3"
        />
    
        <View className="flex-row gap-3">
        <Pressable 
            onPress={() => signInWithEmail()} 
            disabled={loading} 
            className="flex-1 items-center rounded-md border-2 border-red-500 p-3 px-8">
          <Text className="text-lg font-bold text-red">Sign In</Text>
        </Pressable>

        <Pressable 
            disabled={loading} 
            onPress={() => signUpWithEmail()} 
            className="flex-1 items-center rounded-md bg-red-500 p-3 px-8">
          <Text className="text-lg font-bold text-white">Sign Up</Text>
        </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})