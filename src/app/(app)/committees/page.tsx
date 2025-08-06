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
import { Printer, Upload, Search, Trash2, DollarSign, AlertTriangle, User, ImageDown, History } from 'lucide-react';
import Image from 'next/image';
import { getPlayers, teams as allTeamsData, type Player, updatePlayerStats, addSanction, type Category, type Match, type VocalPaymentDetails as VocalPaymentDetailsType, getPlayersByTeamId, updateMatchData, setMatchAsFinished, getSanctions, getMatches, getMatchById, getSanctionSettings, type SanctionSettings } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { MatchEvent, MatchEventType, MatchTeam } from '@/lib/types';
import { isToday, isFuture, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const PhysicalMatchSheet = ({ match }: { match: Match | null }) => {

    const [teamA, setTeamA] = useState<MatchTeam | null>(null);
    const [teamB, setTeamB] = useState<MatchTeam | null>(null);
    const [playersA, setPlayersA] = useState<Player[]>([]);
    const [playersB, setPlayersB] = useState<Player[]>([]);
    const [allMatches, setAllMatches] = useState<Match[]>([]);

    useEffect(() => {
        getMatches().then(setAllMatches);
    }, []);

    useEffect(() => {
        if (match?.teams.home) setTeamA(match.teams.home);
        if (match?.teams.away) setTeamB(match.teams.away);
    }, [match]);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (teamA?.id) {
                setPlayersA(await getPlayersByTeamId(teamA.id));
            } else {
                setPlayersA([]);
            }
            if (teamB?.id) {
                setPlayersB(await getPlayersByTeamId(teamB.id));
            } else {
                setPlayersB([]);
            }
        };
        fetchPlayers();
    }, [teamA, teamB]);

    const usePendingValue = (teamId?: string) => {
        const [value, setValue] = useState(0);
         useEffect(() => {
            if (!teamId || !match || !allMatches) {
                setValue(0);
                return;
            };

            const calculatePending = async () => {
                const pastMatches = allMatches.filter(m => m.id !== match.id && isPast(new Date(m.date)));
                const teamPastMatches = pastMatches.filter(m => m.teams.home.id === teamId || m.teams.away.id === teamId);
                const total = teamPastMatches.reduce((total, pastMatch) => {
                    const isHome = pastMatch.teams.home.id === teamId;
                    const teamDetails = isHome ? pastMatch.teams.home : pastMatch.teams.away;
                    if (teamDetails.vocalPaymentDetails?.paymentStatus === 'pending') {
                        return total + (teamDetails.vocalPaymentDetails.total || 0);
                    }
                    return total;
                }, 0);
                setValue(total);
            }
            calculatePending();
        }, [teamId, match, allMatches]);
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
            async function checkSanction() {
                if(player) {
                    const sanctions = await getSanctions();
                    setIsSanctioned(sanctions.some(sanc => sanc.playerId === player.id));
                } else {
                    setIsSanctioned(false);
                }
            }
            checkSanction();
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

const DigitalMatchSheet = ({ match, onUpdateMatch, onFinishMatch }: { match: Match | null, onUpdateMatch: (matchId: string, updatedData: Partial<Match>) => void, onFinishMatch: (matchId: string) => void }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const canEdit = user.permissions.committees.edit;
    const [allMatches, setAllMatches] = useState<Match[]>([]);
    const [sanctionSettings, setSanctionSettings] = useState<SanctionSettings>({ yellowCardFine: 0, redCardFine: 0, absenceFine: 0 });


    useEffect(() => {
        getMatches().then(setAllMatches);
        getSanctionSettings().then(setSanctionSettings);
    }, []);

    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState('');
    const [searchResults, setSearchResults] = useState<Player[]>([]);
    const [physicalSheetUrl, setPhysicalSheetUrl] = useState<string | null>(match?.physicalSheetUrl || null);
    
    const [events, setEvents] = useState<MatchEvent[]>(match?.events || []);
    
    useEffect(() => {
        setEvents(match?.events || []);
        setPhysicalSheetUrl(match?.physicalSheetUrl || null);
    }, [match]);

    useEffect(() => {
        if (!match) return;

        const updateFines = async () => {
             const updatedTeams = { ...match.teams };
             let changed = false;

             for (const teamKey of ['home', 'away'] as const) {
                const team = updatedTeams[teamKey];
                if (!team.vocalPaymentDetails) continue;

                const yellowCardCount = events.filter(e => e.teamName === team.name && e.event === 'yellow_card').length;
                const redCardCount = events.filter(e => e.teamName === team.name && e.event === 'red_card').length;
                
                const newYellowCardFine = yellowCardCount * sanctionSettings.yellowCardFine;
                const newRedCardFine = redCardCount * sanctionSettings.redCardFine;
                
                if (team.vocalPaymentDetails.yellowCardFine !== newYellowCardFine || team.vocalPaymentDetails.redCardFine !== newRedCardFine) {
                    team.vocalPaymentDetails.yellowCardCount = yellowCardCount;
                    team.vocalPaymentDetails.redCardCount = redCardCount;
                    team.vocalPaymentDetails.yellowCardFine = newYellowCardFine;
                    team.vocalPaymentDetails.redCardFine = newRedCardFine;
                    changed = true;
                }
             }

             if (changed) {
                await handleVocalPaymentChange('home', 'referee', match.teams.home.vocalPaymentDetails?.referee || 0);
                await handleVocalPaymentChange('away', 'referee', match.teams.away.vocalPaymentDetails?.referee || 0);
             }
        };

        updateFines();
    }, [events, sanctionSettings, match]);


    const teamForEventSearch = match?.teams.home.id === selectedTeamId ? match.teams.home : match?.teams.away;

    const handleSearch = async () => {
        if (!selectedTeamId || !playerNumber) {
            toast({ title: "Información incompleta", description: "Por favor, selecciona equipo y número de camiseta.", variant: "destructive" });
            return;
        }
        const playersOfTeam = await getPlayersByTeamId(selectedTeamId);
        const results = playersOfTeam.filter(p => 
            p.jerseyNumber.toString() === playerNumber
        );

        if (results.length === 0) {
            toast({ title: "No encontrado", description: "No se encontró ningún jugador con ese número en el equipo seleccionado.", variant: "destructive" });
        }
        setSearchResults(results);
    };

    const addEvent = async (player: Player, eventType: MatchEventType) => {
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

        await onUpdateMatch(match.id, { events: updatedEvents });

        const statsUpdate = {
            goals: eventType === 'goal' ? 1 : 0,
            assists: eventType === 'assist' ? 1 : 0,
            yellowCards: eventType === 'yellow_card' ? 1 : 0,
            redCards: eventType === 'red_card' ? 1 : 0,
        };
        await updatePlayerStats(player.id, statsUpdate);
        
        let toastMessage = '';
        if (eventType === 'goal') toastMessage = `Gol registrado para ${player.name}!`;
        if (eventType === 'assist') toastMessage = `Asistencia registrada para ${player.name}.`;
        if (eventType === 'yellow_card') toastMessage = `Tarjeta amarilla para ${player.name}.`;
        if (eventType === 'red_card') {
            toastMessage = `Tarjeta ROJA para ${player.name}. ¡Será suspendido!`;
            await addSanction({
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
    
    const removeEvent = async (eventId: string) => {
        if(!match) return;

        const eventToRemove = events.find(e => e.id === eventId);
        if (!eventToRemove) return;

        const statsUpdate = {
            goals: eventToRemove.event === 'goal' ? -1 : 0,
            assists: eventToRemove.event === 'assist' ? -1 : 0,
            yellowCards: eventToRemove.event === 'yellow_card' ? -1 : 0,
            redCards: eventToRemove.event === 'red_card' ? -1 : 0,
        };
        await updatePlayerStats(eventToRemove.playerId, statsUpdate);
        
        const updatedEvents = events.filter((e) => e.id !== eventId);
        setEvents(updatedEvents);
        await onUpdateMatch(match.id, { events: updatedEvents });

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
        onUpdateMatch(match.id, { [field]: value });
    }
    
    const handleScoreChange = (teamKey: 'home' | 'away', newScore: number) => {
        if(!match || !match.score) return;
        const updatedScore = {
            ...match.score,
            [teamKey]: newScore
        };
        onUpdateMatch(match.id, { score: updatedScore });
    }

    const getPendingValue = useCallback(async (teamId: string, currentMatchId: string) => {
        const pastMatches = allMatches.filter(m => m.id !== currentMatchId && isPast(new Date(m.date)));
        const teamPastMatches = pastMatches.filter(m => m.teams.home.id === teamId || m.teams.away.id === teamId);
        return teamPastMatches.reduce((total, pastMatch) => {
            const isHome = pastMatch.teams.home.id === teamId;
            const teamDetails = isHome ? pastMatch.teams.home : pastMatch.teams.away;
            if (teamDetails.vocalPaymentDetails?.paymentStatus === 'pending') {
                return total + (teamDetails.vocalPaymentDetails.total || 0);
            }
            return total;
        }, 0);
    }, [allMatches]);
    
    const handleVocalPaymentChange = useCallback(async (teamKey: 'home' | 'away', field: keyof VocalPaymentDetailsType, value: any) => {
        if (!match) return;
    
        const teamDetails = match.teams[teamKey];
        if (!teamDetails.vocalPaymentDetails) return;
    
        const currentPayment = { ...teamDetails.vocalPaymentDetails };
        const updatedPayment = { ...currentPayment, [field]: value };
    
        const calculateTotal = async (paymentDetails: VocalPaymentDetailsType) => {
            const absenceFine = !match.teams[teamKey].attended ? sanctionSettings.absenceFine : 0;
            const baseTotal = 
                (Number(paymentDetails.referee) || 0) + 
                (Number(paymentDetails.fee) || 0) + 
                (Number(paymentDetails.yellowCardFine) || 0) + 
                (Number(paymentDetails.redCardFine) || 0) + 
                (Number(paymentDetails.otherFines) || 0) +
                absenceFine;
            
            const pendingValue = await getPendingValue(match.teams[teamKey].id, match.id);
            const pendingAmountToAdd = paymentDetails.includePendingDebt ? pendingValue : 0;
            
            const totalWithPending = baseTotal + pendingAmountToAdd;
            const finalTotal = totalWithPending - (Number(paymentDetails.advancePayment) || 0);

            return finalTotal;
        };
    
        updatedPayment.total = await calculateTotal(updatedPayment);
        if (!match.teams[teamKey].attended) {
            updatedPayment.absenceFine = sanctionSettings.absenceFine;
        } else {
             updatedPayment.absenceFine = 0;
        }
    
        const updatedTeamDetails = {
            ...teamDetails,
            vocalPaymentDetails: updatedPayment
        };
    
        onUpdateMatch(match.id, { 
            teams: {
                ...match.teams,
                [teamKey]: updatedTeamDetails
            }
        });
    }, [match, onUpdateMatch, getPendingValue, sanctionSettings]);
    
    const handleSaveResult = () => {
        if (!match) return;
        onFinishMatch(match.id);
        toast({ title: "Partido Finalizado", description: "El resultado ha sido guardado y el partido marcado como finalizado."});
    }

     const handlePhysicalSheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && match) {
            try {
                const storageRef = ref(storage, `physical-sheets/${match.id}-${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                
                setPhysicalSheetUrl(downloadURL);
                onUpdateMatch(match.id, { physicalSheetUrl: downloadURL });
                toast({ title: "Acta Física Subida", description: "La imagen ha sido guardada con el partido."});
            } catch (error) {
                 toast({ title: "Error al subir imagen", description: "No se pudo subir la imagen a Firebase Storage.", variant: "destructive"});
                 console.error("Error uploading to Firebase Storage:", error);
            }
        }
    };


    const VocalPaymentDetailsInputs = ({ teamKey }: { teamKey: 'home' | 'away' }) => {
        const [pendingValue, setPendingValue] = useState(0);
        
        const teamId = match?.teams[teamKey].id;

        useEffect(() => {
            if (teamId && match) {
                getPendingValue(teamId, match.id).then(setPendingValue);
            }
        }, [teamId, match, getPendingValue]);
        
         useEffect(() => {
            handleVocalPaymentChange(teamKey, 'referee', match?.teams[teamKey].vocalPaymentDetails?.referee || 0);
        }, [match?.teams[teamKey].attended]);

        if (!match) return null;
        const details = match.teams[teamKey].vocalPaymentDetails;
        if (!details) return null;
        
        const disabled = !canEdit || !match.teams[teamKey].attended;

        const handlePaymentStatusChange = (checked: boolean) => {
             handleVocalPaymentChange(teamKey, 'paymentStatus', checked ? 'paid' : 'pending');
        }
        
        const handleIncludePendingDebtChange = (checked: boolean) => {
            handleVocalPaymentChange(teamKey, 'includePendingDebt', checked);
        }

        return (
            <div className="space-y-2 mt-2 p-3 border rounded-lg">
                {pendingValue > 0 && (
                     <div className="p-2 rounded-md bg-destructive/10 border border-destructive text-destructive space-y-2">
                         <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            <h5 className="font-semibold">Valores Pendientes</h5>
                         </div>
                        <p className="text-sm">Este equipo tiene una deuda de <span className="font-bold">${pendingValue.toFixed(2)}</span> de partidos anteriores.</p>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id={`include-pending-${teamKey}`} 
                                checked={details.includePendingDebt}
                                onCheckedChange={(checked) => handleIncludePendingDebtChange(Boolean(checked))}
                                disabled={disabled}
                            />
                            <Label htmlFor={`include-pending-${teamKey}`} className="text-sm">
                                Incluir deuda en el total de hoy
                            </Label>
                        </div>
                     </div>
                )}
                {!match.teams[teamKey].attended && (
                     <div className="p-2 rounded-md bg-destructive/10 border border-destructive text-destructive space-y-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            <h5 className="font-semibold">Equipo Ausente</h5>
                        </div>
                        <p className="text-sm">Se ha aplicado una multa de <span className="font-bold">${(details.absenceFine || 0).toFixed(2)}</span> por no presentación.</p>
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
                    
                    <div className="flex items-center justify-between col-span-2">
                         <Label>Multa T. Amarillas:</Label>
                         <p className="font-semibold">${(details.yellowCardFine || 0).toFixed(2)} ({details.yellowCardCount || 0} tarjetas)</p>
                    </div>

                    <div className="flex items-center justify-between col-span-2">
                         <Label>Multa T. Rojas:</Label>
                         <p className="font-semibold">${(details.redCardFine || 0).toFixed(2)} ({details.redCardCount || 0} tarjetas)</p>
                    </div>

                    <Label className="col-span-2">Otras Multas (especificar):</Label>
                    <Textarea value={details.otherFinesDescription} onChange={(e) => handleVocalPaymentChange(teamKey, 'otherFinesDescription', e.target.value)} placeholder="Descripción de la multa" disabled={disabled} className="col-span-2 h-16" />
                    <div/>
                    <Input type="number" value={details.otherFines} onChange={(e) => handleVocalPaymentChange(teamKey, 'otherFines', parseFloat(e.target.value) || 0)} placeholder="0.00" disabled={disabled} className="h-8" />

                    <Label>Abono / Adelanto:</Label>
                    <Input type="number" value={details.advancePayment || ''} onChange={(e) => handleVocalPaymentChange(teamKey, 'advancePayment', parseFloat(e.target.value) || 0)} placeholder="0.00" disabled={disabled} className="h-8" />


                    <Label className="font-bold text-base">TOTAL VOCALÍA:</Label>
                    <p className="font-bold text-base text-right pr-2">${(details.total || 0).toFixed(2)}</p>
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
                                 <Switch id="teamA-attended" checked={match.teams.home.attended} onCheckedChange={(checked) => onUpdateMatch(match.id, {teams: {...match.teams, home: {...match.teams.home, attended: checked}}})} disabled={!canEdit}/>
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
                                 <Switch id="teamB-attended" checked={match.teams.away.attended} onCheckedChange={(checked) => onUpdateMatch(match.id, {teams: {...match.teams, away: {...match.teams.away, attended: checked}}})} disabled={!canEdit}/>
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
  const [loading, setLoading] = useState(true);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    const matches = await getMatches();
    setAllMatches(matches);
    setLoading(false);
  }, []);

  useEffect(() => {
    setIsClient(true);
    loadMatches();
  }, [loadMatches]);

  const { user } = useAuth();
  const handlePrint = () => {
    window.print();
  };

  const handleUpdateMatch = useCallback(async (matchId: string, updatedData: Partial<Match>) => {
    await updateMatchData(matchId, updatedData);
    const updatedMatch = await getMatchById(matchId);
    if (updatedMatch) {
        setAllMatches(prevMatches => prevMatches.map(m => m.id === updatedMatch.id ? updatedMatch : m));
    }
  }, []);
  
  const handleFinishMatch = useCallback(async (matchId: string) => {
    await setMatchAsFinished(matchId);
    setAllMatches(prevMatches => prevMatches.map(m => m.id === matchId ? { ...m, status: 'finished' } : m));
    setSelectedMatchId(null);
  }, []);

  const selectedMatch = useMemo(() => {
    if (!selectedMatchId) return null;
    return allMatches.find(m => m.id === selectedMatchId) || null;
  }, [selectedMatchId, allMatches]);

  const groupedMatches = useMemo(() => {
    if (!isClient) return { active: [], finished: [] };
    
    const active = allMatches
        .filter(m => m.status !== 'finished')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const finished = allMatches
        .filter(m => m.status === 'finished')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { active, finished };
  }, [isClient, allMatches]);

  const MatchSelect = ({ matches, placeholder }: { matches: Match[], placeholder: string }) => (
     <Select onValueChange={setSelectedMatchId} value={selectedMatchId || ''}>
        <SelectTrigger>
            <SelectValue placeholder={placeholder}/>
        </SelectTrigger>
        <SelectContent>
            {isClient && (
                matches.map(match => (
                    <SelectItem key={match.id} value={match.id}>
                        {match.teams.home.name} vs {match.teams.away.name} ({new Date(match.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })})
                    </SelectItem>
                ))
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
      </div>

       <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setSelectedMatchId(null); }} defaultValue="digital" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="digital">Vocalía Digital (Registrar)</TabsTrigger>
              <TabsTrigger value="physical">Vocalía Física (Imprimir)</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2"/>Historial (Ver/Editar)</TabsTrigger>
          </TabsList>

          <TabsContent value="digital" className="mt-0 space-y-4">
            <Card className="print:hidden">
                 <CardHeader>
                    <CardTitle>Seleccionar Partido para Vocalía Digital</CardTitle>
                     <CardContent className="p-0 pt-4">
                          <MatchSelect matches={groupedMatches.active} placeholder="Elige un partido pendiente..." />
                     </CardContent>
                 </CardHeader>
            </Card>
             <DigitalMatchSheet match={selectedMatch} onUpdateMatch={handleUpdateMatch} onFinishMatch={handleFinishMatch} />
          </TabsContent>

          <TabsContent value="physical" className="mt-0 space-y-4">
            <Card className="print:hidden">
                <CardHeader>
                    <CardTitle>Generar Hoja de Vocalía Física</CardTitle>
                    <CardContent className="p-0 pt-4 flex gap-4 items-end">
                        <div className="flex-grow">
                             <Label>Seleccionar Partido</Label>
                             <MatchSelect matches={groupedMatches.active} placeholder="Elige un partido pendiente..." />
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
          
          <TabsContent value="history" className="mt-0 space-y-4">
             <Card className="print:hidden">
                 <CardHeader>
                    <CardTitle>Historial de Vocalías</CardTitle>
                    <CardDescription>Selecciona un partido finalizado para ver o editar sus detalles.</CardDescription>
                     <CardContent className="p-0 pt-4">
                         <MatchSelect matches={groupedMatches.finished} placeholder="Elige un partido finalizado..." />
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
