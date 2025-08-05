
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { Printer, Upload, Search, Trash2, DollarSign, AlertTriangle, User, ImageDown } from 'lucide-react';
import Image from 'next/image';
import { players as allPlayersData, teams, type Player, updatePlayerStats, addSanction, type Category, type Match, type VocalPaymentDetails as VocalPaymentDetailsType, getPlayersByTeamId, updateMatchData, setMatchAsFinished, getMatchesByTeamId, getSanctions as getAllSanctions, getMatches } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { MatchEvent, MatchEventType } from '@/lib/types';
import { isToday, isFuture, isPast } from 'date-fns';
import { cn } from '@/lib/utils';


const PhysicalMatchSheet = ({ match }: { match: Match | null }) => {

    const teamA = useMemo(() => match?.teams.home, [match]);
    const teamB = useMemo(() => match?.teams.away, [match]);
    const [playersA, setPlayersA] = useState<Player[]>([]);
    const [playersB, setPlayersB] = useState<Player[]>([]);

    useEffect(() => {
        if (teamA) {
            getPlayersByTeamId(teamA.id).then(setPlayersA);
        } else {
            setPlayersA([]);
        }
        if (teamB) {
            getPlayersByTeamId(teamB.id).then(setPlayersB);
        } else {
            setPlayersB([]);
        }
    }, [teamA, teamB]);

    const usePendingValue = (teamId?: string) => {
        const [value, setValue] = useState(0);
         useEffect(() => {
            if (!teamId || !match) {
                setValue(0);
                return;
            };

            getMatchesByTeamId(teamId).then(matches => {
                const pastMatches = matches.filter(m => m.id !== match.id && isPast(new Date(m.date)));
                const total = pastMatches.reduce((total, pastMatch) => {
                    const isHome = pastMatch.teams.home.id === teamId;
                    const teamDetails = isHome ? pastMatch.teams.home : pastMatch.teams.away;
                    if (teamDetails.vocalPaymentDetails?.paymentStatus === 'pending') {
                        return total + (teamDetails.vocalPaymentDetails.total || 0);
                    }
                    return total;
                }, 0);
                setValue(total);
            });
        }, [teamId, match]);
        return value;
    }

    const pendingValueA = usePendingValue(teamA?.id);
    const pendingValueB = usePendingValue(teamB?.id);
    
    const PlayerRow = ({ player, number }: { player?: Player, number: number }) => {
        const getAge = (birthDateString: string) => {
            const birthDate = new Date(birthDateString);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        const isJuvenil = player ? getAge(player.birthDate) < 19 : false;
        const [isSanctioned, setIsSanctioned] = useState(false);

        useEffect(() => {
            if(player) {
                getAllSanctions().then(s => {
                    setIsSanctioned(s.some(sanc => sanc.playerId === player.id));
                });
            } else {
                setIsSanctioned(false);
            }
        }, [player]);


        const rowClass = cn(
            "h-8",
            isJuvenil && "bg-green-100",
            isSanctioned && "bg-red-200/80 text-red-900 line-through"
        );

        return (
            <TableRow className={rowClass}>
                <TableCell className="border text-center p-1 w-[20px]"><Checkbox disabled={isSanctioned} /></TableCell>
                <TableCell className="border text-center p-1 w-[40px] text-xs font-medium">{player?.jerseyNumber}</TableCell>
                <TableCell className="border p-1 text-left w-[200px] text-xs">
                    {player?.name || ''}
                    {isJuvenil && <span className="font-bold text-green-700 ml-2">JUVENIL</span>}
                    {isSanctioned && <span className="font-bold text-red-700 ml-2">SANCIONADO</span>}
                </TableCell>
                <TableCell className="border text-center p-1 w-[40px]"></TableCell>
            </TableRow>
        );
    };

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
                        <TableCell className="p-1"></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold p-1 border-r">CUOTAS</TableCell>
                        <TableCell className="p-1"></TableCell>
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
                        <span><strong>CATEGORIA:</strong> {match?.category || '______________________'}</span>
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
                           <h3 className="font-bold uppercase text-sm truncate max-w-[250px]">EQUIPO: {teamA?.name || '______________________'}</h3>
                           <div className="w-16 h-8 border-2 border-black bg-white"></div>
                        </div>
                        <Table className="border-collapse border border-gray-400">
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[20px] border text-center text-black p-1 text-xs"></TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">N°</TableHead>
                                    <TableHead className="border text-center text-black p-1 text-xs">NOMBRES Y APELLIDOS</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">GOL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 18 }).map((_, index) => (
                                    <PlayerRow key={`A-${index}`} player={playersA[index]} number={index + 1} />
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
                            <p className="font-bold">VALORES PENDIENTES: <span className="font-normal">${pendingValueA.toFixed(2)}</span></p>
                        </div>
                         <IncomeBreakdown />
                    </div>

                    {/* Team B */}
                    <div>
                         <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
                           <h3 className="font-bold uppercase text-sm truncate max-w-[250px]">EQUIPO: {teamB?.name || '______________________'}</h3>
                           <div className="w-16 h-8 border-2 border-black bg-white"></div>
                        </div>
                        <Table className="border-collapse border border-gray-400">
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[20px] border text-center text-black p-1 text-xs"></TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">N°</TableHead>
                                    <TableHead className="border text-center text-black p-1 text-xs">NOMBRES Y APELLIDOS</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">GOL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                 {Array.from({ length: 18 }).map((_, index) => (
                                    <PlayerRow key={`B-${index}`} player={playersB[index]} number={index + 1} />
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
                            <p className="font-bold">VALORES PENDIENTES: <span className="font-normal">${pendingValueB.toFixed(2)}</span></p>
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

const DigitalMatchSheet = ({ match, onUpdateMatch, onFinishMatch }: { match: Match | null, onUpdateMatch: (updatedMatch: Match) => void, onFinishMatch: (matchId: string) => void }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const canEdit = user.permissions.committees.edit;

    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState('');
    const [searchResults, setSearchResults] = useState<Player[]>([]);
    const [physicalSheetUrl, setPhysicalSheetUrl] = useState<string | null>(match?.physicalSheetUrl || null);
    
    const [events, setEvents] = useState<MatchEvent[]>(match?.events || []);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    
    useEffect(() => {
        setAllPlayers(allPlayersData);
    }, []);

    useEffect(() => {
        setEvents(match?.events || []);
        setPhysicalSheetUrl(match?.physicalSheetUrl || null);
    }, [match]);

    const teamForEventSearch = match?.teams.home.id === selectedTeamId ? match.teams.home : match?.teams.away;

    const handleSearch = () => {
        if (!selectedTeamId || !playerNumber) {
            toast({ title: "Información incompleta", description: "Por favor, selecciona equipo y número de camiseta.", variant: "destructive" });
            return;
        }
        const results = allPlayers.filter(p => 
            p.teamId === selectedTeamId &&
            p.jerseyNumber.toString() === playerNumber
        );

        if (results.length === 0) {
            toast({ title: "No encontrado", description: "No se encontró ningún jugador con ese número en el equipo seleccionado.", variant: "destructive" });
        }
        setSearchResults(results);
    };

    const addEvent = (player: Player, eventType: MatchEventType) => {
        if (!match) return;
        const newEvent: MatchEvent = {
            id: `evt-${Date.now()}`,
            playerId: player.id,
            playerName: player.name,
            teamName: player.team,
            event: eventType,
        };
        const updatedEvents = [newEvent, ...events];
        setEvents(updatedEvents);

        onUpdateMatch({ ...match, events: updatedEvents });

        const statsUpdate = {
            goals: eventType === 'goal' ? 1 : 0,
            assists: eventType === 'assist' ? 1 : 0,
            yellowCards: eventType === 'yellow_card' ? 1 : 0,
            redCards: eventType === 'red_card' ? 1 : 0,
        };
        updatePlayerStats(player.id, statsUpdate);
        
        let toastMessage = '';
        if (eventType === 'goal') toastMessage = `Gol registrado para ${player.name}!`;
        if (eventType === 'assist') toastMessage = `Asistencia registrada para ${player.name}.`;
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
        if(!match) return;

        const eventToRemove = events.find(e => e.id === eventId);
        if (!eventToRemove) return;

        const statsUpdate = {
            goals: eventToRemove.event === 'goal' ? -1 : 0,
            assists: eventToRemove.event === 'assist' ? -1 : 0,
            yellowCards: eventToRemove.event === 'yellow_card' ? -1 : 0,
            redCards: eventToRemove.event === 'red_card' ? -1 : 0,
        };
        updatePlayerStats(eventToRemove.playerId, statsUpdate);
        
        const updatedEvents = events.filter((e) => e.id !== eventId);
        setEvents(updatedEvents);
        onUpdateMatch({ ...match, events: updatedEvents });

        toast({
            title: "Evento Eliminado",
            description: `Se ha revertido el evento para ${eventToRemove.playerName}.`,
            variant: "destructive",
        });
    };

    const getEventBadge = (event: MatchEventType) => {
        switch(event) {
            case 'goal': return <Badge variant="default">GOL</Badge>;
            case 'assist': return <Badge variant="secondary">ASISTENCIA</Badge>;
            case 'yellow_card': return <Badge variant="secondary" className="bg-yellow-400 text-black">T.A.</Badge>;
            case 'red_card': return <Badge variant="destructive">T.R.</Badge>;
        }
    }

    const handleMatchDataChange = (field: keyof Match, value: any) => {
        if(!match) return;
        const updatedMatch = { ...match, [field]: value };
        onUpdateMatch(updatedMatch);
    }
    
    const handleScoreChange = (teamKey: 'home' | 'away', newScore: number) => {
        if(!match || !match.score) return;
        const updatedMatch = {
            ...match,
            score: {
                ...match.score,
                [teamKey]: newScore
            }
        };
        onUpdateMatch(updatedMatch);
    }
    
    const handleVocalPaymentChange = (teamKey: 'home' | 'away', field: keyof VocalPaymentDetailsType, value: string | number | boolean) => {
        if (!match) return;
        
        const teamDetails = match.teams[teamKey];
        if (!teamDetails.vocalPaymentDetails) return;
        
        const currentPayment = teamDetails.vocalPaymentDetails;
        const updatedPayment = { ...currentPayment, [field]: value };
        
        if (field !== 'paymentStatus' && field !== 'otherFinesDescription') {
            const total = 
                (Number(updatedPayment.referee) || 0) + 
                (Number(updatedPayment.fee) || 0) + 
                (Number(updatedPayment.yellowCardFine) || 0) + 
                (Number(updatedPayment.redCardFine) || 0) + 
                (Number(updatedPayment.otherFines) || 0);
            updatedPayment.total = total;
        }
        
        const updatedTeamDetails = {
            ...teamDetails,
            vocalPaymentDetails: updatedPayment
        };

        const updatedMatch = {
            ...match,
            teams: {
                ...match.teams,
                [teamKey]: updatedTeamDetails
            }
        };
        onUpdateMatch(updatedMatch);
    }
    
    const handleSaveResult = () => {
        if (!match) return;
        onFinishMatch(match.id);
        toast({ title: "Partido Finalizado", description: "El resultado ha sido guardado y el partido marcado como finalizado."});
    }

     const handlePhysicalSheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && match) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPhysicalSheetUrl(result);
                onUpdateMatch({ ...match, physicalSheetUrl: result });
                toast({ title: "Acta Física Subida", description: "La imagen ha sido guardada con el partido."});
            };
            reader.readAsDataURL(file);
        }
    };


    const VocalPaymentDetailsInputs = ({ teamKey }: { teamKey: 'home' | 'away' }) => {
        if (!match) return null;
        const details = match.teams[teamKey].vocalPaymentDetails;
        if (!details) return null;

        const teamId = match.teams[teamKey].id;
        const [pendingValue, setPendingValue] = useState(0);

        useEffect(() => {
            getMatchesByTeamId(teamId).then(matches => {
                const pastMatches = matches.filter(m => m.id !== match.id && isPast(new Date(m.date)));
                const totalPending = pastMatches.reduce((total, pastMatch) => {
                    const isHome = pastMatch.teams.home.id === teamId;
                    const teamDetails = isHome ? pastMatch.teams.home : pastMatch.teams.away;
                    if (teamDetails.vocalPaymentDetails?.paymentStatus === 'pending') {
                        return total + (teamDetails.vocalPaymentDetails.total || 0);
                    }
                    return total;
                }, 0);
                setPendingValue(totalPending);
            });
        }, [match.id, teamId]);
        
        const disabled = !canEdit || !match.teams[teamKey].attended;

        const handlePaymentStatusChange = (checked: boolean) => {
             handleVocalPaymentChange(teamKey, 'paymentStatus', checked ? 'paid' : 'pending');
        }

        return (
            <div className="space-y-2 mt-2 p-3 border rounded-lg">
                {pendingValue > 0 && (
                     <div className="p-2 rounded-md bg-destructive/10 border border-destructive text-destructive">
                         <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            <h5 className="font-semibold">Valores Pendientes</h5>
                         </div>
                        <p className="text-sm">Este equipo tiene una deuda de <span className="font-bold">${pendingValue.toFixed(2)}</span> de partidos anteriores.</p>
                     </div>
                )}
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
    
    if (!match) {
        return (
            <Card className="p-6 md:p-8 flex items-center justify-center h-full">
                <p className="text-muted-foreground text-lg">Por favor, selecciona un partido para registrar la vocalía.</p>
            </Card>
        )
    }

    return (
        <Card className="p-6 md:p-8">
            <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Event entry */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Registro de Eventos y Datos</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <Label>Nombre del Árbitro (Opcional)</Label>
                             <Input 
                                placeholder="Ej: Juan Pérez"
                                value={match.refereeName || ''}
                                onChange={(e) => handleMatchDataChange('refereeName', e.target.value)}
                                disabled={!canEdit}
                            />
                         </div>
                          <div>
                             <Label>Vocal de Turno</Label>
                             <Input 
                                placeholder="Ej: Carlos Rivas"
                                value={match.vocalName || ''}
                                onChange={(e) => handleMatchDataChange('vocalName', e.target.value)}
                                disabled={!canEdit}
                            />
                         </div>
                    </div>
                     <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Evidencia de Vocalía Física</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {physicalSheetUrl ? (
                                <div className="space-y-2">
                                    <Image src={physicalSheetUrl} alt="Acta física" width={150} height={200} className="rounded-md border object-contain" />
                                    <p className="text-sm text-muted-foreground">Imagen del acta física guardada.</p>
                                </div>
                            ) : (
                                <div>
                                    <Label htmlFor="physical-sheet-upload" className="w-full">
                                        <Button asChild variant="outline">
                                            <div>
                                                <Upload className="mr-2" /> Subir Acta Física
                                            </div>
                                        </Button>
                                    </Label>
                                    <Input id="physical-sheet-upload" type="file" className="sr-only" onChange={handlePhysicalSheetUpload} accept="image/*" />
                                    <p className="text-xs text-muted-foreground mt-2">Sube una foto del acta física como evidencia.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    
                    <div>
                        <Label>Buscar Jugador para Evento</Label>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-1">
                             <Select onValueChange={setSelectedTeamId} value={selectedTeamId || ''} disabled={!canEdit}>
                                <SelectTrigger className="md:col-span-2">
                                    <SelectValue placeholder="1. Elige Equipo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={match.teams.home.id}>{match.teams.home.name}</SelectItem>
                                    <SelectItem value={match.teams.away.id}>{match.teams.away.name}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input 
                                id="player-number" 
                                placeholder="2. No. Camiseta" 
                                value={playerNumber}
                                onChange={(e) => setPlayerNumber(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                disabled={!selectedTeamId || !canEdit}
                                className="md:col-span-1"
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
                                            <Button size="sm" onClick={() => addEvent(player, 'assist')} disabled={!canEdit} variant="outline">Asistencia</Button>
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
                            <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={60} height={60} className="mx-auto rounded-full" data-ai-hint="team logo" />
                            <h4 className="font-bold">{match.teams.home.name}</h4>
                            <Input type="number" className="w-24 mx-auto text-center text-2xl font-bold" value={match.score?.home ?? 0} onChange={(e) => handleScoreChange('home', parseInt(e.target.value) || 0)} disabled={!canEdit} />
                             <div className="space-y-2 pt-2">
                               <div className="flex items-center justify-center gap-2">
                                 <Switch id="teamA-attended" checked={match.teams.home.attended} onCheckedChange={(checked) => onUpdateMatch({...match, teams: {...match.teams, home: {...match.teams.home, attended: checked}}})} disabled={!canEdit}/>
                                 <Label htmlFor="teamA-attended">Se Presentó</Label>
                               </div>
                               <VocalPaymentDetailsInputs teamKey="home" />
                           </div>
                        </div>
                         <div className="text-center space-y-2">
                             <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={60} height={60} className="mx-auto rounded-full" data-ai-hint="team logo" />
                            <h4 className="font-bold">{match.teams.away.name}</h4>
                            <Input type="number" className="w-24 mx-auto text-center text-2xl font-bold" value={match.score?.away ?? 0} onChange={(e) => handleScoreChange('away', parseInt(e.target.value) || 0)} disabled={!canEdit} />
                             <div className="space-y-2 pt-2">
                               <div className="flex items-center justify-center gap-2">
                                 <Switch id="teamB-attended" checked={match.teams.away.attended} onCheckedChange={(checked) => onUpdateMatch({...match, teams: {...match.teams, away: {...match.teams.away, attended: checked}}})} disabled={!canEdit}/>
                                 <Label htmlFor="teamB-attended">Se Presentó</Label>
                               </div>
                               <VocalPaymentDetailsInputs teamKey="away" />
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
                      <Button className="w-full" size="lg" disabled={!canEdit || match.status === 'finished'} onClick={handleSaveResult}>
                        {match.status === 'finished' ? 'Partido Finalizado' : 'Guardar y Finalizar Partido'}
                      </Button>
                </div>

            </CardContent>
        </Card>
    );
};


export default function CommitteesPage() {
  const [activeTab, setActiveTab] = useState('digital');
  const [isClient, setIsClient] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  useEffect(() => {
    getMatches().then(setAllMatches);
  }, []);

  const { user } = useAuth();
  const handlePrint = () => {
    window.print();
  };
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUpdateMatch = useCallback((updatedMatch: Match) => {
    updateMatchData(updatedMatch);
    // Force re-render of component by briefly unsetting and resetting the ID
    setSelectedMatchId(null);
    setTimeout(() => setSelectedMatchId(updatedMatch.id), 0);
  }, []);
  
  const handleFinishMatch = useCallback((matchId: string) => {
    setMatchAsFinished(matchId);
     // Force re-render of component by briefly unsetting and resetting the ID
    setSelectedMatchId(null);
    setTimeout(() => setSelectedMatchId(matchId), 0);
  }, []);

  const selectedMatch = useMemo(() => {
    if (!selectedMatchId) return null;
    return allMatches.find(m => m.id === selectedMatchId) || null;
  }, [selectedMatchId, allMatches]);

  const groupedMatches = useMemo(() => {
    if (!isClient) return { today: [], future: [], past: [] };

    const todayMatches = allMatches.filter(m => isToday(new Date(m.date)));
    const futureMatches = allMatches.filter(m => isFuture(new Date(m.date)) && !isToday(new Date(m.date)));
    const pastMatches = allMatches.filter(m => isPast(new Date(m.date)) && !isToday(new Date(m.date)));

    return {
        today: todayMatches,
        future: futureMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        past: pastMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  }, [isClient, allMatches]);

  const MatchSelect = () => (
     <Select onValueChange={setSelectedMatchId} value={selectedMatchId || ''}>
        <SelectTrigger>
            <SelectValue placeholder="Elige un partido del calendario..."/>
        </SelectTrigger>
        <SelectContent>
            {isClient && (
                <>
                    {groupedMatches.today.length > 0 && (
                        <SelectGroup>
                            <SelectLabel>Partidos de Hoy</SelectLabel>
                            {groupedMatches.today.map(match => (
                                <SelectItem key={match.id} value={match.id}>
                                    {match.teams.home.name} vs {match.teams.away.name} ({new Date(match.date).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})})
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                     {groupedMatches.future.length > 0 && (
                        <SelectGroup>
                            <SelectLabel>Partidos Futuros</SelectLabel>
                            {groupedMatches.future.map(match => (
                                <SelectItem key={match.id} value={match.id}>
                                    {match.teams.home.name} vs {match.teams.away.name} ({new Date(match.date).toLocaleDateString()})
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                     {groupedMatches.past.length > 0 && (
                        <SelectGroup>
                            <SelectLabel>Partidos Pasados</SelectLabel>
                            {groupedMatches.past.map(match => (
                                <SelectItem key={match.id} value={match.id}>
                                    {match.teams.home.name} vs {match.teams.away.name} ({new Date(match.date).toLocaleDateString()})
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                </>
            )}
        </SelectContent>
    </Select>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between print:hidden">
        <div className="text-center w-full">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                Hoja de Vocalía
              </span>
            </h2>
        </div>
        <div className="flex items-center gap-4">
             <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="digital">
                <TabsList>
                    <TabsTrigger value="digital">Vocalía Digital (Registrar)</TabsTrigger>
                    <TabsTrigger value="physical">Vocalía Física (Imprimir)</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </div>

       <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setSelectedMatchId(null); }} defaultValue="digital" className="space-y-4">
          <TabsContent value="physical" className="mt-0 space-y-4">
            <Card className="print:hidden">
                <CardHeader>
                    <CardTitle>Generar Hoja de Vocalía Física</CardTitle>
                    <CardContent className="p-0 pt-4 flex gap-4 items-end">
                        <div className="flex-grow">
                             <Label>Seleccionar Partido</Label>
                             <MatchSelect />
                        </div>
                        <Button onClick={handlePrint} disabled={!selectedMatch}>
                            <Printer className="mr-2" />
                            Imprimir Vocalía
                        </Button>
                    </CardContent>
                </CardHeader>
            </Card>
            <div className="hidden print:block">
                 <PhysicalMatchSheet match={selectedMatch}/>
            </div>
             <div className="print:hidden">
                 <PhysicalMatchSheet match={selectedMatch}/>
            </div>
          </TabsContent>
          <TabsContent value="digital" className="mt-0 space-y-4">
            <Card className="print:hidden">
                 <CardHeader>
                    <CardTitle>Seleccionar Partido para Vocalía Digital</CardTitle>
                     <CardContent className="p-0 pt-4">
                          <MatchSelect />
                     </CardContent>
                 </CardHeader>
            </Card>
             <DigitalMatchSheet match={selectedMatch} onUpdateMatch={handleUpdateMatch} onFinishMatch={handleFinishMatch} />
          </TabsContent>
        </Tabs>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
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
            margin: 0;
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
