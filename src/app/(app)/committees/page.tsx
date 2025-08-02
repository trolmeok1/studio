
'use client';

import { useState, useMemo } from 'react';
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
import { players, teams, type Player, updatePlayerStats, addSanction, type Category, type Match, matchData as initialMatchData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';


const PhysicalMatchSheet = () => {
    const handlePrint = () => {
        window.print();
    };

    const PlayerRow = ({player, index}: {player: Player, index: number}) => (
        <TableRow className="h-8">
            <TableCell className="border text-center p-1 w-[40px]"><Checkbox /></TableCell>
            <TableCell className="border text-center p-1 w-[40px] h-full"><div className="h-6 border-r"></div></TableCell>
            <TableCell className="border text-center p-1 w-[40px] h-full"><div className="h-6 border-r"></div></TableCell>
            <TableCell className="border text-center p-1 w-[40px] h-full"><div className="h-6 border-r"></div></TableCell>
            <TableCell className="border text-center p-1 w-[40px] h-full"><div className="h-6 border-r"></div></TableCell>
            <TableCell className="border text-center font-bold p-1 w-[40px]">{String(player.id).slice(-2)}</TableCell>
            <TableCell className="border p-1">{player.name}</TableCell>
        </TableRow>
    );

    const VocalPaymentDetails = () => (
      <div className="text-xs mt-2 border">
        <p className="p-1"><strong>Jugadores sancionados:</strong> ________________________</p>
        <table className="w-full border-t">
          <tbody>
            <tr className="border-b"><td className="p-1 w-1/2"><strong>Pago Árbitro:</strong></td><td className="p-1 border-l text-right">$ 11.00</td></tr>
            <tr className="border-b"><td className="p-1"><strong>Cuota:</strong></td><td className="p-1 border-l text-right">$ 2.00</td></tr>
            <tr className="border-b"><td className="p-1"><strong>Tarjetas Amarillas:</strong></td><td className="p-1 border-l text-right">$______</td></tr>
            <tr className="border-b"><td className="p-1"><strong>Tarjetas Rojas:</strong></td><td className="p-1 border-l text-right">$______</td></tr>
            <tr className="border-b"><td className="p-1"><strong>Multas (especificar):</strong> ____________</td><td className="p-1 border-l text-right">$______</td></tr>
            <tr className="border-b"><td className="p-1"><strong>Otros (especificar):</strong> ______________</td><td className="p-1 border-l text-right">$______</td></tr>
            <tr className="font-bold bg-gray-100"><td className="p-1"><strong>TOTAL VOCALÍA:</strong></td><td className="p-1 border-l text-right">$______</td></tr>
          </tbody>
        </table>
      </div>
    );

    return (
        <Card id="print-area" className="p-4 md:p-6 print:shadow-none print:border-none bg-white text-black">
            <CardContent className="p-0">
                 <header className="mb-4">
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span><strong>Categoría:</strong> {initialMatchData.category}</span>
                        <span><strong>Fecha:</strong> {initialMatchData.date}</span>
                        <span><strong>Hora:</strong> {initialMatchData.time}</span>
                        <span><strong>Cancha:</strong> {initialMatchData.field}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span><strong>Etapa:</strong> {initialMatchData.phase}</span>
                        <span><strong>Jornada:</strong> {initialMatchData.matchday}</span>
                        <span><strong>Vocal:</strong> {initialMatchData.vocalTeam}</span>
                    </div>
                </header>

                <main className="grid grid-cols-2 gap-4">
                    {/* Team A */}
                    <div>
                        <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
                            <div className="flex items-center gap-2">
                                <Image src={initialMatchData.teamA.logoUrl} alt={initialMatchData.teamA.name} width={30} height={30} data-ai-hint="team logo" />
                                <h3 className="font-bold uppercase">{initialMatchData.teamA.name}</h3>
                            </div>
                            <div className="w-16 h-10 border-2 border-black bg-white"></div>
                        </div>
                        <Table className="border-collapse border border-gray-400">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">J</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">C</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">G</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">TA</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">TR</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">No.</TableHead>
                                    <TableHead className="border text-center text-black p-1 text-xs">Jugadores</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialMatchData.teamA.players.map((player, index) => (
                                    <PlayerRow key={player.id} player={player} index={index}/>
                                ))}
                            </TableBody>
                        </Table>
                        <VocalPaymentDetails />
                        <div className="text-xs mt-2 border p-1 flex items-center">
                            <p className="mr-2"><strong>Capitán:</strong> ________________________</p>
                            <Image src="https://placehold.co/40x40.png" width={30} height={30} alt="Captain signature" />
                        </div>
                    </div>

                    {/* Team B */}
                    <div>
                        <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
                            <div className="flex items-center gap-2">
                                <Image src={initialMatchData.teamB.logoUrl} alt={initialMatchData.teamB.name} width={30} height={30} data-ai-hint="team logo" />
                                <h3 className="font-bold uppercase">{initialMatchData.teamB.name}</h3>
                            </div>
                            <div className="w-16 h-10 border-2 border-black bg-white"></div>
                        </div>
                        <Table className="border-collapse border border-gray-400">
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">J</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">C</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">G</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">TA</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">TR</TableHead>
                                    <TableHead className="w-[40px] border text-center text-black p-1 text-xs">No.</TableHead>
                                    <TableHead className="border text-center text-black p-1 text-xs">Jugadores</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {initialMatchData.teamB.players.map((player, index) => (
                                    <PlayerRow key={player.id} player={player} index={index}/>
                                ))}
                            </TableBody>
                        </Table>
                        <VocalPaymentDetails />
                        <div className="text-xs mt-2 border p-1 flex items-center">
                            <p className="mr-2"><strong>Capitán:</strong> ________________________</p>
                            <Image src="https://placehold.co/40x40.png" width={30} height={30} alt="Captain signature" />
                        </div>
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
                               <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="number" placeholder="Vocalía" className="w-32 mx-auto pl-8" disabled={!canEdit || !matchState.teamA.attended} value={matchState.teamA.vocalPayment} onChange={(e) => setMatchState({...matchState, teamA: {...matchState.teamA, vocalPayment: parseFloat(e.target.value) || 0}})}/>
                               </div>
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
                               <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="number" placeholder="Vocalía" className="w-32 mx-auto pl-8" disabled={!canEdit || !matchState.teamB.attended} value={matchState.teamB.vocalPayment} onChange={(e) => setMatchState({...matchState, teamB: {...matchState.teamB, vocalPayment: parseFloat(e.target.value) || 0}})} />
                               </div>
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
