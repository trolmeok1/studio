
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Printer, Upload, Search, Trash2, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { players, teams, type Player, updatePlayerStats, addSanction, type Category, type Match, matchData as initialMatchData, type VocalPaymentDetails as VocalPaymentDetailsType } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { MatchEvent, MatchEventType } from '@/lib/types';


const PhysicalMatchSheet = () => {
    const handlePrint = () => {
        window.print();
    };

    const PlayerRow = ({ number }: { number: number }) => (
        <TableRow className="h-8">
            <TableCell className="border text-center p-1 w-[40px] text-xs font-medium">{number}</TableCell>
            <TableCell className="border p-1 text-left w-[200px]"></TableCell>
            <TableCell className="border text-center p-1 w-[40px]"></TableCell>
        </TableRow>
    );

    const CardCell = ({label, count}: {label: string, count: number}) => (
        <div className="flex-1">
            <p className="text-center font-bold text-xs uppercase tracking-wider border-b">{label}</p>
            <div className="grid grid-cols-6 h-10">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="border-r last:border-r-0 h-full flex items-center justify-center text-xs">
                        <span className="text-muted-foreground">N°</span>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const IncomeBreakdown = () => (
        <div className="border mt-2 text-xs">
            <div className="bg-gray-200 text-center font-bold p-1">INGRESOS</div>
            <Table className="text-xs">
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold p-1 border-r w-1/2">ÁRBITRO</TableCell>
                        <TableCell className="p-1 text-right">$ 11.00</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold p-1 border-r">CUOTAS</TableCell>
                        <TableCell className="p-1 text-right">$ 2.00</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold p-1 border-r">MULTAS</TableCell>
                        <TableCell className="p-1"></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold p-1 border-r">T. AMARILLAS</TableCell>
                        <TableCell className="p-1"></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold p-1 border-r">T. ROJAS</TableCell>
                        <TableCell className="p-1"></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold p-1 border-r">OTROS</TableCell>
                        <TableCell className="p-1"></TableCell>
                    </TableRow>
                     <TableRow className="bg-gray-100 font-bold">
                        <TableCell className="p-1 border-r">TOTAL:</TableCell>
                        <TableCell className="p-1"></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
             <div className="p-1 border-t h-12">
                <span className="font-bold">FIRMA DE CAPITAN:</span>
            </div>
        </div>
    );


    return (
        <Card id="print-area" className="p-4 md:p-6 print:shadow-none print:border-none bg-white text-black">
            <CardContent className="p-0">
                 <header className="mb-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <Image src="https://placehold.co/100x100.png" alt="Logo Liga" width={70} height={70} data-ai-hint="league logo" />
                        <div className="text-center">
                            <h2 className="text-lg font-bold">LIGA DEPORTIVA BARRIAL "LA LUZ"</h2>
                            <p className="text-xs">FUNDADA EL 05 DE DICIEMBRE DE 1984</p>
                            <p className="text-xs">FILIAL DE LA UNIÓN DE LIGAS INDEPENDIENTES DEL CANTÓN QUITO</p>
                            <p className="text-xs">Entidad Jurídica Con Decreto Ministerial N°6581 Rof. N°358 Del 13 De Enero De 1994</p>
                        </div>
                        <Image src="https://placehold.co/100x100.png" alt="Logo Liga" width={70} height={70} data-ai-hint="league logo" />
                    </div>
                    <div className="text-center font-bold text-2xl border-y-2 border-black py-1">ACTA DE JUEGO</div>
                     <div className="flex justify-between items-center text-xs">
                        <span><strong>CATEGORIA:</strong> ______________________</span>
                        <span><strong>DÍA:</strong> ____________</span>
                        <span><strong>DE:</strong> ____________</span>
                        <span><strong>DEL:</strong> 20__</span>
                    </div>
                     <div className="flex justify-between items-center text-xs">
                        <span><strong>VOCAL:</strong> ______________________</span>
                         <span><strong>HORA:</strong> ____________</span>
                    </div>
                </header>

                <main className="grid grid-cols-2 gap-4">
                    {/* Team A */}
                    <div>
                         <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
                           <h3 className="font-bold uppercase text-sm">EQUIPO: ______________________</h3>
                           <div className="w-16 h-8 border-2 border-black bg-white"></div>
                        </div>
                        <Table className="border-collapse border border-gray-400">
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">N°</TableHead>
                                    <TableHead className="border text-center text-black p-1 text-xs">NOMBRES Y APELLIDOS</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">GOL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 15 }).map((_, index) => (
                                    <PlayerRow key={`A-${index}`} number={index + 1} />
                                ))}
                            </TableBody>
                        </Table>
                         <p className="text-center font-bold text-sm mt-2">CAMBIOS</p>
                        <Table className="border-collapse border border-gray-400 mt-1">
                             <TableBody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={`sub-A-${index}`} className="h-8"><TableCell className="border p-1"></TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="border mt-2 flex">
                            <CardCell label="T. Amarillas" count={6} />
                            <CardCell label="T. Rojas" count={3} />
                        </div>
                         <div className="mt-2 text-xs">
                            <p>VALORES PENDIENTES: ________________________________</p>
                        </div>
                         <IncomeBreakdown />
                    </div>

                    {/* Team B */}
                    <div>
                         <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
                           <h3 className="font-bold uppercase text-sm">EQUIPO: ______________________</h3>
                           <div className="w-16 h-8 border-2 border-black bg-white"></div>
                        </div>
                        <Table className="border-collapse border border-gray-400">
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">N°</TableHead>
                                    <TableHead className="border text-center text-black p-1 text-xs">NOMBRES Y APELLIDOS</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">GOL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                 {Array.from({ length: 15 }).map((_, index) => (
                                    <PlayerRow key={`B-${index}`} number={index + 1} />
                                ))}
                            </TableBody>
                        </Table>
                         <p className="text-center font-bold text-sm mt-2">CAMBIOS</p>
                        <Table className="border-collapse border border-gray-400 mt-1">
                            <TableBody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={`sub-B-${index}`} className="h-8"><TableCell className="border p-1"></TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="border mt-2 flex">
                             <CardCell label="T. Amarillas" count={6} />
                            <CardCell label="T. Rojas" count={3} />
                        </div>
                        <div className="mt-2 text-xs">
                            <p>VALORES PENDIENTES: ________________________________</p>
                        </div>
                        <IncomeBreakdown />
                    </div>
                </main>
            
                <footer className="space-y-4 mt-6">
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                             <Label className="font-bold text-sm">REPORTE DEL ÁRBITRO:</Label>
                            <Textarea rows={5} className="bg-white border-gray-400"/>
                        </div>
                         <div>
                            <Label className="font-bold text-sm">REPORTE DEL VOCAL:</Label>
                            <Textarea rows={5} className="bg-white border-gray-400"/>
                         </div>
                     </div>
                      <div className="grid grid-cols-3 gap-16 pt-16 text-center">
                        <div className="border-t-2 border-black w-64 mx-auto pt-2">
                            <p className="font-bold">FIRMA DIRIGENTE EQUIPO A</p>
                        </div>
                        <div className="border-t-2 border-black w-64 mx-auto pt-2">
                            <p className="font-bold">FIRMA DIRIGENTE EQUIPO B</p>
                        </div>
                         <div className="border-t-2 border-black w-64 mx-auto pt-2">
                            <p className="font-bold">FIRMA DEL VOCAL</p>
                        </div>
                    </div>
                </footer>
            </CardContent>
        </Card>
    )
}

const DigitalMatchSheet = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const canEdit = user.role === 'admin' || user.role === 'secretary';

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState('');
    const [searchResults, setSearchResults] = useState<Player[]>([]);
    const [events, setEvents] = useState<MatchEvent[]>([]);
    const [matchState, setMatchState] = useState<Match>(initialMatchData);

    const categories = useMemo(() => [...new Set(teams.map((t) => t.category))], []);
    const filteredTeams = useMemo(() => {
        if (!selectedCategory) return [];
        return teams.filter((team) => team.category === selectedCategory);
    }, [selectedCategory]);

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value as Category);
        setSelectedTeamId(null);
        setPlayerNumber('');
        setSearchResults([]);
    };

    const handleTeamChange = (value: string) => {
        setSelectedTeamId(value);
        setPlayerNumber('');
        setSearchResults([]);
    };

    const handleSearch = () => {
        if (!selectedTeamId || !playerNumber) {
            toast({ title: "Información incompleta", description: "Por favor, selecciona equipo y número de camiseta.", variant: "destructive" });
            return;
        }
        const results = players.filter(p => 
            p.teamId === selectedTeamId &&
            p.id.slice(-2) === playerNumber.padStart(2, '0') // Assuming player number is last 2 digits of ID
        );

        if (results.length === 0) {
            toast({ title: "No encontrado", description: "No se encontró ningún jugador con ese número en el equipo seleccionado.", variant: "destructive" });
        }
        setSearchResults(results);
    };

    const addEvent = (player: Player, eventType: MatchEventType) => {
        const newEvent: MatchEvent = {
            id: `evt-${Date.now()}`,
            playerId: player.id,
            playerName: player.name,
            teamName: player.team,
            event: eventType,
        };
        setEvents(prevEvents => [newEvent, ...prevEvents]);

        const statsUpdate = {
            goals: eventType === 'goal' ? 1 : 0,
            yellowCards: eventType === 'yellow_card' ? 1 : 0,
            redCards: eventType === 'red_card' ? 1 : 0,
        };
        updatePlayerStats(player.id, statsUpdate);
        
        let toastMessage = '';
        if (eventType === 'goal') toastMessage = `Gol registrado para ${player.name}!`;
        if (eventType === 'yellow_card') toastMessage = `Tarjeta amarilla para ${player.name}.`;
        if (eventType === 'red_card') {
            toastMessage = `Tarjeta ROJA para ${player.name}. ¡Será suspendido!`;
            addSanction({
                id: `sanc-${Date.now()}`,
                playerId: player.id,
                playerName: player.name,
                playerPhotoUrl: player.photoUrl,
                teamName: player.team,
                teamId: player.teamId,
                reason: 'Tarjeta Roja Directa',
                gamesSuspended: 1,
                date: new Date().toISOString().split('T')[0],
            });
        }
        
        toast({
            title: "Evento Registrado",
            description: toastMessage,
        });

        setSearchResults([]);
    };
    
    const removeEvent = (eventId: string) => {
        const eventToRemove = events.find(e => e.id === eventId);
        if (!eventToRemove) return;

        const statsUpdate = {
            goals: eventToRemove.event === 'goal' ? -1 : 0,
            yellowCards: eventToRemove.event === 'yellow_card' ? -1 : 0,
            redCards: eventToRemove.event === 'red_card' ? -1 : 0,
        };
        updatePlayerStats(eventToRemove.playerId, statsUpdate);

        setEvents(events.filter((e) => e.id !== eventId));
        
        toast({
            title: "Evento Eliminado",
            description: `Se ha revertido el evento para ${eventToRemove.playerName}.`,
            variant: "destructive",
        });
    };

    const getEventBadge = (event: MatchEventType) => {
        switch(event) {
            case 'goal': return <Badge variant="default">GOL</Badge>;
            case 'yellow_card': return <Badge variant="secondary" className="bg-yellow-400 text-black">T.A.</Badge>;
            case 'red_card': return <Badge variant="destructive">T.R.</Badge>;
        }
    }

    const handleVocalPaymentChange = (teamKey: 'teamA' | 'teamB', field: keyof VocalPaymentDetailsType, value: string | number) => {
        setMatchState(prev => {
            const currentPayment = prev[teamKey].vocalPaymentDetails;
            const updatedPayment = { ...currentPayment, [field]: value };
            
            const total = 
                (typeof updatedPayment.referee === 'number' ? updatedPayment.referee : 0) + 
                (typeof updatedPayment.fee === 'number' ? updatedPayment.fee : 0) + 
                (typeof updatedPayment.yellowCardFine === 'number' ? updatedPayment.yellowCardFine : 0) + 
                (typeof updatedPayment.redCardFine === 'number' ? updatedPayment.redCardFine : 0) + 
                (typeof updatedPayment.otherFines === 'number' ? updatedPayment.otherFines : 0);

            return {
                ...prev,
                [teamKey]: {
                    ...prev[teamKey],
                    vocalPaymentDetails: { ...updatedPayment, total }
                }
            }
        });
    }

    const VocalPaymentDetailsInputs = ({ teamKey }: { teamKey: 'teamA' | 'teamB' }) => {
        const details = matchState[teamKey].vocalPaymentDetails;
        const disabled = !canEdit || !matchState[teamKey].attended;

        const handlePaymentStatusChange = (checked: boolean) => {
             setMatchState(prev => ({
                ...prev,
                [teamKey]: {
                    ...prev[teamKey],
                    vocalPaymentDetails: {
                        ...prev[teamKey].vocalPaymentDetails,
                        paymentStatus: checked ? 'paid' : 'pending'
                    }
                }
            }));
        }

        return (
            <div className="space-y-2 mt-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-center">Desglose de Vocalía</h5>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor={`payment-status-${teamKey}`} className={details.paymentStatus === 'pending' ? 'text-destructive' : 'text-primary'}>
                            {details.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                        </Label>
                        <Switch
                            id={`payment-status-${teamKey}`}
                            checked={details.paymentStatus === 'paid'}
                            onCheckedChange={handlePaymentStatusChange}
                            disabled={disabled}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <Label>Pago Árbitro:</Label>
                    <Input type="number" value={details.referee} onChange={(e) => handleVocalPaymentChange(teamKey, 'referee', parseFloat(e.target.value) || 0)} placeholder="0.00" disabled={disabled} className="h-8" />
                    
                    <Label>Cuota:</Label>
                    <Input type="number" value={details.fee} onChange={(e) => handleVocalPaymentChange(teamKey, 'fee', parseFloat(e.target.value) || 0)} placeholder="0.00" disabled={disabled} className="h-8" />
                    
                    <Label>Tarjetas Amarillas:</Label>
                    <Input type="number" value={details.yellowCardFine} onChange={(e) => handleVocalPaymentChange(teamKey, 'yellowCardFine', parseFloat(e.target.value) || 0)} placeholder="0.00" disabled={disabled} className="h-8" />

                    <Label>Tarjetas Rojas:</Label>
                    <Input type="number" value={details.redCardFine} onChange={(e) => handleVocalPaymentChange(teamKey, 'redCardFine', parseFloat(e.target.value) || 0)} placeholder="0.00" disabled={disabled} className="h-8" />

                    <Label className="col-span-2">Multas (especificar):</Label>
                    <Textarea value={details.otherFinesDescription} onChange={(e) => handleVocalPaymentChange(teamKey, 'otherFinesDescription', e.target.value)} placeholder="Descripción de la multa" disabled={disabled} className="col-span-2 h-16" />
                    <div/>
                    <Input type="number" value={details.otherFines} onChange={(e) => handleVocalPaymentChange(teamKey, 'otherFines', parseFloat(e.target.value) || 0)} placeholder="0.00" disabled={disabled} className="h-8" />

                    <Label className="font-bold text-base">TOTAL VOCALÍA:</Label>
                    <p className="font-bold text-base text-right pr-2">${details.total.toFixed(2)}</p>
                </div>
            </div>
        )
    };
    
    return (
        <Card className="p-6 md:p-8">
            <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Event entry */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Registro de Eventos</h3>
                    
                    <div>
                         <Label>Evidencia de Vocalía Física</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input type="file" className="flex-grow" disabled={!canEdit} />
                            <Button variant="outline" disabled={!canEdit}><Upload className="mr-2" /> Subir</Button>
                        </div>
                    </div>
                    
                    <div>
                        <Label>Buscar Jugador</Label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-1">
                            <Select onValueChange={handleCategoryChange} disabled={!canEdit}>
                                <SelectTrigger className="md:col-span-2">
                                    <SelectValue placeholder="1. Elige Categoría..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={handleTeamChange} value={selectedTeamId || ''} disabled={!selectedCategory || !canEdit}>
                                <SelectTrigger className="md:col-span-2">
                                    <SelectValue placeholder="2. Elige Equipo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredTeams.map((team) => (
                                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                id="player-number" 
                                placeholder="3. No. Camiseta" 
                                value={playerNumber}
                                onChange={(e) => setPlayerNumber(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                disabled={!selectedTeamId || !canEdit}
                                className="md:col-span-3"
                                type="number"
                            />
                            <Button onClick={handleSearch} disabled={!selectedTeamId || !playerNumber || !canEdit}><Search className="mr-2" /> Buscar</Button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <Card className="p-4">
                            <h4 className="font-semibold mb-2">Resultados de Búsqueda</h4>
                            <div className="space-y-2">
                                {searchResults.map(player => (
                                    <div key={player.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                        <div>
                                            <p className="font-bold">{player.name}</p>
                                            <p className="text-sm text-muted-foreground">{player.team} | ID: {player.id}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="sm" onClick={() => addEvent(player, 'goal')} disabled={!canEdit}>Gol</Button>
                                            <Button size="sm" variant="secondary" className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => addEvent(player, 'yellow_card')} disabled={!canEdit}>T.A.</Button>
                                            <Button size="sm" variant="destructive" onClick={() => addEvent(player, 'red_card')} disabled={!canEdit}>T.R.</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right side: Summary */}
                <div className="space-y-4">
                     <h3 className="text-xl font-bold">Resumen del Partido</h3>
                     <div className="grid grid-cols-2 gap-4 items-start">
                        <div className="text-center space-y-2">
                            <Image src={matchState.teamA.logoUrl} alt={matchState.teamA.name} width={60} height={60} className="mx-auto rounded-full" data-ai-hint="team logo" />
                            <h4 className="font-bold">{matchState.teamA.name}</h4>
                            <Input type="number" className="w-24 mx-auto text-center text-2xl font-bold" value={matchState.teamA.score} onChange={(e) => setMatchState({...matchState, teamA: {...matchState.teamA, score: parseInt(e.target.value) || 0}})} disabled={!canEdit} />
                             <div className="space-y-2 pt-2">
                               <div className="flex items-center justify-center gap-2">
                                 <Switch id="teamA-attended" checked={matchState.teamA.attended} onCheckedChange={(checked) => setMatchState({...matchState, teamA: {...matchState.teamA, attended: checked}})} disabled={!canEdit}/>
                                 <Label htmlFor="teamA-attended">Se Presentó</Label>
                               </div>
                               <VocalPaymentDetailsInputs teamKey="teamA" />
                           </div>
                        </div>
                         <div className="text-center space-y-2">
                             <Image src={matchState.teamB.logoUrl} alt={matchState.teamB.name} width={60} height={60} className="mx-auto rounded-full" data-ai-hint="team logo" />
                            <h4 className="font-bold">{matchState.teamB.name}</h4>
                            <Input type="number" className="w-24 mx-auto text-center text-2xl font-bold" value={matchState.teamB.score} onChange={(e) => setMatchState({...matchState, teamB: {...matchState.teamB, score: parseInt(e.target.value) || 0}})} disabled={!canEdit} />
                             <div className="space-y-2 pt-2">
                               <div className="flex items-center justify-center gap-2">
                                 <Switch id="teamB-attended" checked={matchState.teamB.attended} onCheckedChange={(checked) => setMatchState({...matchState, teamB: {...matchState.teamB, attended: checked}})} disabled={!canEdit}/>
                                 <Label htmlFor="teamB-attended">Se Presentó</Label>
                               </div>
                               <VocalPaymentDetailsInputs teamKey="teamB" />
                           </div>
                        </div>
                     </div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Eventos Registrados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {events.length === 0 ? (
                                <p className="text-muted-foreground">Aún no se han registrado eventos.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Jugador</TableHead>
                                            <TableHead>Equipo</TableHead>
                                            <TableHead>Evento</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{event.playerName}</TableCell>
                                                <TableCell>{event.teamName}</TableCell>
                                                <TableCell>{getEventBadge(event.event)}</TableCell>
                                                <TableCell className="text-right">
                                                    {canEdit && (
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeEvent(event.id)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                     </Card>
                      <Button className="w-full" size="lg" disabled={!canEdit}>Guardar Resultado del Partido</Button>
                </div>

            </CardContent>
        </Card>
    );
};


export default function CommitteesPage() {
  const [activeTab, setActiveTab] = useState('digital');
  const { user } = useAuth();
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Hoja de Vocalía
        </h2>
        <div className="flex items-center gap-4">
             <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="digital">
                <TabsList>
                    <TabsTrigger value="digital">Vocalía Digital (Registrar)</TabsTrigger>
                    <TabsTrigger value="physical">Vocalía Física (Imprimir)</TabsTrigger>
                </TabsList>
            </Tabs>
            {activeTab === 'physical' && (
                <Button onClick={handlePrint} id="print-button">
                    <Printer className="mr-2" />
                    Imprimir Vocalía
                </Button>
            )}
        </div>
      </div>

       <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="digital" className="space-y-4">
          <TabsContent value="physical" className="mt-0">
            <PhysicalMatchSheet />
          </TabsContent>
          <TabsContent value="digital" className="mt-0">
             <DigitalMatchSheet />
          </TabsContent>
        </Tabs>

        {/* This is a hidden element that will only be visible for printing the physical sheet */}
        <div className="hidden print:block">
            <PhysicalMatchSheet />
        </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
              display: none !important;
          }
           .print\\:block {
              display: block !important;
           }
           .print\\:shadow-none {
              box-shadow: none !important;
           }
           .print\\:border-none {
              border: none !important;
          }
          .flex-1.space-y-4 {
            padding: 0;
          }
          #print-area {
            box-shadow: none !important;
            border: none !important;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 1cm;
          }
        }
         @page {
            size: A4 portrait;
            margin: 0;
        }
      `}</style>
    </div>
  );
}
