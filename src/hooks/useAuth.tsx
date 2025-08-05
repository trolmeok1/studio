
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getUserByEmail, getUsers, addUser, updateUser, type User, type UserRole, type Permissions } from '@/lib/mock-data';

export type { User, UserRole, Permissions };

const guestPermissions: Permissions = {
    dashboard: { view: true, edit: false },
    players: { view: true, edit: false },
    schedule: { view: true, edit: false },
    partido: { view: true, edit: false },
    copa: { view: true, edit: false }, // Guests can view, but visibility is controlled by isCopaPublic
    aiCards: { view: false, edit: false },
    committees: { view: false, edit: false },
    treasury: { view: false, edit: false },
    requests: { view: false, edit: false },
    reports: { view: false, edit: false },
    teams: { view: true, edit: false },
    roles: { view: false, edit: false },
    logs: { view: false, edit: false },
};

const defaultGuestUser: User = {
  id: 'guest-user',
  name: 'Invitado',
  email: '',
  role: 'guest',
  permissions: guestPermissions,
  avatarUrl: 'https://placehold.co/100x100.png'
};


interface AuthContextType {
  user: User;
  users: User[];
  setUsers: (users: User[]) => void;
  loginAs: (email: string) => Promise<boolean>;
  logout: () => void;
  isCopaPublic: boolean;
  setIsCopaPublic: (isPublic: boolean) => void;
  isAuthLoading: boolean;
  saveUser: (user: User) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsersState] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(defaultGuestUser);
  const [isCopaPublic, setIsCopaPublic] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
        setIsAuthLoading(true);
        const storedUser = sessionStorage.getItem('currentUser');
        const allUsers = await getUsers();
        setUsersState(allUsers);

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Re-fetch user from DB to ensure permissions are up to date
            const freshUser = allUsers.find(u => u.id === parsedUser.id);
            setCurrentUser(freshUser || defaultGuestUser);
        } else {
            setCurrentUser(defaultGuestUser);
        }
        setIsAuthLoading(false);
    }
    loadInitialData();
  }, []);


  const loginAs = async (email: string) => {
    // In a real app, password would be checked here
    const userToLogin = users.find(u => u.email === email);
    if (userToLogin) {
      setCurrentUser(userToLogin);
      sessionStorage.setItem('currentUser', JSON.stringify(userToLogin));
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setCurrentUser(defaultGuestUser);
    sessionStorage.removeItem('currentUser');
  };

  const setUsers = (updatedUsers: User[]) => {
      setUsersState(updatedUsers);
  };
  
  const saveUser = useCallback(async (userToSave: User) => {
    const userExists = users.some(u => u.id === userToSave.id);
    
    if (userExists) {
        await updateUser(userToSave);
        setUsersState(prev => prev.map(u => u.id === userToSave.id ? userToSave : u));
        // Update current user if they are the one being edited
        if(currentUser.id === userToSave.id) {
            setCurrentUser(userToSave);
            sessionStorage.setItem('currentUser', JSON.stringify(userToSave));
        }
    } else {
        const newUser = await addUser(userToSave);
        setUsersState(prev => [...prev, newUser]);
    }
  }, [users, currentUser.id]);

  const value = {
    user: currentUser,
    users,
    setUsers,
    loginAs,
    logout,
    isCopaPublic,
    setIsCopaPublic,
    isAuthLoading,
    saveUser
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
