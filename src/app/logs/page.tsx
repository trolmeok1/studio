
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSystemLogs, type LogEntry } from '@/lib/mock-data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileClock, User, Package, DollarSign, Shield, Info } from 'lucide-react';

const logIcons = {
    team: <Shield className="h-4 w-4" />,
    player: <User className="h-4 w-4" />,
    treasury: <DollarSign className="h-4 w-4" />,
    match: <Info className="h-4 w-4" />,
    system: <Package className="h-4 w-4" />,
};

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const logsData = await getSystemLogs();
            setLogs(logsData);
            setLoading(false);
        };
        fetchLogs();
    }, []);
    
    if(loading) {
        return <p>Cargando logs...</p>
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="text-center w-full mb-6">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-red-500 to-orange-400 text-transparent bg-clip-text">
                    Logs del Sistema
                  </span>
                </h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Registro de Actividad</CardTitle>
                    <CardDescription>Un registro de todos los eventos y cambios importantes que han ocurrido en el sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Acción</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={log.userAvatar} alt={log.user} data-ai-hint="user avatar" />
                                                <AvatarFallback>{log.user.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{log.user}</span>
                                        </div>
                                    </TableCell>
                                     <TableCell>
                                         <Badge variant={log.action === 'delete' ? 'destructive' : 'secondary'}>{log.action}</Badge>
                                    </TableCell>
                                     <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            {logIcons[log.category as keyof typeof logIcons] || <Info className="h-4 w-4" />}
                                            <span>{log.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{log.description}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(log.timestamp), "dd/MM/yyyy, HH:mm:ss", { locale: es })}
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
