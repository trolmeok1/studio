
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Landmark, Ban } from 'lucide-react';
import { upcomingMatches, teams } from '@/lib/mock-data';
import { useEffect, useState } from 'react';

export default function TreasuryPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalVocalIncome = upcomingMatches.reduce((acc, match) => {
        const homePayment = match.teams.home.attended ? (match.teams.home.vocalPayment || 0) : 0;
        const awayPayment = match.teams.away.attended ? (match.teams.away.vocalPayment || 0) : 0;
        return acc + homePayment + awayPayment;
    }, 0);

    const totalSanctionIncome = 550; // Mock data for now

    const absentTeams = upcomingMatches.flatMap(match => {
        const absentees = [];
        if (!match.teams.home.attended) {
            absentees.push({ ...match.teams.home, date: match.date });
        }
        if (!match.teams.away.attended) {
            absentees.push({ ...match.teams.away, date: match.date });
        }
        return absentees;
    });

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
                Tesorería
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos Totales
                        </CardTitle>
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalVocalIncome + totalSanctionIncome).toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            Suma de vocalías y sanciones
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos por Vocalías
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalVocalIncome.toLocaleString('en-US')}</div>
                         <p className="text-xs text-muted-foreground">
                            Basado en {upcomingMatches.length} partidos registrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos por Sanciones</CardTitle>
                        <Ban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSanctionIncome.toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            Tarjetas y otras multas
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Sanciones por Ausencia</CardTitle>
                        <CardDescription>
                            Equipos que no se presentaron a sus partidos programados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Equipo</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Estado de Multa</TableHead>
                                    <TableHead className="text-right">Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {absentTeams.length > 0 ? absentTeams.map((team, index) => (
                                     <TableRow key={`${team.id}-${index}`}>
                                        <TableCell>{isClient ? new Date(team.date).toLocaleDateString() : ''}</TableCell>
                                        <TableCell className="font-medium">{team.name}</TableCell>
                                        <TableCell>{(teams.find(t => t.id === team.id))?.category}</TableCell>
                                        <TableCell><Badge variant="outline">Pendiente</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm">Aplicar Multa ($20)</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No hay equipos ausentes registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}

    