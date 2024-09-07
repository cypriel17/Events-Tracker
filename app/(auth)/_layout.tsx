import { Stack, useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export default function AuthLayout(){

    const { isAuthenticated } = useAuth();
    const router = useRouter();

    if (isAuthenticated){
        router.push("/");
        return true;
    }
    return <Stack />;
}