
'use client';

import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, type User, type Permissions } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PlusCircle, UserCog } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/lib/mock-data';

const permissionModules: { key: keyof Permissions; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'players', label: 'Jugadores' },
    { key: 'schedule', label: 'Programación' },
    { key: 'partido', label: 'Partido' },
    { key: 'copa', label: 'Copa' },
    { key: 'aiCards', label: 'Carnets AI' },
    { key: 'committees', label: 'Vocalías' },
    { key: 'treasury', label: 'Tesorería' },
    { key: 'requests', label: 'Gestión de Jugadores' },
    { key: 'reports', label: 'Reportes' },
    { key: 'teams', label: 'Equipos' },
    { key: 'roles', label: 'Roles y Permisos' },
    { key: 'logs', label: 'Logs del Sistema' },
];

const allPermissionsFalse: Permissions = {
    dashboard: { view: false, edit: false }, players: { view: false, edit: false },
    schedule: { view: false, edit: false }, partido: { view: false, edit: false },
    copa: { view: false, edit: false }, aiCards: { view: false, edit: false },
    committees: { view: false, edit: false }, treasury: { view: false, edit: false },
    requests: { view: false, edit: false }, reports: { view: false, edit: false },
    teams: { view: false, edit: false }, roles: { view: false, edit: false },
    logs: { view: false, edit: false },
};


const PermissionsDialog = ({ user, onSave, children, open, onOpenChange }: { user?: User; onSave: (user: User) => void; children: React.ReactNode, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [userData, setUserData] = useState<Partial<User>>(user || { name: '', email: '', password: '' });
    const [permissions, setPermissions] = useState<Permissions>(user?.permissions || allPermissionsFalse);
    const { toast } = useToast();

    React.useEffect(() => {
        if (open) {
          setUserData(user || { name: '', email: '', password: '' });
          setPermissions(user?.permissions || allPermissionsFalse);
        }
    }, [user, open]);


    const handlePermissionChange = (module: keyof Permissions, type: 'view' | 'edit', value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [type]: value,
                // If edit is true, view must also be true
                ...(type === 'edit' && value && { view: true }),
            }
        }));
    };
    
    // If view is unchecked, edit must also be unchecked
    const handleViewPermissionChange = (module: keyof Permissions, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                view: value,
                ...(!value && { edit: false })
            }
        }));
    };

    const handleSave = () => {
        if (!user) {
            // Logic for creating a new user is disabled per user request
            toast({
                title: "Creación deshabilitada",
                description: "La creación de nuevos usuarios no está permitida.",
                variant: "destructive"
            });
            return;
        }

        const finalUser: User = {
            ...user,
            name: userData.name || '',
            email: userData.email || '',
            permissions: permissions,
            avatarUrl: userData.avatarUrl || user.avatarUrl,
        };
        onSave(finalUser);
        toast({
            title: "Usuario actualizado",
            description: `Se han guardado los datos para ${finalUser.name}.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{user ? `Gestionar Permisos de ${user.name}` : 'Agregar Nuevo Usuario'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'Ajusta los permisos de acceso para cada módulo.' : 'La creación de usuarios está deshabilitada.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <div className="md:col-span-1 space-y-4">
                        <h4 className="font-semibold">Datos del Usuario</h4>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value })} disabled={!user} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                             <Input id="email" type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value })} disabled={!user} />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="font-semibold">Permisos por Módulo</h4>
                        <ScrollArea className="h-72 border rounded-md p-4">
                            <div className="space-y-4">
                                {permissionModules.map(module => (
                                    <div key={module.key} className="flex items-center justify-between">
                                        <Label htmlFor={`view-${module.key}`}>{module.label}</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`view-${module.key}`}
                                                    checked={permissions[module.key]?.view || false}
                                                    onCheckedChange={(checked) => handleViewPermissionChange(module.key, !!checked)}
                                                    disabled={!user}
                                                />
                                                <Label htmlFor={`view-${module.key}`} className="text-sm font-medium leading-none">Ver</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`edit-${module.key}`}
                                                    checked={permissions[module.key]?.edit || false}
                                                    onCheckedChange={(checked) => handlePermissionChange(module.key, 'edit', !!checked)}
                                                    disabled={!permissions[module.key]?.view || !user}
                                                />
                                                <Label htmlFor={`edit-${module.key}`} className="text-sm font-medium leading-none">Editar</Label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={!user}>Guardar Cambios</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function RolesPage() {
  const { user: currentUser, users, setUsers } = useAuth();
  const isAdmin = currentUser.permissions.roles.edit;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const handleSaveUser = useCallback(async (userToSave: User) => {
      await updateUser(userToSave);
      setUsers(prevUsers => prevUsers.map(u => u.id === userToSave.id ? userToSave : u));
  }, [setUsers]);

  const openAddDialog = () => {
    // Adding new users is disabled
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
            <h2 className="text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-cyan-500 to-sky-400 text-transparent bg-clip-text">
                Gestión de Roles y Usuarios
                </span>
            </h2>
        </div>
        {isAdmin && (
            <Button onClick={openAddDialog} disabled>
                <PlusCircle className='mr-2' />
                Agregar Usuario
            </Button>
        )}
      </div>

      <Card neon="cyan">
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Gestiona los roles y permisos de los usuarios del sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Permisos Resumidos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                   <TableCell className="text-muted-foreground text-xs">
                    {Object.values(user.permissions).filter(p => p.edit).length} de {permissionModules.length} módulos con edición
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && (
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Gestionar Permisos
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PermissionsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      >
        {/* The dialog is triggered programmatically, so no trigger children needed here */}
      </PermissionsDialog>
    </div>
  );
}
