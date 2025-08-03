
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
import { useState, useEffect } from 'react';

const barData = [
  { name: 'W1', value: 10 },
  { name: 'W2', value: 15 },
  { name: 'W3', value: 12 },
  { name: 'W4', value: 20 },
  { name: 'W5', value: 18 },
];

const pieData = [
  { name: 'A', value: 2768, color: '#f59e0b' },
  { name: 'B', value: 335, color: '#ef4444' },
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
                <p className="text-xs text-muted-foreground mt-1">
                    Sancionado el: {isClient ? new Date(sanction.date).toLocaleDateString() : ''}
                </p>
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-transparent">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Visualiza el resumen de la información del campeonato
        </p>
      </div>

       <Card className="relative group">
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button size="sm">
                        <PlusCircle />
                        Agregar Imagen
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
      
        {isAdmin && (
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
                                <p className="text-sm">Tienes 2 nuevas solicitudes de recalificación que requieren tu aprobación.</p>
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

        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-blue-900/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border-blue-500/30">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-none bg-white/10 border-white/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CATEGORÍAS</CardTitle>
                    <List className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.categories}
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-none bg-white/10 border-white/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ETAPAS</CardTitle>
                    <Flag className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.stages}</div>
                  </CardContent>
                </Card>
                <Card className="shadow-none bg-white/10 border-white/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ÁRBITROS</CardTitle>
                    <UserSquare className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.referees}</div>
                  </CardContent>
                </Card>
                <Card className="shadow-none bg-white/10 border-white/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">MULTAS</CardTitle>
                    <Gavel className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${dashboardStats.fines}</div>
                  </CardContent>
                </Card>
            </div>
          </Card>

          <Card className="col-span-1 md:col-span-2 bg-blue-500/80 backdrop-blur-sm text-white border-blue-400/50">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-lg">Partidos Jugados</p>
                <p className="text-4xl font-bold">{dashboardStats.matchesPlayed}</p>
              </div>
              <div className="w-24 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <Bar dataKey="value" fill="#ffffff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/80 backdrop-blur-sm text-white border-green-400/50">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-lg">Goles Marcados</p>
                <p className="text-4xl font-bold">{dashboardStats.goalsScored}</p>
              </div>
              <Goal className="h-12 w-12 opacity-50" />
            </CardContent>
          </Card>
           <Card className="bg-yellow-500/80 backdrop-blur-sm text-white border-yellow-400/50">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-lg">T.A. Exhibidas</p>
                <p className="text-4xl font-bold">{dashboardStats.yellowCards}</p>
              </div>
               <RectangleHorizontal className="h-12 w-12 opacity-50 transform -rotate-45" />
            </CardContent>
          </Card>
            <Card className="bg-red-500/80 backdrop-blur-sm text-white border-red-400/50">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-lg">T.R. Exhibidas</p>
                <p className="text-4xl font-bold">{dashboardStats.redCards}</p>
              </div>
               <RectangleHorizontal className="h-12 w-12 opacity-50 transform -rotate-45"/>
            </CardContent>
          </Card>
          <Card className="bg-blue-400/80 backdrop-blur-sm text-white border-blue-300/50">
            <CardContent className="flex items-center justify-between p-4">
               <div>
                <p className="text-sm">EQUIPOS</p>
                <p className="text-2xl font-bold">Registrados</p>
              </div>
              <p className="text-4xl font-bold">{dashboardStats.teams.registered}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-400/80 backdrop-blur-sm text-white border-green-300/50">
             <CardContent className="flex items-center justify-between p-4">
               <div>
                <p className="text-sm">EQUIPOS</p>
                <p className="text-2xl font-bold">Aprobados</p>
              </div>
              <p className="text-4xl font-bold">{dashboardStats.teams.approved}</p>
            </CardContent>
          </Card>
           <Card className="bg-yellow-400/80 backdrop-blur-sm text-white border-yellow-300/50">
             <CardContent className="flex items-center justify-between p-4">
               <div>
                <p className="text-sm">EQUIPOS</p>
                <p className="text-2xl font-bold">Desaprobados</p>
              </div>
              <p className="text-4xl font-bold">{dashboardStats.teams.rejected}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-400/80 backdrop-blur-sm text-white border-red-300/50">
             <CardContent className="flex items-center justify-between p-4">
               <div>
                <p className="text-sm">EQUIPOS</p>
                <p className="text-2xl font-bold">Sancionados</p>
              </div>
              <p className="text-4xl font-bold">{dashboardStats.teams.sanctioned}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-green-500/80 backdrop-blur-sm text-white border-green-400/50">
            <CardContent className="p-4 flex justify-between items-center">
              <Check className="h-8 w-8" />
              <div>
                <p className="text-right">JUGADORES</p>
                <p className="text-3xl font-bold text-right">{dashboardStats.players.approved}</p>
                <p className="text-sm text-right">Aprobados</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/80 backdrop-blur-sm text-white border-blue-400/50">
            <CardContent className="p-4 flex justify-between items-center">
              <Plus className="h-8 w-8" />
               <div>
                <p className="text-right">JUGADORES</p>
                <p className="text-3xl font-bold text-right">{dashboardStats.players.new}</p>
                <p className="text-sm text-right">Nuevos</p>
              </div>
            </CardContent>
          </Card>
           <Card className="bg-yellow-500/80 backdrop-blur-sm text-white border-yellow-400/50">
            <CardContent className="p-4 flex justify-between items-center">
              <Ban className="h-8 w-8" />
               <div>
                <p className="text-right">JUGADORES</p>
                <p className="text-3xl font-bold text-right">{dashboardStats.players.rejected}</p>
                <p className="text-sm text-right">Rechazados</p>
              </div>
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
