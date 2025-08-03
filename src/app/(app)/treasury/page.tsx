
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Landmark, Ban, AlertTriangle, Printer } from 'lucide-react';
import { upcomingMatches, teams, type Category, generateFinancialReport } from '@/lib/mock-data';
import { useEffect, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function TreasuryPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const paidMatches = upcomingMatches.filter(match => 
        match.teams.home.vocalPaymentDetails?.paymentStatus === 'paid' || 
        match.teams.away.vocalPaymentDetails?.paymentStatus === 'paid'
    );

    const totalVocalIncome = paidMatches.reduce((acc, match) => {
        const homePayment = match.teams.home.vocalPaymentDetails?.paymentStatus === 'paid' ? match.teams.home.vocalPaymentDetails?.total || 0 : 0;
        const awayPayment = match.teams.away.vocalPaymentDetails?.paymentStatus === 'paid' ? match.teams.away.vocalPaymentDetails?.total || 0 : 0;
        return acc + homePayment + awayPayment;
    }, 0);
    
    const pendingPayments = upcomingMatches.flatMap(match => {
        const pending = [];
        if (match.teams.home.vocalPaymentDetails?.paymentStatus === 'pending') {
            pending.push({team: match.teams.home, amount: match.teams.home.vocalPaymentDetails.total, date: match.date});
        }
        if (match.teams.away.vocalPaymentDetails?.paymentStatus === 'pending') {
            pending.push({team: match.teams.away, amount: match.teams.away.vocalPaymentDetails.total, date: match.date});
        }
        return pending;
    });

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

    const handleGenerateReport = () => {
        const report = generateFinancialReport(upcomingMatches);
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_financiero.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const VocalPaymentDetailRow = ({ label, value }: { label: string, value: number }) => (
        <div className="flex justify-between text-xs py-0.5">
            <span className="text-muted-foreground">{label}:</span>
            <span>${value.toFixed(2)}</span>
        </div>
    );
    
    const VocalitiesTable = ({ matches }: { matches: typeof upcomingMatches }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Partido</TableHead>
                    <TableHead>Vocalía Equipo A</TableHead>
                    <TableHead>Vocalía Equipo B</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {matches.map(match => {
                    const teamA = match.teams.home;
                    const teamB = match.teams.away;
                    const detailsA = teamA.vocalPaymentDetails;
                    const detailsB = teamB.vocalPaymentDetails;

                    const getStatusBadge = (status?: 'paid' | 'pending') => {
                        if (status === 'paid') return <Badge>Pagado</Badge>
                        if (status === 'pending') return <Badge variant="destructive">Pendiente</Badge>
                        return null;
                    }

                    return (
                        <TableRow key={match.id}>
                            <TableCell>{isClient ? new Date(match.date).toLocaleDateString() : ''}</TableCell>
                            <TableCell className="font-medium">{teamA.name} vs {teamB.name}</TableCell>
                            <TableCell>
                                <Card className="p-2 bg-muted/50">
                                    <div className="flex justify-between items-center pb-1 border-b mb-1">
                                        <p className="font-bold">${(detailsA?.total || 0).toFixed(2)}</p>
                                        {getStatusBadge(detailsA?.paymentStatus)}
                                    </div>
                                    <VocalPaymentDetailRow label="Árbitro" value={detailsA?.referee || 0} />
                                    <VocalPaymentDetailRow label="Cuota" value={detailsA?.fee || 0} />
                                    <VocalPaymentDetailRow label="T. Amarillas" value={detailsA?.yellowCardFine || 0} />
                                    <VocalPaymentDetailRow label="T. Rojas" value={detailsA?.redCardFine || 0} />
                                    <VocalPaymentDetailRow label="Otras Multas" value={detailsA?.otherFines || 0} />
                                </Card>
                            </TableCell>
                            <TableCell>
                                <Card className="p-2 bg-muted/50">
                                        <div className="flex justify-between items-center pb-1 border-b mb-1">
                                        <p className="font-bold">${(detailsB?.total || 0).toFixed(2)}</p>
                                        {getStatusBadge(detailsB?.paymentStatus)}
                                    </div>
                                    <VocalPaymentDetailRow label="Árbitro" value={detailsB?.referee || 0} />
                                    <VocalPaymentDetailRow label="Cuota" value={detailsB?.fee || 0} />
                                    <VocalPaymentDetailRow label="T. Amarillas" value={detailsB?.yellowCardFine || 0} />
                                    <VocalPaymentDetailRow label="T. Rojas" value={detailsB?.redCardFine || 0} />
                                    <VocalPaymentDetailRow label="Otras Multas" value={detailsB?.otherFines || 0} />
                                </Card>
                            </TableCell>
                        </TableRow>
                    )
                })}
                 {matches.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            No hay vocalías registradas para esta categoría.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
    
    const matchesByMax = useMemo(() => upcomingMatches.filter(m => m.category === 'Máxima'), []);
    const matchesByFirst = useMemo(() => upcomingMatches.filter(m => m.category === 'Primera'), []);
    const matchesBySecond = useMemo(() => upcomingMatches.filter(m => m.category === 'Segunda'), []);


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">
                    Tesorería
                </h2>
                <Button onClick={handleGenerateReport} variant="outline">
                    <Printer className="mr-2" />
                    Generar Reporte
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos Totales (Pagados)
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
                            Ingresos por Vocalías (Pagados)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalVocalIncome.toLocaleString('en-US')}</div>
                         <p className="text-xs text-muted-foreground">
                            Basado en {paidMatches.length} partidos
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${pendingPayments.reduce((acc, p) => acc + p.amount, 0).toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            De {pendingPayments.length} equipos
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Pagos Pendientes de Vocalía</CardTitle>
                         <CardDescription>
                            Equipos que no han cancelado su valor de vocalía.
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Equipo</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead className="text-right">Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                 {pendingPayments.length > 0 ? pendingPayments.map((p, index) => (
                                     <TableRow key={`${p.team.id}-${index}`}>
                                        <TableCell>{isClient ? new Date(p.date).toLocaleDateString() : ''}</TableCell>
                                        <TableCell className="font-medium">{p.team.name}</TableCell>
                                        <TableCell className="text-right font-semibold">${p.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm">Marcar como Pagado</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">
                                            No hay pagos de vocalía pendientes.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
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
             <Card>
                <CardHeader>
                    <CardTitle>Registro de Vocalías por Partido</CardTitle>
                    <CardDescription>Desglose de los ingresos por vocalía de cada partido.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="maxima" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="maxima">Máxima</TabsTrigger>
                            <TabsTrigger value="primera">Primera</TabsTrigger>
                            <TabsTrigger value="segunda">Segunda</TabsTrigger>
                        </TabsList>
                        <TabsContent value="maxima" className="mt-4">
                            <VocalitiesTable matches={matchesByMax} />
                        </TabsContent>
                        <TabsContent value="primera" className="mt-4">
                            <VocalitiesTable matches={matchesByFirst} />
                        </TabsContent>
                        <TabsContent value="segunda" className="mt-4">
                             <VocalitiesTable matches={matchesBySecond} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
             </Card>
        </div>
    );
}
