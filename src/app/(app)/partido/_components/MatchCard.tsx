'use client';

import type { Match, MatchEvent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Goal, Download } from 'lucide-react';

interface MatchCardProps {
    match: Match;
}

const getEventBadge = (event: MatchEvent['event']) => {
    switch(event) {
        case 'goal': return <Badge variant="default" className="bg-green-500">GOL</Badge>;
        case 'yellow_card': return <Badge variant="secondary" className="bg-yellow-400 text-black">T.A.</Badge>;
        case 'red_card': return <Badge variant="destructive">T.R.</Badge>;
        case 'assist': return <Badge variant="secondary">ASISTENCIA</Badge>;
    }
}


export function MatchCard({ match }: MatchCardProps) {
    const { teams, score, events, refereeName, vocalName, physicalSheetUrl } = match;
    const homeTeam = teams.home;
    const awayTeam = teams.away;

    const homeScore = score?.home ?? 0;
    const awayScore = score?.away ?? 0;

    const isHomeWinner = homeScore > awayScore;
    const isAwayWinner = awayScore > homeScore;
    const isDraw = homeScore === awayScore;

    const TeamDisplay = ({ team, score, isWinner }: { team: typeof homeTeam, score: number, isWinner: boolean }) => (
        <div className="flex flex-col items-center gap-2 text-center w-28">
            <Link href={`/teams/${team.id}`} className="hover:opacity-80 transition-opacity">
                <Image
                    src={team.logoUrl}
                    alt={team.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                    data-ai-hint="team logo"
                />
            </Link>
            <p className={cn("font-semibold leading-tight", isWinner && "text-primary")}>{team.name}</p>
        </div>
    );


    return (
        <Card className="p-4 flex flex-col gap-3">
            <CardContent className="p-0 flex items-center justify-around">
                <TeamDisplay team={homeTeam} score={homeScore} isWinner={isHomeWinner} />

                <div className="text-center">
                    <div className="flex items-center gap-3">
                        <span className={cn("text-3xl font-bold", isHomeWinner && "text-primary")}>
                            {homeScore}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className={cn("text-3xl font-bold", isAwayWinner && "text-primary")}>
                            {awayScore}
                        </span>
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">Finalizado</p>
                </div>

                <TeamDisplay team={awayTeam} score={awayScore} isWinner={isAwayWinner} />
            </CardContent>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-fit mx-auto">Ver Ficha del Partido</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Ficha del Partido: {homeTeam.name} vs {awayTeam.name}</DialogTitle>
                        <DialogDescription>
                            Resumen de los datos y eventos registrados en la vocalía digital.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Detalles del Partido</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                    <User className="w-5 h-5 text-primary"/>
                                    <div>
                                        <p className="text-muted-foreground">Árbitro</p>
                                        <p className="font-semibold">{refereeName || 'No registrado'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                    <User className="w-5 h-5 text-primary"/>
                                    <div>
                                        <p className="text-muted-foreground">Vocal de Turno</p>
                                        <p className="font-semibold">{vocalName || 'No registrado'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader className="pb-2">
                                <CardTitle className="text-base">Acta Física (Evidencia)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {physicalSheetUrl ? (
                                    <div className="space-y-2">
                                        <Image src={physicalSheetUrl} alt="Acta física del partido" width={300} height={400} className="rounded-md border object-contain" />
                                        <Button asChild size="sm">
                                            <a href={physicalSheetUrl} download={`acta_${match.id}.jpg`}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Descargar
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-10">No se subió imagen del acta física.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 mt-4">Eventos del Partido</h4>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Jugador</TableHead>
                                    <TableHead>Equipo</TableHead>
                                    <TableHead>Evento</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events && events.length > 0 ? events.map(event => (
                                    <TableRow key={event.id}>
                                        <TableCell>{event.playerName}</TableCell>
                                        <TableCell>{event.teamName}</TableCell>
                                        <TableCell>{getEventBadge(event.event)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">No se registraron eventos.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
