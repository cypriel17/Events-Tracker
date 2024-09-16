import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import EventListItem from '~/components/EventListItem';
import { supabase } from '~/utils/supabase';
import { Event, NearbyEvent } from '~/types/db';
import * as Location from 'expo-location';

export default function Events() {
  const [events, setEvents] = useState<NearbyEvent[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const [status, requestPermission] = Location.useForegroundPermissions();

  useEffect(() => {
    if (status && !status.granted && status.canAskAgain){
      requestPermission();
    }
  }, [status])

  useEffect(() => {
    (async () => {
      
      // let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status?.granted) {
        // await requestPermission();
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location){
      fetchNearbyEvents();
    }
  }, [location]);

  // const fetchAllEvents = async () => {
  //   const { data, error } = await supabase.from('events').select('*');

  //   if (data) {
  //     setEvents(data ?? []);   
  //   }
  // }

  const fetchNearbyEvents = async () => {

    if (!location){
      return;
    }

    const { data, error } = await supabase.rpc('nearby_events', {
      lat: location?.coords.latitude, 
      long: location?.coords.longitude,
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
