'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, type User, type UserRole } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const roleNames: Record<UserRole, string> = {
  admin: 'Administrador',
  secretary: 'Secretario',
  guest: 'Invitado',
};

const roleColors: Record<UserRole, string> = {
    admin: 'bg-destructive text-destructive-foreground',
    secretary: 'bg-primary text-primary-foreground',
    guest: 'bg-secondary text-secondary-foreground',
};

export default function RolesPage() {
  const { users, user: currentUser } = useAuth();
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Gestión de Roles y Usuarios
        </h2>
        {isAdmin && (
            <Button>
                <PlusCircle className='mr-2' />
                Invitar Usuario
            </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol Asignado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
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
                  <TableCell>
                    {isAdmin ? (
                      <Select defaultValue={user.role}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="secretary">Secretario</SelectItem>
                          <SelectItem value="guest">Invitado</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={roleColors[user.role]}>
                        {roleNames[user.role]}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
