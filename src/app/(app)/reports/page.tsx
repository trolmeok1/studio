

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, ShieldAlert, DollarSign, Download, Printer, ArrowLeft, Home, CalendarClock, User, Trophy, UserCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { standings as mockStandings, sanctions as mockSanctions, upcomingMatches, teams, expenses as mockExpenses, type Category, type Standing, type Sanction, type Match, type Expense, getReferees } from '@/lib/mock-data';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from "lucide-react";

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

const ScheduleReport = ({ matches }: { matches: Match[] }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    
    return (
        <div id="printable-report" className="bg-gray-800 text-white font-headline relative print:border-none aspect-[1/1.414] max-w-2xl mx-auto">
            <div className="absolute inset-0 z-0">
                <Image src="/soccer-field-bg.jpg" layout="fill" objectFit="cover" alt="Fondo de estadio" className="opacity-20" data-ai-hint="stadium background" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full">
                <header className="text-center mb-8">
                    <Image src="https://placehold.co/150x150.png" alt="Logo Liga" width={100} height={100} data-ai-hint="league logo" className="mx-auto" />
                    <h1 className="text-3xl font-bold tracking-tight uppercase mt-2">Campeonato Barrial</h1>
                    <h2 className="text-5xl font-extrabold text-yellow-400 tracking-wider">PROGRAMACIÓN SEMANAL</h2>
                     <p className="text-md mt-2">
                        {matches.length > 0 &&
                            `${format(new Date(matches[0].date), "dd 'de' MMMM", { locale: es })} - ${format(new Date(matches[matches.length - 1].date), "dd 'de' MMMM 'del' yyyy", { locale: es })}`
                        }
                    </p>
                </header>

                <main className="flex-grow space-y-4">
                    {matches.map(match => {
                        return (
                             <div key={match.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                                {/* Team A */}
                                <div className="flex flex-col items-center text-center">
                                    <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={60} height={60} className="rounded-full border-2 border-white/50" data-ai-hint="team logo" />
                                    <p className="text-lg font-bold uppercase mt-2">{match.teams.home.name}</p>
                                    <p className="text-xs text-gray-300 mt-1">Camerino {match.teams.home.vocalPaymentDetails?.otherFinesDescription || 'N/A'}</p>
                                </div>
                                
                                {/* VS */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-yellow-400 text-black rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg">
                                        VS
                                    </div>
                                    <p className="text-xl font-bold text-yellow-400 mt-2">{format(new Date(match.date), 'HH:mm')}</p>
                                    <p className="text-xs text-gray-300 mt-1">{format(new Date(match.date), "eeee, dd 'de' MMMM", { locale: es })}</p>
                                </div>

                                {/* Team B */}
                                <div className="flex flex-col items-center text-center">
                                    <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={60} height={60} className="rounded-full border-2 border-white/50" data-ai-hint="team logo" />
                                    <p className="text-lg font-bold uppercase mt-2">{match.teams.away.name}</p>
                                    <p className="text-xs text-gray-300 mt-1">Camerino {match.teams.away.vocalPaymentDetails?.otherFinesDescription || 'N/A'}</p>
                                </div>
                            </div>
                        )
                    })}
                     {matches.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-xl">No hay partidos programados para la próxima semana.</p>
                        </div>
                    )}
                </main>

                <footer className="text-center text-xs text-gray-400 mt-8">
                    www.ligacontrol.com
                </footer>
            </div>
        </div>
    );
};


const SanctionsReport = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none">
             <header className="flex flex-col items-center text-center mb-6">
                <Image src="https://placehold.co/150x150.png" alt="Logo Liga" width={100} height={100} data-ai-hint="league logo" />
                <h1 className="text-2xl font-bold mt-2">LIGA DEPORTIVA BARRIAL "LA LUZ"</h1>
                <p className="text-lg font-semibold">REPORTE DE SANCIONES</p>
                {isClient && <p className="text-md">Fecha: {format(new Date(), 'PPP', { locale: es })}</p>}
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

const FinancialReport = ({ dateRange }: { dateRange: DateRange | undefined }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredMatches = useMemo(() => {
        if (!dateRange?.from) return [];
        return upcomingMatches.filter(m => {
            const matchDate = new Date(m.date);
            return matchDate >= dateRange.from! && matchDate <= (dateRange.to || dateRange.from!);
        });
    }, [dateRange]);

    const filteredExpenses = useMemo(() => {
        if (!dateRange?.from) return [];
        return mockExpenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= dateRange.from! && expenseDate <= (dateRange.to || dateRange.from!);
        });
    }, [dateRange]);

    const income = useMemo(() => {
        return filteredMatches.reduce((acc, match) => {
            const homeIncome = match.teams.home.vocalPaymentDetails?.paymentStatus === 'paid' ? match.teams.home.vocalPaymentDetails.total : 0;
            const awayIncome = match.teams.away.vocalPaymentDetails?.paymentStatus === 'paid' ? match.teams.away.vocalPaymentDetails.total : 0;
            return acc + homeIncome + awayIncome;
        }, 0);
    }, [filteredMatches]);
    
    const expenses = useMemo(() => {
        return filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    }, [filteredExpenses]);

    const finalBalance = income - expenses;

    const ReconciliationRow = ({ label, value, isTotal = false, isNegative = false }: { label: string, value: number, isTotal?: boolean, isNegative?: boolean }) => (
        <div className={cn("flex justify-between py-1 px-2", isTotal && "font-bold border-t border-black mt-1 pt-1")}>
            <span>{label}</span>
            <span className={cn(isNegative && "text-red-600")}>${value.toFixed(2)}</span>
        </div>
    );

    if (!isClient) {
        return null;
    }

    return (
        <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none font-sans">
             <header className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <Image src="https://placehold.co/100x100.png" alt="Logo Liga" width={60} height={60} data-ai-hint="league logo" />
                    <div>
                        <h1 className="text-lg font-bold">LIGA DEPORTIVA BARRIAL "LA LUZ"</h1>
                        <p className="text-xs">En confianza.</p>
                    </div>
                </div>
                 <div className="text-right">
                    <h2 className="text-xl font-bold">ESTADO DE CUENTA</h2>
                    <p className="text-xs">Página 1 de 1</p>
                 </div>
            </header>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border p-2 text-xs">
                    <p className="font-bold">LIGA DEPORTIVA BARRIAL "LA LUZ"</p>
                    <p>RUC: 1790000000001</p>
                    <p>QUITO, ECUADOR</p>
                </div>
                 <div className="border p-2 text-xs">
                    <div className="flex justify-between">
                        <span>FECHA INICIO REPORTE:</span>
                        <span className="font-semibold">{dateRange?.from ? format(dateRange.from, 'dd-MM-yyyy') : 'N/A'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>FECHA FIN REPORTE:</span>
                        <span className="font-semibold">{dateRange?.to ? format(dateRange.to, 'dd-MM-yyyy') : 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="border p-2">
                 <h3 className="font-bold text-center bg-gray-200 py-1 mb-2">CONCILIACIÓN</h3>
                 <div className="space-y-1 text-sm">
                    <ReconciliationRow label="SALDO ANTERIOR" value={0} />
                    <ReconciliationRow label="(+) DEPÓSITOS / CRÉDITOS (Vocalías)" value={income} />
                    <ReconciliationRow label="(-) CHEQUES / DÉBITOS (Gastos)" value={expenses} isNegative />
                    <ReconciliationRow label="INTERÉS PERIODO" value={0} />
                    <ReconciliationRow label="SALDO ACTUAL" value={finalBalance} isTotal />
                 </div>
            </div>

            <footer className="text-center text-xs text-gray-500 mt-8">
                Generado por Liga Control.
            </footer>
        </div>
    );
};


type ReportType = 'standings' | 'schedule' | 'sanctions' | 'finance' | null;

export default function ReportsPage() {
    const [reportType, setReportType] = useState<ReportType>(null);
    const [category, setCategory] = useState<Category>('Máxima');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
            setDateRange({ from: new Date(), to: new Date() });
        }
    }, []);

    const weeklyMatches = useMemo(() => {
        if (!isClient) return [];
        const today = new Date();
        const nextWeek = addDays(today, 7);
        return upcomingMatches
            .filter(match => {
                const matchDate = new Date(match.date);
                return matchDate >= today && matchDate <= nextWeek;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [isClient]);

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
                    {reportType === 'schedule' && <ScheduleReport matches={weeklyMatches} />}
                    {reportType === 'sanctions' && <SanctionsReport />}
                    {reportType === 'finance' && <FinancialReport dateRange={dateRange} />}
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
                        margin: 1cm;
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                    Módulo de Reportes
                  </span>
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
                                <CardDescription>Cree un reporte con todos los partidos de la próxima semana, incluyendo horarios y canchas.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-2 h-[56px] flex items-center">
                            <p className="text-sm text-muted-foreground">Este reporte generará automáticamente los partidos para los próximos 7 días.</p>
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
                             <Label>Seleccionar Rango de Fechas</Label>
                             {isClient && <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                        ) : (
                                        format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Selecciona un rango</span>
                                    )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarPicker
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>}
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
