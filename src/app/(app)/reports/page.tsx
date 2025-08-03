
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, ShieldAlert, DollarSign, Download, Printer, ArrowLeft, Home, CalendarClock, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { standings as mockStandings, sanctions as mockSanctions, upcomingMatches, teams, generateFinancialReport, expenses as mockExpenses, type Category, type Standing, type Sanction, type Match, type Expense } from '@/lib/mock-data';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


// --- Report Components ---

const StandingsReport = ({ category }: { category: Category }) => {
    const standings = mockStandings.filter(s => {
        const team = teams.find(t => t.id === s.teamId);
        return team?.category === category;
    }).map(s => {
        const teamData = teams.find(t => t.id === s.teamId);
        return {
            ...s,
            teamLogoUrl: teamData?.logoUrl || 'https://placehold.co/100x100.png'
        };
    }).sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));

    return (
        <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none">
            <header className="flex flex-col items-center text-center mb-6">
                <Image src="https://placehold.co/150x150.png" alt="Logo Liga" width={100} height={100} data-ai-hint="league logo" />
                <h1 className="text-2xl font-bold mt-2">LIGA DEPORTIVA BARRIAL "LA LUZ"</h1>
                <p className="text-lg font-semibold">TABLA DE POSICIONES OFICIAL</p>
                <p className="text-md">Categoría: {category}</p>
            </header>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200">
                        <TableHead className="w-[40px] text-black font-bold">#</TableHead>
                        <TableHead className="text-black font-bold">Equipo</TableHead>
                        <TableHead className="text-center text-black font-bold">PJ</TableHead>
                        <TableHead className="text-center text-black font-bold">PTS</TableHead>
                        <TableHead className="text-center text-black font-bold">GD</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {standings.map((s, index) => (
                        <TableRow key={s.teamId} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                            <TableCell className="font-bold">{index + 1}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image src={s.teamLogoUrl} alt={s.teamName} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                    <span>{s.teamName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">{s.played}</TableCell>
                            <TableCell className="text-center font-bold">{s.points}</TableCell>
                            <TableCell className="text-center">{s.goalsFor - s.goalsAgainst}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

const ScheduleReport = ({ week }: { week: string }) => {
    const matches = upcomingMatches.slice(0, 4); 
    const PlayerIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M16 2.8a1.5 1.5 0 0 1 2.4 1.2" />
        <path d="M16 2.8a1.5 1.5 0 0 0-2.4 1.2" />
        <path d="M12 11.8a1.5 1.5 0 0 1-2.4-1.2" />
        <path d="m14 4-2 3" />
        <path d="M10 4 8 7" />
        <path d="M12 21v-8l2-3" />
        <path d="M12 13 8 7.5" />
        <path d="m3.5 10.5 3 2.5" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="4" cy="18" r="2" />
      </svg>
    );

    const BallIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12-2 18" />
        <path d="M12 12 2 6" />
        <path d="M12 12 22 6" />
        <path d="M12 12 22 18" />
        <path d="m12 12-5.5 10" />
        <path d="m12 12 5.5 10" />
        <path d="m12 12-5.5-10" />
        <path d="m12 12 5.5-10" />
      </svg>
    );

    return (
        <div id="printable-report" className="bg-gray-800 text-white font-headline relative print:border-none aspect-[1/1.414] max-w-2xl mx-auto">
            <div className="absolute inset-0 z-0">
                <Image src="/soccer-field-bg.jpg" layout="fill" objectFit="cover" alt="Fondo de estadio" className="opacity-20" data-ai-hint="stadium background" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full">
                <header className="text-center mb-8">
                    <Trophy className="mx-auto h-12 w-12 text-yellow-400" />
                    <h1 className="text-3xl font-bold tracking-tight uppercase mt-2">Campeonato Barrial</h1>
                    <h2 className="text-5xl font-extrabold text-yellow-400 tracking-wider">{week.toUpperCase()}</h2>
                </header>

                <main className="flex-grow space-y-4">
                    {matches.map(match => (
                         <div key={match.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                            {/* Team A */}
                            <div className="flex flex-col items-end text-right">
                                <p className="text-lg font-bold uppercase">{match.teams.home.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                                    <span>Cancha {match.id.slice(-1)}</span>
                                     <Home className="h-3 w-3" />
                                </div>
                            </div>
                            
                            {/* VS */}
                            <div className="flex flex-col items-center">
                                <div className="bg-yellow-400 text-black rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg">
                                    VS
                                </div>
                                 <p className="text-xs text-yellow-400 mt-1">{format(new Date(match.date), 'HH:mm')}</p>
                            </div>

                            {/* Team B */}
                            <div className="flex flex-col items-start text-left">
                                <p className="text-lg font-bold uppercase">{match.teams.away.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                                     <CalendarClock className="h-3 w-3" />
                                     <span>{format(new Date(match.date), "dd MMM", { locale: es })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </main>

                <footer className="text-center text-xs text-gray-400 mt-8">
                    www.ligalaluz.com
                </footer>
            </div>
        </div>
    );
};


const SanctionsReport = () => {
    return (
        <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none">
             <header className="flex flex-col items-center text-center mb-6">
                <Image src="https://placehold.co/150x150.png" alt="Logo Liga" width={100} height={100} data-ai-hint="league logo" />
                <h1 className="text-2xl font-bold mt-2">LIGA DEPORTIVA BARRIAL "LA LUZ"</h1>
                <p className="text-lg font-semibold">REPORTE DE SANCIONES</p>
                <p className="text-md">Fecha: {format(new Date(), 'PPP', { locale: es })}</p>
            </header>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200">
                        <TableHead className="text-black font-bold">Jugador</TableHead>
                        <TableHead className="text-black font-bold">Equipo</TableHead>
                        <TableHead className="text-black font-bold">Motivo</TableHead>
                        <TableHead className="text-center text-black font-bold">Partidos Suspendido</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockSanctions.map(sanction => (
                        <TableRow key={sanction.id}>
                            <TableCell>{sanction.playerName}</TableCell>
                            <TableCell>{sanction.teamName}</TableCell>
                            <TableCell>{sanction.reason}</TableCell>
                            <TableCell className="text-center font-bold">{sanction.gamesSuspended}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

const FinancialReport = () => {
     const reportText = useMemo(() => generateFinancialReport(upcomingMatches, mockExpenses), []);
    return (
        <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none">
             <header className="flex flex-col items-center text-center mb-6">
                <Image src="https://placehold.co/150x150.png" alt="Logo Liga" width={100} height={100} data-ai-hint="league logo" />
                <h1 className="text-2xl font-bold mt-2">LIGA DEPORTIVA BARRIAL "LA LUZ"</h1>
                <p className="text-lg font-semibold">REPORTE FINANCIERO</p>
            </header>
            <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-4 rounded-md">
                {reportText}
            </pre>
        </div>
    )
}


type ReportType = 'standings' | 'schedule' | 'sanctions' | 'finance' | null;

export default function ReportsPage() {
    const [reportType, setReportType] = useState<ReportType>(null);
    const [category, setCategory] = useState<Category>('Máxima');
    const [week, setWeek] = useState('Jornada 1');
    const [period, setPeriod] = useState('weekly');

    const handleGenerate = (type: ReportType) => {
        setReportType(type);
    }
    
    const handlePrint = () => {
        window.print();
    }
    
    if (reportType) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                 <div className="print:hidden flex items-center justify-between">
                    <Button variant="outline" onClick={() => setReportType(null)}>
                        <ArrowLeft className="mr-2" />
                        Volver a Reportes
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2" />
                        Imprimir Reporte
                    </Button>
                </div>
                <div className="mt-4">
                    {reportType === 'standings' && <StandingsReport category={category} />}
                    {reportType === 'schedule' && <ScheduleReport week={week} />}
                    {reportType === 'sanctions' && <SanctionsReport />}
                    {reportType === 'finance' && <FinancialReport />}
                </div>
                 <style jsx global>{`
                    @media print {
                      body {
                        background-color: white !important;
                        background-image: none !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      .print\\:hidden {
                        display: none !important;
                      }
                       .print\\:border-none {
                        border: none !important;
                      }
                       .flex-1.space-y-4 {
                         padding: 0 !important;
                       }
                    }
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">
                    Módulo de Reportes
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <BarChart2 className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Tabla de Posiciones Oficial</CardTitle>
                                <CardDescription>Genere un documento PDF con la tabla de posiciones actual de una categoría, listo para imprimir o compartir.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-2">
                            <Label htmlFor="category-standings">Seleccionar Categoría</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                                <SelectTrigger id="category-standings">
                                    <SelectValue placeholder="Elige una categoría..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Máxima">Máxima</SelectItem>
                                    <SelectItem value="Primera">Primera</SelectItem>
                                    <SelectItem value="Segunda">Segunda</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full mt-4" onClick={() => handleGenerate('standings')}>
                            <Printer className="mr-2" />
                            Generar Reporte
                        </Button>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Programación Semanal</CardTitle>
                                <CardDescription>Cree un reporte con todos los partidos de la próxima jornada, incluyendo horarios, canchas y árbitros.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-2">
                            <Label htmlFor="week-schedule">Seleccionar Jornada</Label>
                            <Select value={week} onValueChange={setWeek}>
                                <SelectTrigger id="week-schedule">
                                    <SelectValue placeholder="Elige una jornada..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 22 }, (_, i) => (
                                         <SelectItem key={i + 1} value={`Jornada ${i + 1}`}>Jornada {i + 1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <Button className="w-full mt-4" onClick={() => handleGenerate('schedule')}>
                            <Printer className="mr-2" />
                            Generar Reporte
                        </Button>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Reporte de Sanciones</CardTitle>
                                <CardDescription>Liste todos los jugadores actualmente sancionados, el motivo de la sanción y los partidos de suspensión.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground h-[56px] flex items-center">Este reporte incluirá a todos los jugadores con sanciones activas en todas las categorías.</p>
                         <Button className="w-full mt-4" onClick={() => handleGenerate('sanctions')}>
                            <Printer className="mr-2" />
                            Generar Reporte
                        </Button>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Reporte Financiero Detallado</CardTitle>
                                <CardDescription>Genere un estado de cuenta completo con ingresos por vocalías, pagos pendientes y multas aplicadas.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-2">
                            <Label htmlFor="finance-period">Seleccionar Periodo</Label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger id="finance-period">
                                    <SelectValue placeholder="Elige un periodo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensual</SelectItem>
                                    <SelectItem value="full">Todo el campeonato</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <Button className="w-full mt-4" onClick={() => handleGenerate('finance')}>
                            <Printer className="mr-2" />
                            Generar Reporte
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

