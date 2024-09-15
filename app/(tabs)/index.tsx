import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import EventListItem from '~/components/EventListItem';
import { supabase } from '~/utils/supabase';
import { Event, NearbyEvent } from '~/types/db';

export default function Events() {
  const [events, setEvents] = useState<NearbyEvent[]>([]);

  useEffect(() => {
    fetchNearbyEvents();
  }, []);

  const fetchAllEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');

    if (data) {
      setEvents(data ?? []);   
    }
  }

  const fetchNearbyEvents = async () => {
    const { data, error } = await supabase.rpc('nearby_events', {
      lat: -26.331215962196655, 
      long: 28.204989361319793,
    });
  }
  

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />

      <FlatList
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
        className="bg-white"
      />
    </>
  );
}
