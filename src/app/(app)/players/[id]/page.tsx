

import { getPlayerById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Trophy, Shield, Goal, Handshake, CreditCard, User, Cake, Shirt, UserCheck, UserX, Star, ShieldAlert, History } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function PlayerProfilePage({ params }: { params: { id: string } }) {
  const player = getPlayerById(params.id);

  if (!player) {
    notFound();
  }
  
  const statusIsActive = player.status === 'activo';

  const getAge = (birthDateString: string) => {
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  }

  const age = getAge(player.birthDate);
  const ageCategory = age < 19 ? 'Juvenil' : 'Mayor';
  const averageFoulsPerGame = player.stats.yellowCards + player.stats.redCards > 0 ? ((player.stats.yellowCards + player.stats.redCards) / 20).toFixed(2) : '0.00';


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden sticky top-8">
            <div className="relative">
                 <Image
                  src={player.photoUrl}
                  alt={`Perfil de ${player.name}`}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover aspect-[4/5]"
                  data-ai-hint="player portrait"
                />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-6 text-white">
                    <p className="text-3xl font-bold font-headline">{player.name}</p>
                    <p className="text-lg text-primary">{player.team}</p>
                </div>
                 <div className="absolute top-4 right-4 bg-background/80 text-foreground rounded-full h-16 w-16 flex items-center justify-center text-4xl font-bold shadow-lg">
                    {player.jerseyNumber}
                </div>
            </div>
            <CardContent className="p-6 text-center">
              <Button asChild size="lg" className="w-full">
                <Link href={`/players/${player.id}/id-card`}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Ver Carnet Digital
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">

           <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <User /> Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Cake className="h-6 w-6 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                        <p className="font-semibold">{player.birthDate} ({age} años)</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Star className="h-6 w-6 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Categoría de Edad</p>
                        <p className="font-semibold">{ageCategory}</p>
                    </div>
                </div>
              </div>
                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: statusIsActive ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--destructive) / 0.1)' }}>
                  {statusIsActive ? <UserCheck className="h-6 w-6 text-primary mt-1" /> : <UserX className="h-6 w-6 text-destructive mt-1" />}
                  <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <p className="font-semibold">{statusIsActive ? 'Activo (Entrante)' : 'Inactivo (Saliente)'}</p>
                      {!statusIsActive && player.statusReason && (
                          <p className="text-xs text-muted-foreground mt-1">
                              <strong>Razón:</strong> {player.statusReason}
                          </p>
                      )}
                  </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Trophy /> Estadísticas de la Temporada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Goal className="mx-auto h-8 w-8 text-primary" />
                  <p className="text-3xl font-bold mt-2">{player.stats.goals}</p>
                  <p className="text-sm text-muted-foreground">Goles</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Handshake className="mx-auto h-8 w-8 text-primary" />
                  <p className="text-3xl font-bold mt-2">{player.stats.assists}</p>
                  <p className="text-sm text-muted-foreground">Asistencias</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="inline-block bg-yellow-400 h-8 w-6 rounded-sm mx-auto"></div>
                  <p className="text-3xl font-bold mt-2">{player.stats.yellowCards}</p>
                  <p className="text-sm text-muted-foreground">Tarjetas Amarillas</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="inline-block bg-red-600 h-8 w-6 rounded-sm mx-auto"></div>
                  <p className="text-3xl font-bold mt-2">{player.stats.redCards}</p>
                  <p className="text-sm text-muted-foreground">Tarjetas Rojas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <ShieldAlert /> Comportamiento Disciplinario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faltas Totales</TableHead>
                    <TableHead>Partidos Jugados</TableHead>
                    <TableHead>Promedio Faltas/Partido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{player.stats.yellowCards + player.stats.redCards}</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>{averageFoulsPerGame}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <History /> Trayectoria en la Liga
              </CardTitle>
            </CardHeader>
            <CardContent>
                {player.careerHistory && player.careerHistory.length > 0 ? (
                    <div className="space-y-4">
                        {player.careerHistory.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-semibold">{entry.teamName}</p>
                                    <p className="text-sm text-muted-foreground">{entry.startDate} - {entry.endDate || 'Presente'}</p>
                                </div>
                                <Badge variant={entry.endDate ? 'outline' : 'default'}>{entry.endDate ? 'Anterior' : 'Actual'}</Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No hay historial de equipos anteriores para este jugador.</p>
                )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
