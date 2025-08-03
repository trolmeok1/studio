"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'secretary' | 'guest';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  users: User[];
  loginAs: (role: UserRole) => void;
}

const mockUsers: User[] = [
  { name: 'Usuario Admin', email: 'admin@ligacontrol.com', role: 'admin', avatarUrl: 'https://placehold.co/100x100.png' },
  { name: 'Secretario/a', email: 'secretary@ligacontrol.com', role: 'secretary', avatarUrl: 'https://placehold.co/100x100.png' },
  { name: 'Invitado', email: 'guest@ligacontrol.com', role: 'guest' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Default to admin

  const loginAs = (role: UserRole) => {
    const userToLogin = mockUsers.find(u => u.role === role);
    if (userToLogin) {
      setCurrentUser(userToLogin);
    }
  };

  const value = {
    user: currentUser,
    setUser: setCurrentUser,
    users: mockUsers,
    loginAs,
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
