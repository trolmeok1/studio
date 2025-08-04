
'use client';

import { useState, useMemo } from 'react';
import type { Player, Team, Sanction, Match } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Users, Calendar, ShieldAlert, BadgeInfo, Printer, List, LayoutGrid, DollarSign, Phone, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

type ViewMode = 'list' | 'grid';

const InfoRow = ({ icon: Icon, label, person, showContact }: { icon: React.ElementType, label: string, person?: any, showContact: boolean }) => (
    <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
        <Icon className="w-5 h-5 text-primary mt-1" />
        <div className="flex-grow">
            <p className="font-semibold">{label}</p>
            <p className="text-muted-foreground">{person?.name || 'No asignado'}</p>
        </div>
        {showContact && person?.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Phone className="w-4 h-4" />
                <span>{person.phone}</span>
            </div>
        )}
    </div>
);

const PlayerCard = ({ player }: { player: Player }) => (
  <Card className="overflow-hidden text-center group">
    <div className="relative">
      <Image src={player.photoUrl} alt={player.name} width={200} height={250} className="w-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-300" data-ai-hint="player portrait" />
      <div className="absolute top-2 right-2 bg-background/80 text-foreground rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold shadow-lg">
          {player.jerseyNumber}
      </div>
    </div>
    <CardHeader className="p-4">
      <CardTitle className="text-base truncate">{player.name}</CardTitle>
      <CardDescription>{player.position}</CardDescription>
    </CardHeader>
  </Card>
);

const RosterTab = ({ players }: { players: Player[] }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Plantilla del Equipo</CardTitle>
                    <CardDescription>Lista de todos los jugadores registrados en el equipo.</CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
               {viewMode === 'grid' ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {players.map(player => <PlayerCard key={player.id} player={player} />)}
                </div>
               ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Jugador</TableHead>
                            <TableHead>Posición</TableHead>
                            <TableHead className="text-center">N°</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players.map(player => (
                            <TableRow key={player.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={player.photoUrl} alt={player.name} data-ai-hint="player portrait" />
                                            <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <span>{player.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{player.position}</TableCell>
                                <TableCell className="text-center font-mono">{player.jerseyNumber}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={player.status === 'activo' ? 'default' : 'destructive'}>{player.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
               )}
            </CardContent>
        </Card>
    );
};

const MatchesTab = ({ teamId, matches }: { teamId: string, matches: Match[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Calendario y Resultados</CardTitle>
            <CardDescription>Próximos partidos y resultados anteriores del equipo.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Oponente</TableHead>
                        <TableHead>Resultado</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {matches.map(match => {
                        const isHome = match.teams.home.id === teamId;
                        const opponent = isHome ? match.teams.away : match.teams.home;
                        const score = match.status === 'finished' ? `${match.score?.home} - ${match.score?.away}` : '-';

                        return (
                             <TableRow key={match.id}>
                                <TableCell>{format(new Date(match.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                <TableCell>{opponent.name}</TableCell>
                                <TableCell className="font-semibold">{score}</TableCell>
                                <TableCell><Badge variant={match.status === 'finished' ? 'secondary' : 'default'}>{match.status}</Badge></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const FinanceTab = ({ vocalPayments }: { vocalPayments: any[] }) => (
     <Card>
        <CardHeader>
            <CardTitle>Finanzas del Equipo</CardTitle>
            <CardDescription>Registro de pagos de vocalía y otras transacciones financieras.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                 <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Oponente</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vocalPayments.map((payment, i) => (
                        <TableRow key={i}>
                            <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{payment.opponent}</TableCell>
                            <TableCell className="text-right font-semibold">${payment.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'}>{payment.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
)

export function TeamDetailsClient({
  team,
  players,
  matches,
  teamSanctions,
  futureMatches,
  finishedMatches,
  vocalPayments
}: {
  team: Team;
  players: Player[];
  matches: Match[];
  teamSanctions: Sanction[];
  futureMatches: Match[];
  finishedMatches: Match[];
  vocalPayments: any[];
}) {

  const { user } = useAuth();
  const activePlayers = useMemo(() => players.filter(p => p.status === 'activo'), [players]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="flex items-center gap-6">
          <Image
            src={team.logoUrl}
            alt={`Logo de ${team.name}`}
            width={128}
            height={128}
            className="rounded-full border-4 border-primary shadow-lg"
            data-ai-hint="team logo"
          />
          <div>
            <Badge>{team.category}</Badge>
            <h2 className="text-4xl font-bold font-headline mt-1">{team.name}</h2>
            <p className="text-muted-foreground">{team.president?.name || 'Presidente no asignado'}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" asChild>
            <Link href={`/teams/${team.id}/roster`}>
                <Printer className="mr-2 h-4 w-4" /> Nómina
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/teams/${team.id}/info`}>
                <BadgeInfo className="mr-2 h-4 w-4" /> Directiva
            </Link>
          </Button>
          {user.permissions.teams.edit && (
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Agregar Jugador</Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="roster" className="w-full">
        <TabsList>
          <TabsTrigger value="roster"><Users className="mr-2" />Plantilla</TabsTrigger>
          <TabsTrigger value="matches"><Calendar className="mr-2" />Partidos</TabsTrigger>
          <TabsTrigger value="finances"><DollarSign className="mr-2" />Finanzas</TabsTrigger>
        </TabsList>
        <TabsContent value="roster" className="mt-4">
          <RosterTab players={activePlayers} />
        </TabsContent>
        <TabsContent value="matches" className="mt-4">
            <MatchesTab teamId={team.id} matches={matches} />
        </TabsContent>
        <TabsContent value="finances" className="mt-4">
            <FinanceTab vocalPayments={vocalPayments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
