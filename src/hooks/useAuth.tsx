
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'secretary' | 'guest';

export interface Permissions {
    dashboard: { view: boolean; edit: boolean };
    players: { view: boolean; edit: boolean };
    schedule: { view: boolean; edit: boolean };
    partido: { view: boolean; edit: boolean };
    copa: { view: boolean; edit: boolean };
    aiCards: { view: boolean; edit: boolean };
    committees: { view: boolean; edit: boolean };
    treasury: { view: boolean; edit: boolean };
    requests: { view: boolean; edit: boolean };
    reports: { view: boolean; edit: boolean };
    teams: { view: boolean; edit: boolean };
    roles: { view: boolean; edit: boolean };
    logs: { view: boolean; edit: boolean };
}

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

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  permissions: Permissions;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  loginAs: (role: UserRole) => void;
  isCopaPublic: boolean;
  setIsCopaPublic: (isPublic: boolean) => void;
}

const mockUsers: User[] = [
  { id: 'user-1', name: 'Usuario Admin', email: 'admin@ligacontrol.com', role: 'admin', permissions: allPermissionsTrue, avatarUrl: 'https://placehold.co/100x100.png', password: 'password' },
  { id: 'user-2', name: 'Secretario/a', email: 'secretary@ligacontrol.com', role: 'secretary', permissions: secretaryPermissions, avatarUrl: 'https://placehold.co/100x100.png', password: 'password' },
  { id: 'user-3', name: 'Invitado', email: 'guest@ligacontrol.com', role: 'guest', permissions: guestPermissions, avatarUrl: 'https://placehold.co/100x100.png', password: 'password' },
];

const defaultUser = mockUsers.find(u => u.role === 'guest')!;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsersState] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [isCopaPublic, setIsCopaPublic] = useState(true);

  const loginAs = (role: UserRole) => {
    const userToLogin = users.find(u => u.role === role);
    if (userToLogin) {
      setCurrentUser(userToLogin);
    }
  };
  
  const setUsers = (updatedUsers: User[]) => {
      setUsersState(updatedUsers);
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
          setCurrentUser(updatedCurrentUser);
      }
  }

  const value = {
    user: currentUser,
    setUser: setCurrentUser,
    users,
    setUsers,
    loginAs,
    isCopaPublic,
    setIsCopaPublic,
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
