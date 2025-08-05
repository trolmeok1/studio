

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, DollarSign, Download, Printer, ArrowLeft, Home, CalendarClock, User, Trophy, UserCheck, Image as ImageIcon, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { standings as mockStandings, teams, expenses as mockExpenses, type Category, type Standing, type Match, type Expense, upcomingMatches } from '@/lib/mock-data';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, addDays, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from '@/components/ui/input';

// --- Report Components ---

const StandingsReport = ({ category, group }: { category: Category, group?: 'A' | 'B' }) => {
    const standings = mockStandings.filter(s => {
        const team = teams.find(t => t.id === s.teamId);
        return team?.category === category && (group ? team.group === group : true);
    }).map((s, index) => {
        const teamData = teams.find(t => t.id === s.teamId);
        return {
            ...s,
            rank: index + 1,
            teamLogoUrl: teamData?.logoUrl || 'https://placehold.co/100x100.png'
        };
    }).sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));

    const getRowClass = (rank: number, index: number) => {
        if (rank <= 3) return 'bg-red-800/20'; // Using a darker red for better contrast on white
        return index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
    };

    const getPositionClass = (rank: number) => {
        if (rank <= 3) return 'bg-red-600 text-white';
        return 'bg-gray-200';
    }
    
    return (
        <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none" style={{ backgroundImage: `url('/field-bg-light.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <header className="flex flex-col items-center text-center mb-6 bg-black/50 text-white p-4 rounded-lg">
                <Image src="https://placehold.co/150x150.png" alt="Logo Liga" width={80} height={80} data-ai-hint="league logo" className="bg-white rounded-full p-1" />
                <h1 className="text-3xl font-bold mt-2 tracking-widest uppercase">Tabla de Posiciones</h1>
                 <div className="bg-white text-gray-800 font-bold py-1 px-4 rounded-md w-fit mx-auto mt-2 text-lg">
                    {category} {group ? `- Grupo ${group}` : ''}
                </div>
            </header>
            <Table className="bg-white/90 rounded-lg overflow-hidden">
                <TableHeader>
                    <TableRow className="bg-gray-200 hover:bg-gray-200">
                        <TableHead className="w-[50px] text-center text-black font-bold">POS</TableHead>
                        <TableHead className="text-black font-bold">EQUIPO</TableHead>
                        <TableHead className="text-center text-black font-bold">PTS</TableHead>
                        <TableHead className="text-center text-black font-bold">PJ</TableHead>
                        <TableHead className="text-center text-black font-bold">G</TableHead>
                        <TableHead className="text-center text-black font-bold">E</TableHead>
                        <TableHead className="text-center text-black font-bold">P</TableHead>
                        <TableHead className="text-center text-black font-bold">GF</TableHead>
                        <TableHead className="text-center text-black font-bold">GC</TableHead>
                        <TableHead className="text-center text-black font-bold">DG</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {standings.map((s, index) => (
                        <TableRow key={s.teamId} className={cn("border-gray-300", getRowClass(s.rank, index))}>
                           <TableCell className="p-0 w-[50px] text-center">
                                <div className={cn("h-full w-full flex items-center justify-center font-bold text-sm py-3", getPositionClass(s.rank))}>
                                    {s.rank}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image src={s.teamLogoUrl} alt={s.teamName} width={28} height={28} className="rounded-full bg-gray-200 p-0.5" data-ai-hint="team logo" />
                                    <span className="font-semibold">{s.teamName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-bold text-lg">{s.points}</TableCell>
                            <TableCell className="text-center">{s.played}</TableCell>
                            <TableCell className="text-center">{s.wins}</TableCell>
                            <TableCell className="text-center">{s.draws}</TableCell>
                            <TableCell className="text-center">{s.losses}</TableCell>
                            <TableCell className="text-center">{s.goalsFor}</TableCell>
                            <TableCell className="text-center">{s.goalsAgainst}</TableCell>
                            <TableCell className="text-center">{s.goalsFor - s.goalsAgainst}</TableCell>
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
        return [];
    }, [dateRange]);

    const filteredExpenses = useMemo(() => {
        if (!dateRange?.from) return [];
        return mockExpenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= dateRange.from! && expenseDate <= (dateRange.to || dateRange.from!);
        });
    }, [dateRange]);

    const income = useMemo(() => {
        return filteredMatches.reduce((acc, match) => acc, 0);
    }, [filteredMatches]);
    
    const totalExpenses = useMemo(() => {
        return filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    }, [filteredExpenses]);

    const finalBalance = income - totalExpenses;

    const FinancialRow = ({ label, value, isSubtotal = false, isTotal = false, isNegative = false }: { label: string, value: number, isSubtotal?: boolean, isTotal?: boolean, isNegative?: boolean }) => (
        <TableRow className={cn(isSubtotal && "bg-gray-200 font-semibold", isTotal && "bg-gray-800 text-white font-bold")}>
            <TableCell>{label}</TableCell>
            <TableCell className={cn("text-right", isNegative && "text-red-600")}>${value.toFixed(2)}</TableCell>
        </TableRow>
    );

    if (!isClient) {
        return null;
    }

    return (
        <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none font-sans">
             <header className="flex justify-between items-center mb-6 border-b-2 pb-4 border-black">
                <div className="flex items-center gap-4">
                    <Image src="https://placehold.co/100x100.png" alt="Logo Liga" width={60} height={60} data-ai-hint="league logo" />
                    <div>
                        <h1 className="text-2xl font-bold">LIGA DEPORTIVA BARRIAL "LA LUZ"</h1>
                    </div>
                </div>
                 <div className="text-right">
                    <h2 className="text-xl font-semibold">REPORTE FINANCIERO</h2>
                     {dateRange?.from && (
                         <p className="text-sm">
                             Del {format(dateRange.from, 'dd/MM/yyyy')} al {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : format(dateRange.from, 'dd/MM/yyyy')}
                         </p>
                     )}
                 </div>
            </header>
            
            <Table>
                <TableBody>
                    <TableRow className="bg-gray-100 font-bold"><TableCell colSpan={2}>Ingresos</TableCell></TableRow>
                    <FinancialRow label="Ingresos por Vocalías" value={income} />
                    {/* Add other income sources if needed */}
                    <FinancialRow label="Suma Ingresos" value={income} isSubtotal />

                    <TableRow className="bg-gray-100 font-bold"><TableCell colSpan={2}>Gastos</TableCell></TableRow>
                    {filteredExpenses.map(expense => (
                        <FinancialRow key={expense.id} label={expense.description} value={expense.amount} isNegative />
                    ))}
                    <FinancialRow label="Suma Gastos" value={totalExpenses} isSubtotal isNegative />

                    <FinancialRow label="TOTAL TESORERÍA" value={finalBalance} isTotal isNegative={finalBalance < 0} />
                </TableBody>
            </Table>
            
            <footer className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
                Generado por Liga Control.
            </footer>
        </div>
    );
};

const StandardFlyer = ({ localTeam, awayTeam, date, time }: { localTeam?: Team, awayTeam?: Team, date?: Date, time: string }) => {
    return (
        <div
            id="printable-report"
            className="bg-[#1a233c] text-white p-8 max-w-2xl mx-auto print:border-none relative overflow-hidden aspect-[4/5] flex flex-col justify-between"
            style={{ backgroundImage: `url('/textured-background.png')` }}
        >
             <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-teal-500/20 to-transparent -translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-teal-500/20 to-transparent translate-x-1/4 translate-y-1/4 blur-3xl"></div>

            <header className="text-center z-10">
                <Image src="https://placehold.co/100x100.png" alt="Logo de la Liga" width={60} height={60} className="mx-auto" data-ai-hint="league logo lion" />
                <p className="font-bold text-lg mt-2">LIGA LA LUZ</p>
            </header>

            <main className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 z-10">
                <div className="flex flex-col items-center text-center gap-2">
                    <Image src={localTeam?.logoUrl || "https://placehold.co/400x400.png"} alt={localTeam?.name || "Equipo Local"} width={150} height={150} data-ai-hint="wolf logo" />
                    <p className="font-bold text-xl">{localTeam?.name || "Equipo Local"}</p>
                </div>

                <div className="font-extrabold text-6xl text-center italic -rotate-6">VS</div>

                <div className="flex flex-col items-center text-center gap-2">
                    <Image src={awayTeam?.logoUrl || "https://placehold.co/400x400.png"} alt={awayTeam?.name || "Equipo Visitante"} width={150} height={150} data-ai-hint="tiger logo" />
                    <p className="font-bold text-xl">{awayTeam?.name || "Equipo Visitante"}</p>
                </div>
            </main>

            <footer className="text-center z-10">
                {date && <p className="text-2xl font-bold">{format(date, "eeee dd 'de' MMMM", { locale: es }).toLocaleUpperCase()}</p>}
                {time && <p className="text-lg">A LAS {time} HRS.</p>}
            </footer>
        </div>
    );
};

const SemifinalFlyer = ({ localTeam, awayTeam, date, time }: { localTeam?: Team, awayTeam?: Team, date?: Date, time: string }) => {
    return (
        <div
            id="printable-report"
            className="bg-gray-800 text-white p-8 max-w-2xl mx-auto print:border-none relative overflow-hidden aspect-[4/5] flex flex-col justify-between items-center"
        >
            <Image src="https://placehold.co/800x1000.png" alt="Soccer player" layout="fill" objectFit="cover" className="opacity-30" data-ai-hint="soccer player action" />
            <div className="absolute inset-0 bg-black/50" />

            <header className="text-center z-10 mt-8">
                <h1 className="text-6xl font-extrabold tracking-tighter">SEMI</h1>
                <h1 className="text-8xl font-extrabold tracking-tighter text-red-600 -mt-4">FINALES</h1>
            </header>

            <main className="z-10 w-full flex-grow flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                    {date && <p className="text-lg font-bold">{format(date, "dd MMMM", { locale: es }).toLocaleUpperCase()} | {time}</p>}
                    <p className="text-sm tracking-widest">ESTADIO LIGA LA LUZ</p>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 w-full px-8">
                    <div className="flex flex-col items-center text-center gap-2">
                        <Image src={localTeam?.logoUrl || "https://placehold.co/400x400.png"} alt={localTeam?.name || "Equipo Local"} width={100} height={100} data-ai-hint="team logo shield" />
                        <p className="font-semibold text-base mt-2">{localTeam?.name || "Equipo A"}</p>
                    </div>

                    <div className="font-extrabold text-5xl text-center italic">VS</div>

                    <div className="flex flex-col items-center text-center gap-2">
                         <Image src={awayTeam?.logoUrl || "https://placehold.co/400x400.png"} alt={awayTeam?.name || "Equipo Visitante"} width={100} height={100} data-ai-hint="team logo shield" />
                        <p className="font-semibold text-base mt-2">{awayTeam?.name || "Equipo B"}</p>
                    </div>
                </div>
            </main>

             <footer className="z-10 mb-4">
                <Image src="https://placehold.co/100x100.png" alt="Logo de la Liga" width={40} height={40} className="mx-auto" data-ai-hint="league logo" />
            </footer>
        </div>
    );
};

const FinalFlyer = ({ localTeam, awayTeam, date, time }: { localTeam?: Team, awayTeam?: Team, date?: Date, time: string }) => {
    return (
        <div
            id="printable-report"
            className="bg-[#5c0a0a] text-white p-8 max-w-2xl mx-auto print:border-none relative overflow-hidden aspect-[4/5] flex flex-col"
            style={{ backgroundImage: `url(https://placehold.co/800x1000.png)`, backgroundSize: 'cover', backgroundPosition: 'bottom' }}
             data-ai-hint="red cracked wall"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-red-900/30 z-0" />
            <div className="relative z-10 flex-grow flex flex-col">
                <header className="text-center">
                    <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>Gran</h1>
                    <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none -mt-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>Final</h1>
                </header>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <Image src="https://placehold.co/400x400.png" alt="Soccer player silhouette" width={400} height={400} className="opacity-80 object-contain" data-ai-hint="soccer player kick" />
                </div>

                <main className="flex-grow flex items-end justify-between w-full mt-auto">
                    <p className="font-black text-4xl uppercase -rotate-6">{localTeam?.name || "Equipo A"}</p>
                    <p className="font-black text-6xl text-center italic mx-4">VS</p>
                    <p className="font-black text-4xl uppercase rotate-6 text-right">{awayTeam?.name || "Equipo B"}</p>
                </main>
            </div>
             <footer className="text-center z-10 mt-8">
                {date && time && (
                    <p className="text-xl font-bold tracking-wider">{`HOY A LAS ${time} HRS`}</p>
                )}
            </footer>
        </div>
    );
};


const ScheduleReport = () => {
    const weeklyMatches = useMemo(() => {
        const today = new Date();
        const nextWeek = addDays(today, 7);
        return upcomingMatches
            .filter(match => isWithinInterval(new Date(match.date), { start: today, end: nextWeek }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, []);

    const groupedMatches = useMemo(() => {
        return weeklyMatches.reduce((acc, match) => {
            const dateKey = format(new Date(match.date), 'PPPP', { locale: es });
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(match);
            return acc;
        }, {} as Record<string, Match[]>);
    }, [weeklyMatches]);
    
    return (
         <div id="printable-report" className="bg-white text-black p-8 max-w-4xl mx-auto border border-gray-300 print:border-none">
            <header className="flex justify-between items-center mb-6 border-b-2 pb-4 border-black">
                <div className="flex items-center gap-4">
                    <Image src="https://placehold.co/100x100.png" alt="Logo Liga" width={60} height={60} data-ai-hint="league logo" />
                    <div>
                        <h1 className="text-2xl font-bold">LIGA DEPORTIVA BARRIAL "LA LUZ"</h1>
                        <h2 className="text-xl font-semibold">Programación Semanal de Partidos</h2>
                    </div>
                </div>
            </header>
            
            {Object.keys(groupedMatches).length === 0 ? (
                <p className="text-center text-gray-500 py-10">No hay partidos programados para la próxima semana.</p>
            ) : (
                Object.entries(groupedMatches).map(([date, matches]) => (
                    <div key={date} className="mb-6">
                        <h3 className="text-lg font-bold bg-gray-200 p-2 rounded-md mb-2">{date}</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Equipo Local</TableHead>
                                    <TableHead>Equipo Visitante</TableHead>
                                    <TableHead>Cancha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matches.map(match => (
                                    <TableRow key={match.id}>
                                        <TableCell className="font-bold">{format(new Date(match.date), 'HH:mm')}</TableCell>
                                        <TableCell><Badge variant="outline">{match.category}</Badge></TableCell>
                                        <TableCell>{match.teams.home.name}</TableCell>
                                        <TableCell>{match.teams.away.name}</TableCell>
                                        <TableCell className="text-center">{match.field || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ))
            )}
         </div>
    );
};


type ReportType = 'standings' | 'schedule' | 'flyer' | 'finance' | null;
type FlyerDesign = 'standard' | 'semifinal' | 'final';

export default function ReportsPage() {
    const [reportType, setReportType] = useState<ReportType>(null);
    // Standings
    const [category, setCategory] = useState<Category>('Máxima');
    const [group, setGroup] = useState<'A' | 'B' | 'all'>('all');
    // Finance
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    // Flyer
    const [localTeamId, setLocalTeamId] = useState<string | null>(null);
    const [awayTeamId, setAwayTeamId] = useState<string | null>(null);
    const [flyerDate, setFlyerDate] = useState<Date | undefined>(undefined);
    const [flyerTime, setFlyerTime] = useState<string>('12:00');
    const [flyerDesign, setFlyerDesign] = useState<FlyerDesign>('standard');
    
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
        }
    }, []);
    
    useEffect(() => {
        if (isClient) {
             setDateRange({ from: new Date(), to: new Date() });
             setFlyerDate(new Date());
        }
    }, [isClient]);

    const localTeam = useMemo(() => teams.find(t => t.id === localTeamId), [localTeamId]);
    const awayTeam = useMemo(() => teams.find(t => t.id === awayTeamId), [awayTeamId]);


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
                        Imprimir / Descargar
                    </Button>
                </div>
                <div className="mt-4">
                    {reportType === 'standings' && <StandingsReport category={category} group={group === 'all' ? undefined : group} />}
                    {reportType === 'schedule' && <ScheduleReport />}
                    {reportType === 'finance' && <FinancialReport dateRange={dateRange} />}
                    {reportType === 'flyer' && flyerDesign === 'standard' && <StandardFlyer localTeam={localTeam} awayTeam={awayTeam} date={flyerDate} time={flyerTime} />}
                    {reportType === 'flyer' && flyerDesign === 'semifinal' && <SemifinalFlyer localTeam={localTeam} awayTeam={awayTeam} date={flyerDate} time={flyerTime} />}
                    {reportType === 'flyer' && flyerDesign === 'final' && <FinalFlyer localTeam={localTeam} awayTeam={awayTeam} date={flyerDate} time={flyerTime} />}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <BarChart2 className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Tabla de Posiciones Oficial</CardTitle>
                                <CardDescription>Genere un documento PDF con la tabla de posiciones actual de una categoría.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="category-standings">Categoría</Label>
                                <Select value={category} onValueChange={(v) => { setCategory(v as Category); setGroup('all'); }}>
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
                            <div>
                                <Label htmlFor="group-standings">Grupo</Label>
                                <Select value={group} onValueChange={(v) => setGroup(v as 'A' | 'B' | 'all')} disabled={category !== 'Segunda'}>
                                    <SelectTrigger id="group-standings">
                                        <SelectValue placeholder="Elige un grupo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="A">Grupo A</SelectItem>
                                        <SelectItem value="B">Grupo B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button className="w-full mt-4" onClick={() => handleGenerate('standings')}>
                            <Printer className="mr-2" />
                            Generar Reporte de Posiciones
                        </Button>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Reporte de Programación Semanal</CardTitle>
                                <CardDescription>Genere un PDF con todos los partidos para los próximos 7 días.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => handleGenerate('schedule')}>
                            <Printer className="mr-2" />
                            Generar Programación Semanal
                        </Button>
                    </CardContent>
                </Card>


                 <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Generador de Flyers de Partidos</CardTitle>
                                <CardDescription>Cree pósters personalizados para los próximos partidos de la liga.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="local-team">Equipo Local</Label>
                                    <Select onValueChange={setLocalTeamId}>
                                        <SelectTrigger id="local-team"><SelectValue placeholder="Elegir..." /></SelectTrigger>
                                        <SelectContent>{teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="away-team">Equipo Visitante</Label>
                                    <Select onValueChange={setAwayTeamId}>
                                        <SelectTrigger id="away-team"><SelectValue placeholder="Elegir..." /></SelectTrigger>
                                        <SelectContent>{teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="flyer-design">Diseño del Flyer</Label>
                                <Select value={flyerDesign} onValueChange={(v) => setFlyerDesign(v as FlyerDesign)}>
                                    <SelectTrigger id="flyer-design">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Estándar (1 vs 1)</SelectItem>
                                        <SelectItem value="semifinal">Semifinal</SelectItem>
                                        <SelectItem value="final">Gran Final</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="flyer-date">Fecha</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {flyerDate ? format(flyerDate, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={flyerDate} onSelect={setFlyerDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="flyer-time">Hora</Label>
                                    <Input id="flyer-time" type="time" value={flyerTime} onChange={e => setFlyerTime(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <Button className="w-full mt-4" onClick={() => handleGenerate('flyer')} disabled={!localTeamId || !awayTeamId}>
                            <Printer className="mr-2" />
                            Generar Flyer
                        </Button>
                    </CardContent>
                </Card>


                 <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>Reporte Financiero Detallado</CardTitle>
                                <CardDescription>Genere un estado de cuenta completo con ingresos, gastos y balance final.</CardDescription>
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
                            Generar Reporte Financiero
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
