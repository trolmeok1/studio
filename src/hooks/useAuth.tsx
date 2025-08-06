

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getUsers, type User, type UserRole, type Permissions, addUser } from '@/lib/mock-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

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
        const allUsers = await getUsers();
        setUsersState(allUsers);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                const appUser = allUsers.find(u => u.email.toLowerCase() === firebaseUser.email!.toLowerCase());
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
    } catch (error) {
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
    const userExists = users.some(u => u.id === userToSave.id);
    
    if (userExists) {
    } else {
        if (!userToSave.password) {
            throw new Error("Password is required to create a new user.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, userToSave.email, userToSave.password);
        const firebaseUser = userCredential.user;
        
        await addUser({ ...userToSave, id: firebaseUser.uid });
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
