
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getUserByEmail, updateUser as dbUpdateUser, getUsers } from '@/lib/mock-data';
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
    avatarUrl: 'https://placehold.co/100x100.png'
};


interface AuthContextType {
  user: User;
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

  const syncUser = useCallback((user: User | null) => {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    } else {
        localStorage.removeItem('currentUser');
        setCurrentUser(defaultGuestUser);
    }
  }, []);

  useEffect(() => {
    async function loadInitialData() {
        setIsAuthLoading(true);
        try {
            const allUsers = await getUsers();
            setUsersState(allUsers);
            const storedUserJson = localStorage.getItem('currentUser');
            if (storedUserJson) {
                const storedUser = JSON.parse(storedUserJson);
                // Optional: Verify user against the fresh list from DB
                const userExists = allUsers.some(u => u.id === storedUser.id);
                if (userExists) {
                    setCurrentUser(storedUser);
                } else {
                   syncUser(null);
                }
            } else {
                setCurrentUser(defaultGuestUser);
            }
        } catch (error) {
            console.error("Failed to initialize auth state:", error);
            syncUser(null);
        } finally {
            setIsAuthLoading(false);
        }
    }
    loadInitialData();
  }, [syncUser]);


  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
        const userFromDb = await getUserByEmail(email);
        if (userFromDb && userFromDb.password === password) {
            syncUser(userFromDb);
            return true;
        }
        return false;
    } catch(e) {
        return false;
    }
    finally {
        setIsAuthLoading(false);
    }
  };

  const logout = () => {
    syncUser(null);
  };
  
  const setUsers = (updatedUsers: User[]) => {
      setUsersState(updatedUsers);
      // find the logged in user from the updated list and update their state
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
          syncUser(updatedCurrentUser);
      }
      // Persist all changes to the database
      updatedUsers.forEach(user => {
         // This is a mock, in a real app you might want to check for changes before updating
         dbUpdateUser(user);
      });
  }

  const value = {
    user: currentUser,
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
