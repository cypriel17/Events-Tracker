import { useState } from 'react';
import { Alert, Button, Pressable, Text, TextInput, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import { router } from 'expo-router';

export default function CreateEvent(){
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const { user } = useAuth()

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('title');
    const [description, setDescription] = useState('');

    const createEvent = async () => {
        setLoading(true);
        const { data, error } = await supabase
        .from('events')
        .insert([
            { 
                title, 
                description,
                date,
                user_id: user?.id,
            },
        ])
        .select()
        .single() // since data is an array, we just want one event

        if (error) {
            Alert.alert('Error creating event', error.message)
            return
        } else {
            setTitle('');
            setDescription('');
            setDate(new Date());
            setLoading(false);
            router.push(`/event/${data?.id}`)
        }
        
                
    };

    return (
        <View className='flex-1 bg-white p-5 gap-3'>
            <TextInput 
                value={title}
                // onChangeText={(text) => setTitle(text)}
                onChangeText={setTitle}
                placeholder='Title' 
                className="border rounded-md border-grey-200 p-3" />
            <TextInput 
                value={description}
                // onChangeText={(text) => setDescription(text)}
                onChangeText={setDescription}
                placeholder='Description' 
                multiline={true}
                numberOfLines={3}
                className="min-h-42 border rounded-md border-grey-200 p-3" />

            <Text 
                className="border rounded-md border-grey-200 p-3" 
                onPress={() => setOpen(true)}>{date.toLocaleString()}</Text>
            <DatePicker
                    modal
                    open={open}
                    date={date}
                    minimumDate={new Date()}
                    minuteInterval={15}
                    onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    }}
                    onCancel={() => {
                    setOpen(false)
                    }}
                />

            <Pressable 
                disabled={loading} 
                onPress={() => createEvent()} 
                className="mt-auto items-center rounded-md bg-red-500 p-3 px-8">
                <Text className="text-lg font-bold text-white">Create Event</Text>
            </Pressable>
        </View>
    );

}