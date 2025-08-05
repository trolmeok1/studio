
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getUsers, updateUser, getUserByEmail } from '@/lib/mock-data';
import type { User, Permissions, UserRole } from '@/lib/types';


const defaultGuestUser: User = { 
    id: 'guest-user', 
    name: 'Invitado', 
    email: 'guest@ligacontrol.com', 
    role: 'guest', 
    permissions: {
        dashboard: { view: true, edit: false },
        players: { view: true, edit: false },
        schedule: { view: true, edit: false },
        partido: { view: true, edit: false },
        copa: { view: true, edit: false },
        aiCards: { view: false, edit: false },
        committees: { view: false, edit: false },
        treasury: { view: false, edit: false },
        requests: { view: false, edit: false },
        reports: { view: false, edit: false },
        teams: { view: true, edit: false },
        roles: { view: false, edit: false },
        logs: { view: false, edit: false },
    }, 
    avatarUrl: 'https://placehold.co/100x100.png', 
    password: 'password' 
};


interface AuthContextType {
  user: User;
  setUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isCopaPublic: boolean;
  setIsCopaPublic: (isPublic: boolean) => void;
  isAuthLoading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsersState] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(defaultGuestUser);
  const [isCopaPublic, setIsCopaPublic] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        setIsAuthLoading(true);
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            } else {
                setCurrentUser(defaultGuestUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            setCurrentUser(defaultGuestUser);
        } finally {
            setIsAuthLoading(false);
        }
    }
    loadData();
  }, []);

  const handleSetUser = (user: User | null) => {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    } else {
        localStorage.removeItem('currentUser');
        setCurrentUser(defaultGuestUser);
    }
  }

  const login = async (email: string, password?: string): Promise<boolean> => {
    const userFromDb = await getUserByEmail(email);
    
    if (userFromDb && userFromDb.password === password) {
        handleSetUser(userFromDb);
        return true;
    }

    return false;
  };

  const logout = () => {
    handleSetUser(null);
  };
  
  const setUsers = (updatedUsers: User[]) => {
      setUsersState(updatedUsers);
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
          handleSetUser(updatedCurrentUser);
      }
      updatedUsers.forEach(user => {
          if (users.some(u => u.id === user.id)) {
            updateUser(user);
          }
      });
  }

  const value = {
    user: currentUser,
    setUser: handleSetUser,
    users,
    setUsers,
    login,
    logout,
    isCopaPublic,
    setIsCopaPublic,
    isAuthLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
