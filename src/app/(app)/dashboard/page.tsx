
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
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

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
      
      <Card className="lg:col-span-7 bg-white/5 backdrop-blur-sm border-white/10 text-white">
          <CardHeader>
            <CardTitle className="font-headline">Logros</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             {achievements.map((achievement) => (
                <div key={achievement.teamName} className="flex flex-col items-center text-center">
                    <Image src={achievement.teamLogoUrl} alt={achievement.teamName} width={80} height={80} data-ai-hint="team logo" />
                    <p className="font-bold mt-2">{achievement.teamName}</p>
                    <p className="text-sm text-blue-400">{achievement.achievement}</p>
                    <p className="text-xs text-white/60">{achievement.category}</p>
                    <p className="text-xs text-white/60">{achievement.year}</p>
                </div>
             ))}
          </CardContent>
        </Card>
    </div>
  );
}

    