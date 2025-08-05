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
import Autoplay from "embla-carousel-autoplay"


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  dashboardStats,
  players,
  teams,
  standings,
  getTopScorers,
  sanctions,
  getRequalificationRequests,
  type Category,
  type Standing,
  type RequalificationRequest,
  type Scorer,
} from '@/lib/mock-data';
import {
  Users,
  Shield,
  Trophy,
  Swords,
  Goal,
  ShieldBan,
  ArrowRight,
  AlertCircle,
  Crown,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React, { useMemo, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const sliderImages = [
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 1', hint: 'stadium lights' },
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 2', hint: 'soccer ball grass' },
    { src: 'https://placehold.co/1200x400.png', alt: 'Slider Image 3', hint: 'fans cheering' },
];

function AdminAlerts({ pendingRequests }: { pendingRequests: RequalificationRequest[] }) {
  const { user } = useAuth();
  const hasEditPermission = user.permissions.requests.edit;

  if (!hasEditPermission || pendingRequests.length === 0) {
    return null;
  }

  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Acciones Pendientes</AlertTitle>
      <AlertDescription>
        <div className="flex items-center justify-between">
            <p>
                Tienes <span className="font-bold">{pendingRequests.length}</span> solicitud(es) de recalificación pendientes de revisión.
            </p>
            <Button asChild size="sm">
                <Link href="/requests/requalification">
                    Revisar Solicitudes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

function DashboardCarousel({ images }: { images: {src: string, alt: string, hint: string}[]}) {
    return (
         <Carousel 
            className="w-full"
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            opts={{ loop: true }}
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <Card className="overflow-hidden">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={1200}
                                height={400}
                                className="w-full aspect-[3/1] object-cover"
                                data-ai-hint={image.hint}
                            />
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
    );
}

function TopScorersCard() {
  const [topScorers, setTopScorers] = useState<Scorer[]>([]);

    useEffect(() => {
        async function loadScorers() {
            const scorersData = await getTopScorers();
            setTopScorers(scorersData.slice(0, 5));
        }
        loadScorers();
    }, []);

  return (
    <Card className="bg-gray-900/70 text-white overflow-hidden" style={{ backgroundImage: `url('/field-bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-black/60 backdrop-blur-sm p-6 h-full">
        <CardHeader className="text-center p-0 mb-4">
          <CardTitle className="text-4xl font-extrabold tracking-wider uppercase">Goleadores</CardTitle>
          <CardDescription className="text-white/80">Máximos anotadores del torneo</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {topScorers.map((scorer, index) => (
              <div key={scorer.playerId} className="flex items-center bg-white/10 p-2 rounded-md">
                <div className="w-8 text-center font-bold text-lg">{scorer.rank}</div>
                <div className="w-10 h-10 flex items-center justify-center">
                    <Image
                        src={teams.find(t => t.id === scorer.teamId)?.logoUrl || `https://placehold.co/100x100.png`}
                        alt={scorer.teamName}
                        width={28}
                        height={28}
                        className="rounded-full"
                        data-ai-hint="team logo"
                    />
                </div>
                <div className="flex-grow ml-2">
                  <p className="font-bold flex items-center gap-2">
                    {scorer.playerName}
                    {index === 0 && <Crown className="h-5 w-5 text-amber-400" />}
                  </p>
                   <p className="text-xs text-white/70">{scorer.teamName}</p>
                </div>
                <div className={cn(
                    "w-16 h-12 flex items-center justify-center rounded-md text-xl font-bold",
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-white/20"
                )}>
                  {scorer.goals}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function SanctionsCard() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const formattedSanctions = useMemo(() => {
        if (!isClient) return sanctions;
        return sanctions.map(s => ({
            ...s,
            formattedDate: s.date ? format(new Date(s.date), 'dd/MM/yyyy', { locale: es }) : 'N/A'
        }));
    }, [isClient]);

  return (
    <Card neon="yellow">
      <CardHeader>
        <CardTitle className="uppercase">Sanciones y Suspensiones</CardTitle>
        <CardDescription>
          Jugadores que actualmente cumplen una suspensión.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {formattedSanctions.map((sanction) => (
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
                       <p className="text-xs text-muted-foreground mt-1">
                          Sancionado el: {sanction.formattedDate}
                      </p>
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
                    <Card key={category} neon="purple">
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
  const [pendingRequests, setPendingRequests] = useState<RequalificationRequest[]>([]);

    useEffect(() => {
        async function loadRequests() {
            const allRequests = await getRequalificationRequests();
            setPendingRequests(allRequests.filter(r => r.status === 'pending'));
        }
        loadRequests();
    }, []);
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                Inicio
                </span>
            </h2>
        </div>

       <DashboardCarousel images={sliderImages} />
      
       <AdminAlerts pendingRequests={pendingRequests} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
             <BestTeamsCard />
             <Card neon="blue">
                <CardHeader>
                    <CardTitle className="uppercase">TORNEO DE LA LIGA</CardTitle>
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
