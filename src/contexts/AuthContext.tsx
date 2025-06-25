
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
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
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('ticketUser');
    const storedTickets = localStorage.getItem('userTickets');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedTickets) {
      setUserTickets(JSON.parse(storedTickets));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would validate credentials
    if (email && password) {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0]
      };
      setUser(userData);
      localStorage.setItem('ticketUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call - in real app, this would create new user
    if (email && password && name) {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name
      };
      setUser(userData);
      localStorage.setItem('ticketUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ticketUser');
  };

  const purchaseTicket = (eventId: string, quantity: number, price: number) => {
    const events = [
      { id: '1', name: 'Summer Music Festival', date: '2024-08-15', venue: 'Central Park' },
      { id: '2', name: 'Tech Conference 2024', date: '2024-09-20', venue: 'Convention Center' },
      { id: '3', name: 'Comedy Night Live', date: '2024-07-30', venue: 'Comedy Club Downtown' },
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
