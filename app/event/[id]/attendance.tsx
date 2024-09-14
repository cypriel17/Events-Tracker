import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { supabase } from "~/utils/supabase";

export default function EventAttendance(){

    const { id } = useLocalSearchParams();

    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        getAttendees();
    }, [id])

    const getAttendees = async () => {
        const { data, error } = await supabase
                                    .from('attendance')
                                    .select('*, profiles(*)')
                                    .eq('event_id', id);

        if (data){
            setAttendees(data);
        }
    }

    return (
            <FlatList
                data={attendees}
                    renderItem={({ item }) => (
                        <View className='p-2'>
                            <Text className='font-bold'>{item.profiles.full_name || 'User'}</Text>
                        </View>
                    )}
            />
    );
}