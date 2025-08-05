

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { DollarSign, Landmark, Ban, AlertTriangle, Printer, PlusCircle, Trash2 } from 'lucide-react';
import { getMatches, getTeams, type Category, getExpenses, type Expense, addExpense, removeExpense, type Team, type Match } from '@/lib/mock-data';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DateRange } from "react-day-picker";
import Link from 'next/link';
import type { MatchTeam } from '@/lib/types';


const AddExpenseDialog = ({ onAdd }: { onAdd: (expense: Omit<Expense, 'id'>) => void }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [date, setDate] = useState<Date>(new Date());
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = () => {
        if (description && amount) {
            onAdd({ description, amount, date: date.toISOString() });
            setDescription('');
            setAmount('');
            setDate(new Date());
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle className="mr-2" />
                    Registrar Gasto
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
                    <DialogDescription>Añada un nuevo gasto a los registros de tesorería.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label>Fecha del Gasto</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(date, "PPP", { locale: es })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={(d) => setDate(d || new Date())} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción del Gasto</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Compra de trofeos" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Monto</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || '')} placeholder="500.00" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={handleSave}>Guardar Gasto</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function TreasuryPage() {
    const [isClient, setIsClient] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        async function loadData() {
            setLoading(true);
            const [matchesData, expensesData] = await Promise.all([
                getMatches(),
                getExpenses()
            ]);
            setMatches(matchesData);
            setExpenses(expensesData);
            setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
            setLoading(false);
        }
        loadData();
    }, []);
    
    const handleAddExpense = useCallback(async (newExpense: Omit<Expense, 'id'>) => {
        const addedExpense = await addExpense(newExpense);
        setExpenses(prev => [...prev, addedExpense].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, []);

    const handleRemoveExpense = useCallback(async (id: string) => {
        await removeExpense(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, []);

    const filteredMatches = useMemo(() => {
        if (!dateRange?.from) return [];
        const from = startOfDay(dateRange.from);
        const to = endOfDay(dateRange.to ?? dateRange.from);
        return matches.filter(m => {
            const matchDate = new Date(m.date);
            return matchDate >= from && matchDate <= to;
        });
    }, [dateRange, matches]);

    const filteredExpenses = useMemo(() => {
        if (!dateRange?.from) return [];
        const from = startOfDay(dateRange.from);
        const to = endOfDay(dateRange.to ?? dateRange.from);
        return expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= from && expenseDate <= to;
        });
    }, [dateRange, expenses]);

    const paidMatches = useMemo(() => filteredMatches.filter(match => 
        match.teams.home.vocalPaymentDetails?.paymentStatus === 'paid' || 
        match.teams.away.vocalPaymentDetails?.paymentStatus === 'paid'
    ), [filteredMatches]);

    const totalVocalIncome = useMemo(() => paidMatches.reduce((acc, match) => {
        const homePayment = match.teams.home.vocalPaymentDetails?.paymentStatus === 'paid' ? match.teams.home.vocalPaymentDetails?.total || 0 : 0;
        const awayPayment = match.teams.away.vocalPaymentDetails?.paymentStatus === 'paid' ? match.teams.away.vocalPaymentDetails?.total || 0 : 0;
        return acc + homePayment + awayPayment;
    }, 0), [paidMatches]);
    
    const pendingPayments = useMemo(() => filteredMatches.flatMap(match => {
        const pending: { team: MatchTeam, amount: number, date: string }[] = [];
        if (match.teams.home.vocalPaymentDetails?.paymentStatus === 'pending') {
            pending.push({team: match.teams.home, amount: match.teams.home.vocalPaymentDetails.total, date: match.date});
        }
        if (match.teams.away.vocalPaymentDetails?.paymentStatus === 'pending') {
            pending.push({team: match.teams.away, amount: match.teams.away.vocalPaymentDetails.total, date: match.date});
        }
        return pending;
    }), [filteredMatches]);

    const totalSanctionIncome = 550; // Mock data for now

    const absentTeams = useMemo(() => filteredMatches.flatMap(match => {
        const absentees: (MatchTeam & { date: string })[] = [];
        if (!match.teams.home.attended) {
            absentees.push({ ...match.teams.home, date: match.date });
        }
        if (!match.teams.away.attended) {
            absentees.push({ ...match.teams.away, date: match.date });
        }
        return absentees;
    }), [filteredMatches]);

    const VocalPaymentDetailRow = ({ label, value }: { label: string, value: number }) => (
        <div className="flex justify-between text-xs py-0.5">
            <span className="text-muted-foreground">{label}:</span>
            <span>${value.toFixed(2)}</span>
        </div>
    );
    
    const VocalitiesTable = ({ matches: matchesToShow }: { matches: Match[] }) => (
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
                {matchesToShow.map(match => {
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
                 {matchesToShow.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            No hay vocalías registradas en el período seleccionado.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
    
    const matchesByMax = useMemo(() => filteredMatches.filter(m => m.category === 'Máxima'), [filteredMatches]);
    const matchesByFirst = useMemo(() => filteredMatches.filter(m => m.category === 'Primera'), [filteredMatches]);
    const matchesBySecond = useMemo(() => filteredMatches.filter(m => m.category === 'Segunda'), [filteredMatches]);

    if (!isClient || loading) {
        return <div className="p-8">Cargando datos de tesorería...</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="text-center w-full">
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        <span className="bg-gradient-to-r from-primary via-yellow-500 to-amber-400 text-transparent bg-clip-text">
                            Tesorería
                        </span>
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <CalendarIcon className="mr-2" />
                                {dateRange?.from ? 
                                    dateRange.to ? 
                                    `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` :
                                    format(dateRange.from, "LLL dd, y") :
                                    "Seleccionar Fecha"
                                }
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button asChild variant="outline">
                       <Link href="/reports">
                         <Printer className="mr-2" />
                        Generar Reporte
                       </Link>
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card neon="yellow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos Totales
                        </CardTitle>
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalVocalIncome + totalSanctionIncome).toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                            Vocalías y sanciones en el período
                        </p>
                    </CardContent>
                </Card>
                <Card neon="yellow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Gastos Totales
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">-${filteredExpenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString('en-US')}</div>
                         <p className="text-xs text-muted-foreground">
                            Gastos registrados en el período
                        </p>
                    </CardContent>
                </Card>
                 <Card neon="yellow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Balance del Período</CardTitle>
                        <Ban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">${((totalVocalIncome + totalSanctionIncome) - filteredExpenses.reduce((acc, e) => acc + e.amount, 0)).toLocaleString('en-US')}</div>
                        <p className="text-xs text-muted-foreground">
                           Ingresos menos gastos
                        </p>
                    </CardContent>
                </Card>
                <Card neon="yellow">
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
                 <Card neon="yellow">
                    <CardHeader>
                        <CardTitle>Pagos Pendientes de Vocalía</CardTitle>
                         <CardDescription>
                            Equipos que no han cancelado su valor de vocalía en el período seleccionado.
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
                 <Card neon="yellow">
                    <CardHeader className="flex items-center justify-between">
                         <div>
                            <CardTitle>Registro de Gastos</CardTitle>
                            <CardDescription>
                                Egresos y gastos operativos de la liga en el período seleccionado.
                            </CardDescription>
                        </div>
                        <AddExpenseDialog onAdd={handleAddExpense} />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead className="text-right">Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                                     <TableRow key={expense.id}>
                                        <TableCell>{isClient ? new Date(expense.date).toLocaleDateString() : ''}</TableCell>
                                        <TableCell className="font-medium">{expense.description}</TableCell>
                                        <TableCell className="text-right font-semibold text-destructive">-${expense.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveExpense(expense.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">
                                            No hay gastos registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
            </div>
             <Card neon="yellow">
                <CardHeader>
                    <CardTitle>Registro de Vocalías por Partido</CardTitle>
                    <CardDescription>Desglose de los ingresos por vocalía de cada partido en el período seleccionado.</CardDescription>
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
