import { Session } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { supabase } from '~/utils/supabase';

interface AuthContextType {
  session: Session | null;
  user: Session['user'] | null | undefined;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<Session['user'] | null>(null);
    const [isReady, setIsReady] = useState(false);
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsReady(true);
      });
  
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });
  
      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user, isAuthenticated: !!session?.user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
