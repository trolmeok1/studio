

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team, Category, upcomingMatches as initialMatches } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Dices, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Match, GeneratedMatch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, setHours, setMinutes, setSeconds, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';


const BracketNode = ({ team, isWinner }: { team: string | null; isWinner?: boolean }) => {
    const [isClientWinner, setIsClientWinner] = useState(false);

    useEffect(() => {
        if (team) { // Only determine winner if there is a team
            setIsClientWinner(Math.random() > 0.5);
        }
    }, [team]);

    return (
        <div
        className={cn(`flex items-center w-full h-8 px-2 border text-xs rounded-md`,
            isWinner ?? isClientWinner ? 'bg-primary/20 border-primary font-bold' : 'bg-muted/50',
            !team ? 'border-dashed' : 'border-solid'
        )}
        >
            <span className="truncate">{team || '...'}</span>
        </div>
    );
};

const Matchup = ({ teamA, teamB }: { teamA: string | null; teamB: string | null; }) => {
    const [isWinnerA, setIsWinnerA] = useState(true);

    useEffect(() => {
        setIsWinnerA(Math.random() > 0.5);
    }, [teamA, teamB]);

    return (
        <div className="flex flex-col justify-center gap-1 w-full relative">
             <div className="absolute -right-2 top-1/2 w-2 h-px bg-muted-foreground"></div>
             <div className="absolute -right-2 top-1/4 w-2 h-1/2 border-r border-b border-muted-foreground rounded-br-sm"></div>
            <BracketNode team={teamA} isWinner={isWinnerA} />
            <BracketNode team={teamB} isWinner={!isWinnerA} />
        </div>
    );
};

const Round = ({ title, matchups, children }: { title: string; matchups?: { teamA: {name: string}; teamB: {name: string}; }[], children?: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-around items-center w-48 gap-4">
            <h3 className="text-lg font-bold font-headline tracking-wider uppercase text-center">{title}</h3>
            <div className="flex flex-col w-full h-full justify-around gap-4">
                 {matchups && matchups.map((match, i) => (
                    <Matchup key={i} teamA={match.teamA.name} teamB={match.teamB.name} />
                ))}
                {children}
            </div>
        </div>
    )
}

const CopaBracket = () => {
    const [bracketTeams, setBracketTeams] = useState<Team[]>([]);

    useEffect(() => {
        let allTeams: Team[] = [
            ...getTeamsByCategory('Máxima'),
            ...getTeamsByCategory('Primera'),
            ...getTeamsByCategory('Segunda')
        ];
        
        allTeams.sort(() => 0.5 - Math.random());

        const selectedTeams = allTeams.slice(0, 16);

        while (selectedTeams.length < 16) {
            selectedTeams.push({
                id: `fake-${selectedTeams.length + 1}`,
                name: `Equipo ${selectedTeams.length + 1}`,
                logoUrl: 'https://placehold.co/100x100.png',
                category: 'Máxima'
            });
        }
        setBracketTeams(selectedTeams);
    }, []);

    if (bracketTeams.length === 0) {
        return <div>Generando bracket...</div>
    }

    const octavos = Array.from({ length: 8 }).map((_, i) => ({ teamA: bracketTeams[i*2], teamB: bracketTeams[i*2+1] }));
    const cuartos = Array.from({ length: 4 }).map((_, i) => ({ teamA: octavos[i*2].teamA, teamB: octavos[i*2+1].teamA })); // Dummy winners
    const semifinal = Array.from({ length: 2 }).map((_, i) => ({ teamA: cuartos[i*2].teamA, teamB: cuartos[i*2+1].teamA })); // Dummy winners
    const final = { teamA: semifinal[0].teamA, teamB: semifinal[1].teamA }; // Dummy winners

    return (
        <div className="flex justify-center items-stretch gap-4 md:gap-8 p-4 bg-background/50 rounded-md overflow-x-auto">
            <Round title="Octavos" matchups={octavos} />
            <Round title="Cuartos" matchups={cuartos} />
            <Round title="Semifinal" matchups={semifinal} />
            <Round title="Final">
                 <Matchup teamA={final.teamA.name} teamB={final.teamB.name} />
                 <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">Campeón</p>
                    <p className="text-xl font-bold text-amber-400">🏆 {final.teamA.name} 🏆</p>
                </div>
            </Round>
        </div>
    );
};

const MatchCard = ({ match }: { match: GeneratedMatch }) => {
    const allTeams = [...getTeamsByCategory('Máxima'), ...getTeamsByCategory('Primera'), ...getTeamsByCategory('Segunda')];
    const homeTeam = allTeams.find(t => t.id === match.home);
    const awayTeam = allTeams.find(t => t.id === match.away);
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    
    return (
    <Link href={`/partido`}>
        <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md text-sm hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-semibold text-right w-2/5 justify-end">
                <span className="truncate">{homeTeam?.name || match.home}</span>
                <Image src={homeTeam?.logoUrl || 'https://placehold.co/40x40.png'} alt={homeTeam?.name || 'Home'} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
            </div>
             <div className="text-center w-1/5">
                <span className="text-primary font-bold mx-2">VS</span>
                 <div className="mt-1 text-xs text-muted-foreground">{isClient && match.time ? match.time : 'Por definir'}</div>
            </div>
            <div className="flex items-center gap-2 font-semibold text-left w-2/5">
                <Image src={awayTeam?.logoUrl || 'https://placehold.co/40x40.png'} alt={awayTeam?.name || 'Away'} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
                <span className="truncate">{awayTeam?.name || match.away}</span>
            </div>
        </div>
    </Link>
);
}


const LeagueView = ({ category, generatedMatches }: { category: Category, generatedMatches: GeneratedMatch[] }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    
    useEffect(() => {
        const categoryTeams = getTeamsByCategory(category);
        setTeams(categoryTeams);
    }, [category]);

    const standings = useMemo(() => {
        if (teams.length === 0) return [];
        const categoryStandings = [...mockStandings].filter(s => teams.some(t => t.id === s.teamId));

        const teamsWithLogos = categoryStandings.map(s => {
            const teamData = teams.find(t => t.id === s.teamId);
            return {
                ...s,
                teamLogoUrl: teamData?.logoUrl || 'https://placehold.co/100x100.png'
            };
        });
        return teamsWithLogos
            .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
    }, [teams]);
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);

    const groupedMatches = useMemo(() => {
        return generatedMatches
            .filter(m => m.category === category)
            .reduce((acc, match, index, arr) => {
                const roundSize = (teams.length - (teams.length % 2 === 0 ? 2 : 1)) / 2;
                const totalRounds = (teams.length - (teams.length % 2 === 0 ? 0 : 1) -1);
                
                let leg = 'Ida';
                let currentRound = Math.floor(index / roundSize) + 1;

                if (currentRound > totalRounds) {
                    leg = 'Vuelta';
                    currentRound = currentRound - totalRounds;
                }
                
                const dateKey = `Fecha ${currentRound} (${leg})`;
                
                if (!acc[dateKey]) {
                    acc[dateKey] = {
                        date: isClient && match.date ? format(match.date, 'PPPP', {locale: es}) : '',
                        matches: []
                    };
                }
                acc[dateKey].matches.push(match);
                return acc;
            }, {} as Record<string, { date: string, matches: GeneratedMatch[] }>);
    }, [generatedMatches, isClient, teams, category]);


    if(teams.length === 0) {
         return (
             <Card>
                <CardHeader>
                    <CardTitle>Torneo {category}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No hay equipos registrados en esta categoría.</p>
                </CardContent>
             </Card>
         )
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Torneo {category}</CardTitle>
                    <CardDescription>Partidos de ida y vuelta. Los dos primeros clasifican a la final.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue='standings'>
                     <TabsList>
                        <TabsTrigger value="standings">Tabla de Posiciones</TabsTrigger>
                        <TabsTrigger value="schedule">Calendario de Partidos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="standings">
                        <Table className="mt-4">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Equipo</TableHead>
                                    <TableHead className="text-center">PJ</TableHead>
                                    <TableHead className="text-center">G</TableHead>
                                    <TableHead className="text-center">E</TableHead>
                                    <TableHead className="text-center">P</TableHead>
                                    <TableHead className="text-center">GF</TableHead>
                                    <TableHead className="text-center">GC</TableHead>
                                    <TableHead className="text-center">GD</TableHead>
                                    <TableHead className="text-center">PTS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {standings.map((s, index) => (
                                    <TableRow key={s.teamId} className={index < 2 ? 'bg-primary/10' : ''}>
                                        <TableCell className="font-bold">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image src={s.teamLogoUrl} alt={s.teamName} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                                <span>{s.teamName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{s.played}</TableCell>
                                        <TableCell className="text-center">{s.wins}</TableCell>
                                        <TableCell className="text-center">{s.draws}</TableCell>
                                        <TableCell className="text-center">{s.losses}</TableCell>
                                        <TableCell className="text-center">{s.goalsFor}</TableCell>
                                        <TableCell className="text-center">{s.goalsAgainst}</TableCell>
                                        <TableCell className="text-center">{s.goalsFor - s.goalsAgainst}</TableCell>
                                        <TableCell className="text-center font-bold">{s.points}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {standings.length >= 2 && (
                            <div className="mt-8 flex justify-around">
                                <div className="text-center">
                                    <h4 className="font-bold font-headline text-lg text-primary">FINAL</h4>
                                    <div className="mt-2 p-4 rounded-lg bg-muted/50 flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Image src={standings[0]?.teamLogoUrl || 'https://placehold.co/100x100.png'} alt={standings[0]?.teamName || 'Primero'} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                            <span>{standings[0]?.teamName || 'Primero'}</span>
                                        </div>
                                        <span className="font-bold text-primary">VS</span>
                                        <div className="flex items-center gap-2">
                                            <Image src={standings[1]?.teamLogoUrl || 'https://placehold.co/100x100.png'} alt={standings[1]?.teamName || 'Segundo'} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                            <span>{standings[1]?.teamName || 'Segundo'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="schedule" className="space-y-6 mt-6">
                        {Object.keys(groupedMatches).length > 0 ? Object.entries(groupedMatches).map(([roundName, roundData]) => (
                            <div key={roundName}>
                                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{roundName} - <span className="font-normal">{roundData.date}</span></h3>
                                <div className="space-y-2">
                                    {roundData.matches.sort((a,b) => a.date!.getTime() - b.date!.getTime()).map((match, index) => <MatchCard key={index} match={match} />)}
                                </div>
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-center py-8">Genere el calendario usando el botón "Sorteo de Equipos".</p>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

const DrawDialog = ({ onGenerate }: { onGenerate: (startDate: Date, playDays: Record<string, boolean>, startTimes: Record<string, string>) => void }) => {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
        '0': true, // Sunday
        '1': false, '2': false, '3': false, '4': false, '5': false, 
        '6': true, // Saturday
    });
    const [startTimes, setStartTimes] = useState<Record<string, string>>({
        '0': '09:00', '6': '10:00',
    });
    
    const daysOfWeek = [
        { id: '1', label: 'Lunes' }, { id: '2', label: 'Martes' }, { id: '3', label: 'Miércoles' },
        { id: '4', label: 'Jueves' }, { id: '5', label: 'Viernes' }, { id: '6', label: 'Sábado' }, { id: '0', label: 'Domingo' }
    ];

    const handleGenerateClick = () => {
        if (startDate) {
            onGenerate(startDate, selectedDays, startTimes);
        }
    };
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Dices className="mr-2" />
                    Sorteo de Equipos
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configurar Sorteo y Calendario</DialogTitle>
                    <DialogDescription>
                        Seleccione la fecha de inicio y los días y horas en que se jugarán los partidos para generar el calendario automáticamente.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Fecha de Inicio del Torneo</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                         <Label>Días y Hora de Juego</Label>
                         <div className="grid grid-cols-1 gap-4">
                             {daysOfWeek.map(day => (
                                <div key={day.id} className="flex items-center space-x-4 p-2 rounded-md bg-muted/50">
                                    <Checkbox
                                        id={day.id}
                                        checked={selectedDays[day.id]}
                                        onCheckedChange={(checked) => setSelectedDays(prev => ({...prev, [day.id]: !!checked}))}
                                    />
                                    <label htmlFor={day.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
                                        {day.label}
                                    </label>
                                     <Input
                                        type="time"
                                        className="w-32"
                                        disabled={!selectedDays[day.id]}
                                        value={startTimes[day.id] || '08:00'}
                                        onChange={(e) => setStartTimes(prev => ({...prev, [day.id]: e.target.value}))}
                                     />
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
                 <DialogFooter>
                    <Button onClick={handleGenerateClick}>
                        <RefreshCw className="mr-2" />
                        Generar Calendario
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function SchedulePage() {
  const [isClient, setIsClient] = useState(false);
  const [generatedMatches, setGeneratedMatches] = useState<GeneratedMatch[]>([]);

  useEffect(() => { setIsClient(true) }, []);

  const generateMasterSchedule = (startDate: Date, playDays: Record<string, boolean>, startTimes: Record<string, string>) => {
      const categories: Category[] = ['Máxima', 'Primera', 'Segunda'];
      const allMatchesToSchedule: GeneratedMatch[] = [];
      const matchDurationHours = 2; // Each match lasts 2 hours

      // 1. Generate all round-robin matches for each category
      categories.forEach(category => {
          let teams = getTeamsByCategory(category).map(t => t.id);

          // Randomize team order for fair matchups
          teams.sort(() => 0.5 - Math.random());

          if (teams.length % 2 !== 0) {
              teams.push("BYE");
          }
          const rounds = teams.length - 1;
          const half = teams.length / 2;
          
          let teamsForScheduling = [...teams];
          
          // Generate first and second leg matches
          for (let leg = 0; leg < 2; leg++) {
              teamsForScheduling = [...teams]; // Reset for each leg to ensure fairness
              for (let i = 0; i < rounds; i++) {
                  for (let j = 0; j < half; j++) {
                      let home, away;
                      if (leg === 0) { // First leg
                          home = teamsForScheduling[j];
                          away = teamsForScheduling[teamsForScheduling.length - 1 - j];
                      } else { // Second leg (swap home/away)
                          away = teamsForScheduling[j];
                          home = teamsForScheduling[teamsForScheduling.length - 1 - j];
                      }

                      if (home !== "BYE" && away !== "BYE") {
                          allMatchesToSchedule.push({ home, away, category });
                      }
                  }
                  // Rotate teams for next round
                  const lastTeam = teamsForScheduling.pop();
                  if (lastTeam) {
                      teamsForScheduling.splice(1, 0, lastTeam);
                  }
              }
          }
      });
      
      // 2. Assign dates and times
      const finalSchedule: GeneratedMatch[] = [];
      let currentDate = new Date(startDate);
      let matchIndex = 0;
      const enabledPlayDays = Object.keys(playDays).filter(day => playDays[day]).map(Number);


      while (matchIndex < allMatchesToSchedule.length) {
          // Find next available play day
          while (!enabledPlayDays.includes(currentDate.getDay())) {
              currentDate = addDays(currentDate, 1);
          }
          
          const dayOfWeek = currentDate.getDay();
          const startTimeString = startTimes[dayOfWeek] || '08:00';
          const [startHour, startMinute] = startTimeString.split(':').map(Number);
          let matchTime = setMinutes(setHours(new Date(currentDate), startHour), startMinute);

          // Fill time slots for the current day
          while(matchIndex < allMatchesToSchedule.length) {
              const match = allMatchesToSchedule[matchIndex];
              
              // Check if another category can fit on this day
              const matchesOnThisDay = finalSchedule.filter(f => f.date && f.date.toDateString() === currentDate.toDateString()).length;
              const matchesPerCategoryOnDay = finalSchedule.filter(f => f.date && f.date.toDateString() === currentDate.toDateString() && f.category === match.category).length;
              const teamsForCategory = getTeamsByCategory(match.category).length;
              const maxMatchesPerDayForCategory = Math.ceil(teamsForCategory / 2);
              
              if(matchesPerCategoryOnDay >= maxMatchesPerDayForCategory) {
                 // Move to next match in the list, try to fit it on the same day if possible.
                 // This logic is complex, for now we break and go to next day.
                 break;
              }

              finalSchedule.push({
                  ...match,
                  date: new Date(matchTime),
                  time: format(matchTime, 'HH:mm'),
              });
              matchIndex++;
              matchTime = addDays(matchTime, matchDurationHours / 24); // Add 2 hours
          }
          
          currentDate = addDays(currentDate, 1);
      }
      setGeneratedMatches(finalSchedule);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
            Programación de Partidos
        </h2>
        <Card className="p-2 bg-card/50">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold mr-2">Admin:</span>
                 <DrawDialog onGenerate={generateMasterSchedule} />
            </div>
        </Card>
      </div>

      <Tabs defaultValue="copa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="copa">Copa La Luz</TabsTrigger>
          <TabsTrigger value="maxima">Máxima</TabsTrigger>
          <TabsTrigger value="primera">Primera</TabsTrigger>
          <TabsTrigger value="segunda">Segunda</TabsTrigger>
        </TabsList>
        <TabsContent value="copa">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Copa La Luz</CardTitle>
              <CardDescription>Torneo de eliminación directa con 16 equipos de todas las categorías.</CardDescription>
            </CardHeader>
            <CardContent>
              <CopaBracket />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="maxima">
           <LeagueView category="Máxima" generatedMatches={generatedMatches} />
        </TabsContent>
         <TabsContent value="primera">
           <LeagueView category="Primera" generatedMatches={generatedMatches} />
        </TabsContent>
        <TabsContent value="segunda">
           <LeagueView category="Segunda" generatedMatches={generatedMatches} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
