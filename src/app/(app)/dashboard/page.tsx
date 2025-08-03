

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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  achievements,
  dashboardStats,
  players,
  teams,
  standings,
  topScorers,
  sanctions,
  getRequalificationRequests,
  upcomingMatches,
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


const pieData = [
  { name: 'Amarillas', value: dashboardStats.yellowCards, color: 'hsl(var(--primary))' },
  { name: 'Rojas', value: dashboardStats.redCards, color: 'hsl(var(--destructive))' },
];

const sliderImages = [
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 1', hint: 'stadium lights' },
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 2', hint: 'soccer action' },
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 3', hint: 'team celebration' },
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 4', hint: 'fans cheering' },
]

function TopScorersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla de Goleadores</CardTitle>
        <CardDescription>
          Los máximos anotadores del torneo en todas las categorías.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="text-right">Goles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topScorers.map((scorer) => (
              <TableRow key={scorer.playerId}>
                <TableCell className="font-bold text-lg">
                  {scorer.rank}
                </TableCell>
                <TableCell>
                  <Link href={`/players/${scorer.playerId}`}>
                    <div className="flex items-center gap-3 cursor-pointer hover:underline">
                      <Avatar>
                        <AvatarImage src={scorer.playerPhotoUrl} alt={scorer.playerName} data-ai-hint="player portrait" />
                        <AvatarFallback>
                          {scorer.playerName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{scorer.playerName}</span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/teams/${scorer.teamId}`}>
                    <div className="flex items-center gap-2 cursor-pointer hover:underline">
                      <Image
                        src={`https://placehold.co/100x100.png`}
                        alt={scorer.teamName}
                        width={24}
                        height={24}
                        className="rounded-full"
                        data-ai-hint="team logo"
                      />
                      <span className="text-sm">{scorer.teamName}</span>
                    </div>
                  </Link>
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
        <CardTitle>Sanciones y Suspensiones</CardTitle>
        <CardDescription>
          Jugadores que actualmente cumplen una suspensión.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sanctions.map((sanction) => (
          <Card key={sanction.id} className="flex items-center p-4 gap-4 bg-muted/50">
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
          </Card>
        ))}
         {sanctions.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay jugadores sancionados actualmente.</p>
        )}
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const pendingRequests = useMemo(() => getRequalificationRequests().filter(r => r.status === 'pending'), []);
  
  const recentResults = useMemo(() => upcomingMatches.filter(m => m.status === 'finished').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,3), []);
  const nextMatches = useMemo(() => upcomingMatches.filter(m => m.status === 'future').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0,3), []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-transparent">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Inicio
        </h2>
      </div>

       <Card className="relative group">
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
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
            <Carousel
                className="w-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {sliderImages.map((image, index) => (
                        <CarouselItem key={index}>
                            <Card className="border-0 rounded-lg overflow-hidden">
                                <CardContent className="p-0">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        width={1200}
                                        height={400}
                                        className="w-full h-auto object-cover"
                                        data-ai-hint={image.hint}
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </Card>
      
        {isAdmin && pendingRequests.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Alertas y Notificaciones</CardTitle>
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

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-primary/10">
                <CardHeader>
                    <CardTitle>Resumen del Torneo</CardTitle>
                </CardHeader>
                 <CardContent className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                 </CardContent>
            </Card>
             <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle>Próximos Partidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {nextMatches.map(match => (
                         <div key={match.id} className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={20} height={20} className="rounded-full"/>
                                <span className="font-semibold">{match.teams.home.name}</span>
                            </div>
                            <Badge variant="outline">vs</Badge>
                             <div className="flex items-center gap-2">
                                <span className="font-semibold">{match.teams.away.name}</span>
                                <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={20} height={20} className="rounded-full"/>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle>Resultados Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                     {recentResults.map(match => (
                         <div key={match.id} className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={20} height={20} className="rounded-full"/>
                                <span className={cn("font-semibold", match.score && match.score.home > match.score.away && "text-primary")}>{match.teams.home.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-base">{match.score?.home} - {match.score?.away}</Badge>
                             <div className="flex items-center gap-2">
                                <span className={cn("font-semibold", match.score && match.score.away > match.score.home && "text-primary")}>{match.teams.away.name}</span>
                                <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={20} height={20} className="rounded-full"/>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Disciplina</CardTitle>
                     <CardDescription>Tarjetas en el torneo</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Logros del Club</CardTitle>
                </CardHeader>
                <CardContent>
                     {achievements.slice(0, 2).map((achievement, index) => (
                        <div key={index} className="flex items-center gap-4 mb-4">
                            <Image src={achievement.teamLogoUrl} alt={achievement.teamName} width={40} height={40} className="rounded-full" data-ai-hint="team logo" />
                            <div>
                                <p className="font-semibold">{achievement.teamName}</p>
                                <p className="text-sm text-amber-400 flex items-center gap-1"><Trophy className="w-4 h-4"/> {achievement.achievement} {achievement.year}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopScorersCard />
        <SanctionsCard />
      </div>

    </div>
  );
}
