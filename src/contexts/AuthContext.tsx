
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  mbti: string | null;
  university: string | null;
}

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  venue: string;
  quantity: number;
  price: number;
  purchaseDate: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, fullName: string, mbti: string, university: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  userTickets: Ticket[];
  purchaseTicket: (eventId: string, quantity: number, price: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUserProfile(profile);
          });
      }
    });

    // Load tickets from localStorage
    const storedTickets = localStorage.getItem('userTickets');
    if (storedTickets) {
      setUserTickets(JSON.parse(storedTickets));
    }

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signup = async (email: string, password: string, fullName: string, mbti: string, university: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          mbti: mbti,
          university: university,
        }
      }
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
    localStorage.removeItem('userTickets');
  };

  const purchaseTicket = (eventId: string, quantity: number, price: number) => {
    const events = [
      { id: '1', name: '夏日音乐节', date: '2024-08-15', venue: '中央公园' },
      { id: '2', name: '科技大会 2024', date: '2024-09-20', venue: '会议中心' },
      { id: '3', name: '喜剧之夜', date: '2024-07-30', venue: '市中心喜剧俱乐部' },
    ];

    const event = events.find(e => e.id === eventId);
    if (event) {
      const newTicket: Ticket = {
        id: Math.random().toString(36).substr(2, 9),
        eventName: event.name,
        eventDate: event.date,
        venue: event.venue,
        quantity,
        price: price * quantity,
        purchaseDate: new Date().toISOString().split('T')[0]
      };

      const updatedTickets = [...userTickets, newTicket];
      setUserTickets(updatedTickets);
      localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      session,
      login,
      signup,
      logout,
      userTickets,
      purchaseTicket
    }}>
      {children}
    </AuthContext.Provider>
  );
};
