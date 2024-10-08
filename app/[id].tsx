import dayjs from 'dayjs';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import { supabase } from '~/utils/supabase';
import { Event } from '../components/EventListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { Session } from '@supabase/supabase-js';

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    const { data: attendanceData, error: err } = await supabase.from('attendance').select('*').eq('user_id', user?.id).eq('event_id', id).single();

    if (data) {
      setEvent(data);
    }
    setAttendance(attendanceData);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const joinEvents = async () => {
    // Add event to user's attending events
    const { data, error } = await supabase.from('attendance').insert({ user_id: user?.id , event_id: event?.id }).select().single();
    setAttendance(data);
  }

  if (loading){
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <Stack.Screen
        options={{ title: 'Event', headerBackTitleVisible: false, headerTintColor: 'black' }}
      />

      <Image source={{ uri: event.image_uri }} className="aspect-video w-full rounded-xl" />

      <Text className="text-3xl font-bold" numberOfLines={2}>
        {event.title}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
      </Text>

      <Text className="text-lg" numberOfLines={2}>
        {event.description}
      </Text>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-300 p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>

        { attendance ? (
          <Text className='font-bold text-green-500'>You Are Attending!</Text>
        ) : (
            <Pressable onPress={() => joinEvents()} className="rounded-md bg-red-500 p-5 px-8">
              <Text className="text-lg font-bold text-white">Join and RSVP</Text>
            </Pressable>)}
      </View>
    </View>
  );
}