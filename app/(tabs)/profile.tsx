import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, View, Text } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function Profile() {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const { session } = useAuth();

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setFullname(data.full_name)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

async function updateProfile({
    username,
    website,
    avatar_url,
    full_name
  }: {
    username: string
    website: string
    avatar_url: string
    full_name: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='flex-1 bg-white p-5 gap-3'>
      <Stack.Screen options={{ title: 'Profile' }} />

      <TextInput
          editable={false}
          value={session?.user.email}
          placeholder="username"
          autoCapitalize={'none'}
          className="border rounded-md border-grey-200 p-3 text-black-600"
        />

      <TextInput
          onChangeText={(text) => setFullname(text)}
          value={fullname}
          placeholder="full name"
          autoCapitalize={'none'}
          className="border rounded-md border-grey-200 p-3"
        />

      <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="username"
          autoCapitalize={'none'}
          className="border rounded-md border-grey-200 p-3"
        />

      <TextInput
          onChangeText={(text) => setWebsite(text)}
          value={website}
          placeholder="website"
          autoCapitalize={'none'}
          className="border rounded-md border-grey-200 p-3"
        />

      <Pressable 
            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullname })} 
            disabled={loading} 
            className="items-center rounded-md border-2 border-red-500 p-3 px-8">
          <Text className="text-lg font-bold text-red">Update</Text>
        </Pressable>

      <Button title='Sign Out' onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

