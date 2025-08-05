
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getUserByEmail, getUsers, type User, type UserRole, type Permissions } from '@/lib/mock-data';

export type { User, UserRole, Permissions };

const allPermissionsTrue: Permissions = {
    dashboard: { view: true, edit: true },
    players: { view: true, edit: true },
    schedule: { view: true, edit: true },
    partido: { view: true, edit: true },
    copa: { view: true, edit: true },
    aiCards: { view: true, edit: true },
    committees: { view: true, edit: true },
    treasury: { view: true, edit: true },
    requests: { view: true, edit: true },
    reports: { view: true, edit: true },
    teams: { view: true, edit: true },
    roles: { view: true, edit: true },
    logs: { view: true, edit: true },
};

const secretaryPermissions: Permissions = {
    dashboard: { view: true, edit: false },
    players: { view: true, edit: true },
    schedule: { view: true, edit: true },
    partido: { view: true, edit: true },
    copa: { view: true, edit: true },
    aiCards: { view: false, edit: false },
    committees: { view: true, edit: true },
    treasury: { view: true, edit: true },
    requests: { view: true, edit: true },
    reports: { view: true, edit: false },
    teams: { view: true, edit: true },
    roles: { view: false, edit: false },
    logs: { view: false, edit: false },
};

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
  setUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  loginAs: (email: string) => Promise<boolean>;
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
    const userToLogin = await getUserByEmail(email);
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
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
          setCurrentUser(updatedCurrentUser);
          sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      }
  }

  const value = {
    user: currentUser,
    setUser: setCurrentUser,
    users,
    setUsers,
    loginAs,
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
