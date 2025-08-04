

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  achievements,
  dashboardStats,
  players,
  teams,
  standings,
  topScorers as initialTopScorers,
  sanctions,
  getRequalificationRequests,
  upcomingMatches,
  getTeamsByCategory,
  type Category,
  type Standing,
} from '@/lib/mock-data';
import {
  Users,
  Shield,
  Trophy,
  Swords,
  Calendar,
  List,
  Flag,
  UserSquare,
  Gavel,
  Check,
  Plus,
  Ban,
  FilePen,
  BarChart2,
  Goal,
  RectangleHorizontal,
  PlusCircle,
  Pencil,
  ShieldBan,
  ArrowRight,
  AlertCircle,
  Crown,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const sliderImages = [
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 1' },
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 2' },
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 3' },
]

function TopScorersCard() {
  const topFiveScorers = useMemo(() => initialTopScorers.slice(0, 5), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase">Tabla de Goleadores</CardTitle>
        <CardDescription>
          Los 5 máximos anotadores del torneo en todas las categorías.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead className="text-right">Goles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topFiveScorers.map((scorer, index) => (
              <TableRow key={scorer.playerId}>
                <TableCell className="font-bold text-lg">
                  {scorer.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={scorer.playerPhotoUrl} alt={scorer.playerName} data-ai-hint="player portrait" />
                        <AvatarFallback>
                          {scorer.playerName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Link href={`/players/${scorer.playerId}`} className="font-medium hover:underline flex items-center gap-2">
                            <span>{scorer.playerName}</span>
                            {index === 0 && <Crown className="h-5 w-5 text-amber-400" />}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                             <Image
                                src={teams.find(t => t.id === scorer.teamId)?.logoUrl || `https://placehold.co/100x100.png`}
                                alt={scorer.teamName}
                                width={16}
                                height={16}
                                className="rounded-full"
                                data-ai-hint="team logo"
                            />
                            <Link href={`/teams/${scorer.teamId}`} className="hover:underline">
                                <span>{scorer.teamName}</span>
                            </Link>
                        </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  {scorer.goals}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SanctionsCard() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase">Sanciones y Suspensiones</CardTitle>
        <CardDescription>
          Jugadores que actualmente cumplen una suspensión.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {sanctions.map((sanction) => (
              <Card key={sanction.id} className="p-0">
                <div className="flex items-center p-4 gap-4 bg-muted/50">
                   <Avatar className="h-16 w-16">
                      <AvatarImage src={sanction.playerPhotoUrl} alt={sanction.playerName} data-ai-hint="player portrait" />
                      <AvatarFallback>
                          {sanction.playerName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                   </Avatar>
                   <div className="flex-grow">
                      <p className="font-bold text-lg">{sanction.playerName}</p>
                      <p className="text-sm text-muted-foreground">{sanction.teamName}</p>
                      <p className="text-sm mt-1">{sanction.reason}</p>
                   </div>
                   <div className="text-center">
                      <Badge variant="destructive" className="text-lg">
                          <ShieldBan className="mr-2" />
                          {sanction.gamesSuspended} Partido(s)
                      </Badge>
                      {isClient && <p className="text-xs text-muted-foreground mt-1">
                          Sancionado el: {new Date(sanction.date).toLocaleDateString()}
                      </p>}
                   </div>
                </div>
              </Card>
            ))}
             {sanctions.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No hay jugadores sancionados actualmente.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

function BestTeamsCard() {
    const categories: Category[] = ['Máxima', 'Primera', 'Segunda'];

    const getTopTeams = (category: Category) => {
        const categoryTeams = teams.filter(t => t.category === category);
        const categoryStandings = standings
            .filter(s => categoryTeams.some(t => t.id === s.teamId))
            .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
            .slice(0, 2);

        return categoryStandings.map(s => ({
            ...s,
            teamLogoUrl: teams.find(t => t.id === s.teamId)?.logoUrl || 'https://placehold.co/100x100.png'
        }));
    };
    
    const renderTeam = (team: Standing, rank: number) => (
        <div key={team.teamId} className={cn("flex flex-col items-center gap-2 p-3 text-center", rank === 1 ? "scale-105" : "")}>
            <Trophy className={cn("h-7 w-7", rank === 1 ? "text-amber-400" : "text-slate-400")} />
            <Image src={team.teamLogoUrl || ''} alt={team.teamName} width={rank === 1 ? 80 : 64} height={rank === 1 ? 80 : 64} className="rounded-full" data-ai-hint="team logo" />
            <div className="flex-grow">
                <p className={cn("font-bold", rank === 1 ? "text-lg" : "text-md")}>{team.teamName}</p>
                <p className="text-xs text-muted-foreground">{team.points} PTS | {team.goalsFor - team.goalsAgainst} GD</p>
            </div>
        </div>
    );
    
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
            <CardHeader>
                <CardTitle className="text-center uppercase tracking-wider">MEJORES EQUIPOS</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map(category => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="text-center text-primary">{category}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-end gap-4 p-3">
                            {getTopTeams(category).length > 0 ? getTopTeams(category).map((team, index) => renderTeam(team, index + 1)) : <p className="text-sm text-muted-foreground text-center h-48 flex items-center">No hay datos.</p>}
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const pendingRequests = useMemo(() => getRequalificationRequests().filter(r => r.status === 'pending'), []);
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                Inicio
                </span>
            </h2>
        </div>

       <Card className="relative group">
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button size="sm" asChild>
                       <label htmlFor="carousel-upload" className="cursor-pointer">
                           <PlusCircle />
                           Agregar Imagen
                           <Input id="carousel-upload" type="file" className="hidden" />
                       </label>
                    </Button>
                     <Button size="sm" variant="secondary">
                        <Pencil />
                        Editar Galería
                    </Button>
                </div>
            )}
            <Carousel className="w-full">
                <CarouselContent>
                    {sliderImages.map((image, index) => (
                        <CarouselItem key={index}>
                            <Card>
                                <CardContent className="p-0">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        width={1200}
                                        height={400}
                                        className="w-full h-auto object-cover"
                                        data-ai-hint="stadium lights"
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
        </Card>
      
        {isAdmin && pendingRequests.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="uppercase">Alertas y Notificaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-amber-500/10 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md" role="alert">
                        <div className="flex items-start">
                            <AlertCircle className="h-6 w-6 mr-3 mt-1"/>
                            <div className="flex-grow">
                                <p className="font-bold">Solicitudes Pendientes</p>
                                <p className="text-sm">Tienes {pendingRequests.length} nuevas solicitudes de recalificación que requieren tu aprobación.</p>
                                <Button variant="link" className="p-0 h-auto text-amber-700 font-bold mt-1" asChild>
                                    <Link href="/requests/requalification">
                                        Revisar ahora <ArrowRight className="ml-2"/>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

        <div className="lg:col-span-8 space-y-4">
             <BestTeamsCard />
             <Card>
                <CardHeader>
                    <CardTitle className="uppercase">Resumen del Torneo</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary"/>
                            <div>
                                <p className="text-2xl font-bold">{dashboardStats.players.approved}</p>
                                <p className="text-sm text-muted-foreground">Jugadores</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-primary"/>
                            <div>
                                <p className="text-2xl font-bold">{dashboardStats.teams.approved}</p>
                                <p className="text-sm text-muted-foreground">Equipos</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <Swords className="h-8 w-8 text-primary"/>
                            <div>
                                <p className="text-2xl font-bold">{dashboardStats.matchesPlayed}</p>
                                <p className="text-sm text-muted-foreground">Partidos</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <Goal className="h-8 w-8 text-primary"/>
                            <div>
                                <p className="text-2xl font-bold">{dashboardStats.goalsScored}</p>
                                <p className="text-sm text-muted-foreground">Goles</p>
                            </div>
                        </div>
                    </div>
                 </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
             <TopScorersCard />
        </div>
      </div>
      
      <SanctionsCard />
    </div>
  );
}
