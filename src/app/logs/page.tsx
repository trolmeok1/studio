

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSystemLogs, type LogEntry } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FilePlus, FilePen, Trash2, DollarSign, Printer, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const getIconForAction = (action: LogEntry['action']) => {
    switch (action) {
        case 'create':
            return <FilePlus className="h-5 w-5 text-green-500" />;
        case 'update':
            return <FilePen className="h-5 w-5 text-blue-500" />;
        case 'delete':
            return <Trash2 className="h-5 w-5 text-red-500" />;
        case 'payment':
            return <DollarSign className="h-5 w-5 text-yellow-500" />;
        case 'generate':
            return <Printer className="h-5 w-5 text-purple-500" />;
        default:
            return <Download className="h-5 w-5 text-gray-500" />;
    }
}


export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const logsData = await getSystemLogs();
            setLogs(logsData);
            setLoading(false);
        };
        fetchLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        if (activeTab === 'all') {
            return logs;
        }
        return logs.filter(log => log.category === activeTab);
    }, [logs, activeTab]);

    if (loading) {
        return <div className="p-8">Cargando registro de actividad...</div>
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                  Registro de Actividad
                </span>
              </h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Cambios</CardTitle>
                    <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">Todo</TabsTrigger>
                            <TabsTrigger value="team">Equipos</TabsTrigger>
                            <TabsTrigger value="treasury">Tesorería</TabsTrigger>
                            <TabsTrigger value="system">Sistema</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {filteredLogs.map(log => (
                            <div key={log.id} className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    {getIconForAction(log.action)}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm">
                                        <span className="font-semibold">{log.user}</span> {log.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: es })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={log.userAvatar} data-ai-hint="user avatar" />
                                        <AvatarFallback>{log.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        ))}
                         {filteredLogs.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No hay registros en esta categoría.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
