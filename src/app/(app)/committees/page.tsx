
'use client';

import { useState } from 'react';
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
import { Printer, Calendar, Upload, Search, PlusCircle, Trash2, ShieldCheck, Flag, Users } from 'lucide-react';
import Image from 'next/image';
import { players, teams, type Player } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data - we'll replace this with dynamic data later
const matchData = {
  date: '2024-07-28',
  time: '14:00',
  category: 'Máxima',
  phase: 'Fase de Grupos',
  matchday: 'Jornada 5',
  field: 'Cancha Principal',
  vocalTeam: 'Galaxy Gliders',
  teamA: {
    ...teams.find(t => t.id === '1')!,
    players: players.filter(p => p.teamId === '1').slice(0, 18),
  },
  teamB: {
    ...teams.find(t => t.id === '2')!,
     players: players.filter(p => p.teamId === '2').slice(0, 18),
  },
};

type MatchEvent = {
    playerId: string;
    playerName: string;
    teamName: string;
    event: 'goal' | 'yellow_card' | 'red_card';
};

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
            <TableCell className="border text-center font-bold p-1 w-[40px]">{String(index + 1).padStart(2, '0')}</TableCell>
            <TableCell className="border p-1">{player.name}</TableCell>
        </TableRow>
    );

    return (
        <Card id="print-area" className="p-4 md:p-6 print:shadow-none print:border-none bg-white text-black">
            <CardContent className="p-0">
                 <header className="mb-4">
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span><strong>Categoría:</strong> {matchData.category}</span>
                        <span><strong>Fecha:</strong> {matchData.date}</span>
                        <span><strong>Hora:</strong> {matchData.time}</span>
                        <span><strong>Cancha:</strong> {matchData.field}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span><strong>Etapa:</strong> {matchData.phase}</span>
                        <span><strong>Jornada:</strong> {matchData.matchday}</span>
                        <span><strong>Vocal:</strong> {matchData.vocalTeam}</span>
                    </div>
                </header>

                <main className="grid grid-cols-2 gap-4">
                    {/* Team A */}
                    <div>
                        <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
                            <div className="flex items-center gap-2">
                                <Image src={matchData.teamA.logoUrl} alt={matchData.teamA.name} width={30} height={30} data-ai-hint="team logo" />
                                <h3 className="font-bold uppercase">{matchData.teamA.name}</h3>
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
                                {matchData.teamA.players.map((player, index) => (
                                    <PlayerRow key={player.id} player={player} index={index}/>
                                ))}
                            </TableBody>
                        </Table>
                         <div className="text-xs mt-2 border p-1">
                            <p><strong>Jugadores sancionados:</strong> ________________________</p>
                            <p><strong>Total Pagado Vocalía:</strong> $ ____________</p>
                        </div>
                        <div className="text-xs mt-2 border p-1 flex items-center">
                            <p className="mr-2"><strong>Capitán:</strong> ________________________</p>
                            <Image src="https://placehold.co/40x40.png" width={30} height={30} alt="Captain signature" />
                        </div>
                    </div>

                    {/* Team B */}
                    <div>
                        <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
                            <div className="flex items-center gap-2">
                                <Image src={matchData.teamB.logoUrl} alt={matchData.teamB.name} width={30} height={30} data-ai-hint="team logo" />
                                <h3 className="font-bold uppercase">{matchData.teamB.name}</h3>
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
                               {matchData.teamB.players.map((player, index) => (
                                    <PlayerRow key={player.id} player={player} index={index}/>
                                ))}
                            </TableBody>
                        </Table>
                         <div className="text-xs mt-2 border p-1">
                            <p><strong>Jugadores sancionados:</strong> ________________________</p>
                            <p><strong>Total Pagado Vocalía:</strong> $ ____________</p>
                        </div>
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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Player[]>([]);
    const [events, setEvents] = useState<MatchEvent[]>([]);
    const [finalScore, setFinalScore] = useState({ teamA: 0, teamB: 0 });

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        const results = players.filter(p => 
            p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    const addEvent = (player: Player, eventType: 'goal' | 'yellow_card' | 'red_card') => {
        const newEvent: MatchEvent = {
            playerId: player.id,
            playerName: player.name,
            teamName: player.team,
            event: eventType,
        };
        setEvents([...events, newEvent]);
    };
    
    const removeEvent = (index: number) => {
        setEvents(events.filter((_, i) => i !== index));
    };

    const getEventBadge = (event: 'goal' | 'yellow_card' | 'red_card') => {
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
                    
                    {/* Evidence upload */}
                    <div>
                         <Label>Evidencia de Vocalía Física</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input type="file" className="flex-grow" />
                            <Button variant="outline"><Upload className="mr-2" /> Subir</Button>
                        </div>
                    </div>
                    
                    {/* Player search */}
                    <div>
                        <Label htmlFor="player-search">Buscar Jugador (por Nombre o ID)</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input 
                                id="player-search" 
                                placeholder="Ej: '101' o 'Leo Astral'" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch}><Search className="mr-2" /> Buscar</Button>
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
                                            <Button size="sm" onClick={() => addEvent(player, 'goal')}>Gol</Button>
                                            <Button size="sm" variant="secondary" className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => addEvent(player, 'yellow_card')}>T.A.</Button>
                                            <Button size="sm" variant="destructive" onClick={() => addEvent(player, 'red_card')}>T.R.</Button>
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
                     <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="text-center space-y-2">
                            <Image src={matchData.teamA.logoUrl} alt={matchData.teamA.name} width={60} height={60} className="mx-auto rounded-full" data-ai-hint="team logo" />
                            <h4 className="font-bold">{matchData.teamA.name}</h4>
                            <Input type="number" className="w-24 mx-auto text-center text-2xl font-bold" value={finalScore.teamA} onChange={(e) => setFinalScore({...finalScore, teamA: parseInt(e.target.value) || 0})} />
                        </div>
                         <div className="text-center space-y-2">
                             <Image src={matchData.teamB.logoUrl} alt={matchData.teamB.name} width={60} height={60} className="mx-auto rounded-full" data-ai-hint="team logo" />
                            <h4 className="font-bold">{matchData.teamB.name}</h4>
                            <Input type="number" className="w-24 mx-auto text-center text-2xl font-bold" value={finalScore.teamB} onChange={(e) => setFinalScore({...finalScore, teamB: parseInt(e.target.value) || 0})} />
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
                                        {events.map((event, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{event.playerName}</TableCell>
                                                <TableCell>{event.teamName}</TableCell>
                                                <TableCell>{getEventBadge(event.event)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeEvent(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                     </Card>
                      <Button className="w-full" size="lg">Guardar Resultado del Partido</Button>
                </div>

            </CardContent>
        </Card>
    );
};


export default function CommitteesPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Hoja de Vocalía
        </h2>
         <Tabs defaultValue="physical">
            <TabsList>
                <TabsTrigger value="physical" onClick={() => {
                    const printButton = document.getElementById('print-button');
                    if (printButton) printButton.style.display = 'block';
                }}>Vocalía Física (Imprimir)</TabsTrigger>
                <TabsTrigger value="digital" onClick={() => {
                     const printButton = document.getElementById('print-button');
                    if (printButton) printButton.style.display = 'none';
                }}>Vocalía Digital (Registrar)</TabsTrigger>
            </TabsList>
        </Tabs>
        <Button onClick={handlePrint} id="print-button">
          <Printer className="mr-2" />
          Imprimir Vocalía
        </Button>
      </div>

       <Tabs defaultValue="physical" className="space-y-4">
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
          .print\:hidden {
              display: none !important;
          }
           .print\:block {
              display: block !important;
          }
           .print\:shadow-none {
              box-shadow: none !important;
          }
           .print\:border-none {
              border: none !important;
          }
          .flex-1.space-y-4 {
            padding: 0;
          }
          #print-area {
            box-shadow: none !important;
            border: none !important;
          }
        }
         @page {
            size: A4 portrait;
            margin: 1cm;
        }
      `}</style>
    </div>
  );
}

