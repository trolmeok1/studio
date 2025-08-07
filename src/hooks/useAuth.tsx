

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getUsers, type User, type UserRole, type Permissions } from '@/lib/mock-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { ADMIN_EMAIL } from '@/lib/mock-data';


export type { User, UserRole, Permissions };

const guestPermissions: Permissions = {
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
    const initializeAuth = async () => {
        setIsAuthLoading(true);
        let allUsers = await getUsers();
        setUsersState(allUsers);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                let appUser = allUsers.find(u => u.email.toLowerCase() === firebaseUser.email!.toLowerCase());
                
                if (appUser) {
                    setCurrentUser(appUser);
                } else {
                    await signOut(auth);
                    setCurrentUser(defaultGuestUser);
                }
            } else {
                setCurrentUser(defaultGuestUser);
            }
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    };

    initializeAuth();
  }, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error: any) {
        console.error("Firebase login error:", error);
        return false;
    }
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  const setUsers = (updatedUsers: User[]) => {
      setUsersState(updatedUsers);
  };
  
  const saveUser = useCallback(async (userToSave: User) => {
    // This function will now only handle updates for existing users
    const userExists = users.some(u => u.id === userToSave.id);
    
    if (userExists) {
        // User update logic might be needed here if you want to update from this function
    } else {
        // New user creation logic is disabled
        throw new Error("La creación de nuevos usuarios está deshabilitada.");
    }
    
    const allUsers = await getUsers();
    setUsersState(allUsers);

  }, [users]);

  const value = {
    user: currentUser,
    users,
    setUsers,
    login,
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
