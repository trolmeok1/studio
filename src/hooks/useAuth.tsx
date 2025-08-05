
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getUsers, updateUser, getUserByEmail } from '@/lib/mock-data';
import type { User, Permissions, UserRole } from '@/lib/types';


const defaultGuestUser: User = { 
    id: 'user-3', 
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
  setUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAs: (role: UserRole) => void;
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
        const fetchedUsers = await getUsers();
        if (fetchedUsers.length > 0) {
            setUsersState(fetchedUsers as User[]);
            const guestUser = fetchedUsers.find(u => u.role === 'guest') || defaultGuestUser;
            setCurrentUser(guestUser as User);
        } else {
            setUsersState([defaultGuestUser]);
            setCurrentUser(defaultGuestUser);
        }
        setIsAuthLoading(false);
    }
    loadData();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    const userFromDb = await getUserByEmail(email);
    
    // In a real app, you would hash and compare passwords.
    // For this demo, we'll do a simple string comparison.
    if (userFromDb && userFromDb.password === password) {
        setCurrentUser(userFromDb);
        return true;
    }

    return false;
  };

  const loginAs = (role: UserRole) => {
    const userToLogin = users.find(u => u.role === role);
    if (userToLogin) {
      setCurrentUser(userToLogin);
    } else {
        // Fallback to guest if specific role not found in the initial user list
        const guestUser = users.find(u => u.role === 'guest') || defaultGuestUser;
        setCurrentUser(guestUser);
    }
  };
  
  const setUsers = (updatedUsers: User[]) => {
      setUsersState(updatedUsers);
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
          setCurrentUser(updatedCurrentUser);
      }
      updatedUsers.forEach(user => {
          if (users.some(u => u.id === user.id)) {
            updateUser(user);
          } else {
            // In a real app, you'd have an addUser function.
            // For now, we assume users are added via Firebase Console
            // or another trusted mechanism.
          }
      });
  }

  const value = {
    user: currentUser,
    setUser: setCurrentUser,
    users,
    setUsers,
    login,
    loginAs,
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
