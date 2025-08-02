
'use client';

import { useState, useEffect } from 'react';
import { getTeamById, getPlayersByTeamId, type Player, type Team, type PlayerPosition, upcomingMatches } from '@/lib/mock-data';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Users, Calendar, BarChart2, Award, ShieldAlert, BadgeInfo, Building, CalendarClock, UserSquare, AlertTriangle, DollarSign, Upload, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const initialNewPlayerState = {
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: undefined as Date | undefined,
    position: '' as PlayerPosition | '',
    jerseyNumber: '',
};

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = typeof params.id === 'string' ? params.id : '';
  const { user } = useAuth();
  const canEdit = user.role === 'admin';

  const [team, setTeam] = useState<Team | undefined>(undefined);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState(initialNewPlayerState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchedTeam = getTeamById(teamId);
    if (fetchedTeam) {
      setTeam(fetchedTeam);
      setPlayers(getPlayersByTeamId(teamId));
    }
  }, [teamId]);

  if (!team) {
    // This could be a loading state in a real app
    return <div>Cargando...</div>;
  }

  const handleAddPlayer = () => {
    if (newPlayer.firstName && newPlayer.lastName && newPlayer.position && newPlayer.birthDate) {
      const newPlayerData: Player = {
        id: `p${Date.now()}`,
        name: `${newPlayer.firstName} ${newPlayer.lastName}`,
        position: newPlayer.position as PlayerPosition,
        team: team.name,
        teamId: team.id,
        category: team.category,
        photoUrl: 'https://placehold.co/400x400.png',
        stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        idNumber: newPlayer.idNumber,
        birthDate: newPlayer.birthDate.toISOString().split('T')[0],
        jerseyNumber: parseInt(newPlayer.jerseyNumber) || 0,
      };
      setPlayers([...players, newPlayerData]);
      setNewPlayer(initialNewPlayerState);
      setIsDialogOpen(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    <div className="flex items-center gap-4 text-sm">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-semibold w-28">{label}:</span>
        <span>{value || 'No disponible'}</span>
    </div>
  );
  
  const foundationDateFormatted = isClient && team.foundationDate ? format(new Date(team.foundationDate), "MMMM dd, yyyy", { locale: es }) : '';
  const foundationDateFormattedPPP = isClient && team.foundationDate ? format(new Date(team.foundationDate), "PPP", { locale: es }) : '';

  const pendingPayments = upcomingMatches.filter(match => 
    (match.teams.home.id === teamId && match.teams.home.vocalPaymentDetails?.paymentStatus === 'pending') ||
    (match.teams.away.id === teamId && match.teams.away.vocalPaymentDetails?.paymentStatus === 'pending')
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
                 <Image
                    src={team.logoUrl}
                    alt={`Logo de ${team.name}`}
                    width={150}
                    height={150}
                    className="rounded-lg border-4 border-primary object-cover"
                    data-ai-hint="team logo"
                />
                <div className="flex-grow text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                        Fundado en {foundationDateFormatted || 'N/A'}
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight font-headline">{team.name}</h2>
                    <p className="text-lg text-primary">Representado por {team.manager || 'No asignado'}</p>
                    <Badge className="mt-2 text-md">{team.category}</Badge>
                </div>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="info"><BadgeInfo className="mr-2" />Información</TabsTrigger>
            <TabsTrigger value="roster"><Users className="mr-2" />Nómina</TabsTrigger>
            <TabsTrigger value="finances"><DollarSign className="mr-2" />Finanzas</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="mr-2" />Calendario</TabsTrigger>
            <TabsTrigger value="stats"><BarChart2 className="mr-2" />Estadísticas</TabsTrigger>
            <TabsTrigger value="results"><Award className="mr-2" />Resultados</TabsTrigger>
            <TabsTrigger value="sanctions"><ShieldAlert className="mr-2" />Sanciones</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
            <Card>
                <CardHeader>
                    <CardTitle>Información del Club</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow icon={Building} label="Nombre" value={team.name} />
                    <InfoRow icon={BadgeInfo} label="Abreviatura" value={team.abbreviation} />
                    <InfoRow icon={CalendarClock} label="Fundación" value={foundationDateFormattedPPP} />
                    <InfoRow icon={UserSquare} label="Dirigente" value={team.manager} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="roster">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Plantilla de Jugadores ({players.length})</CardTitle>
                  {canEdit && (
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Agregar Jugador
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Jugador a {team.name}</DialogTitle>
                           <DialogDescription>
                            Completa los datos del jugador. Los campos de la cédula solo serán visibles para administradores.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="firstName">Nombres</Label>
                                <Input id="firstName" value={newPlayer.firstName} onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })} placeholder="Nombres" />
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="lastName">Apellidos</Label>
                                <Input id="lastName" value={newPlayer.lastName} onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })} placeholder="Apellidos" />
                            </div>
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor="idNumber">Número de Cédula</Label>
                            <Input id="idNumber" value={newPlayer.idNumber} onChange={(e) => setNewPlayer({ ...newPlayer, idNumber: e.target.value })} placeholder="1234567890" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !newPlayer.birthDate && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newPlayer.birthDate ? format(newPlayer.birthDate, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarPicker
                                            mode="single"
                                            selected={newPlayer.birthDate}
                                            onSelect={(date) => setNewPlayer({ ...newPlayer, birthDate: date })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                             </div>
                              <div className="space-y-2">
                                <Label htmlFor="jerseyNumber">No. Camiseta</Label>
                                <Input id="jerseyNumber" type="number" value={newPlayer.jerseyNumber} onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })} placeholder="10" />
                             </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Posición</Label>
                             <Select onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value as PlayerPosition })} value={newPlayer.position}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una posición" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Portero">Portero</SelectItem>
                                <SelectItem value="Defensa">Defensa</SelectItem>
                                <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                                <SelectItem value="Delantero">Delantero</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                           <div className="space-y-2">
                                <Label htmlFor="photoUrl">Foto de Perfil</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="photoUrl" type="file" className="flex-grow" />
                                    <Button variant="ghost" size="icon"><Upload className="h-5 w-5"/></Button>
                                </div>
                          </div>
                           <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-dashed">
                                <Label htmlFor="idCardUrl">Cédula Completa (Administrativo)</Label>
                                 <div className="flex items-center gap-2">
                                    <Input id="idCardUrl" type="file" className="flex-grow" />
                                     <Button variant="ghost" size="icon"><FileText className="h-5 w-5"/></Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Imagen rectangular. Visible solo para administradores.</p>
                          </div>

                        </div>
                        <Button onClick={handleAddPlayer} className="w-full" size="lg">Guardar Jugador</Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                   <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {players.map((player) => (
                      <Card key={player.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg">
                        <CardHeader className="p-0">
                           <Link href={`/players/${player.id}`}>
                            <Image
                              src={player.photoUrl}
                              alt={`Foto de ${player.name}`}
                              width={400}
                              height={400}
                              className="w-full h-auto aspect-square object-cover"
                              data-ai-hint="player portrait"
                            />
                           </Link>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                          <h3 className="text-xl font-bold font-headline mt-2">{player.name}</h3>
                           <p className="text-sm text-muted-foreground">{player.position}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
        </TabsContent>
        <TabsContent value="finances">
            <Card>
                <CardHeader><CardTitle>Estado Financiero</CardTitle></CardHeader>
                <CardContent>
                    {pendingPayments.length > 0 ? (
                        <div className="space-y-4">
                            {pendingPayments.map(match => {
                                const details = match.teams.home.id === teamId ? match.teams.home.vocalPaymentDetails : match.teams.away.vocalPaymentDetails;
                                const opponent = match.teams.home.id === teamId ? match.teams.away : match.teams.home;
                                return (
                                <Card key={match.id} className="bg-destructive/10 border-destructive">
                                    <CardHeader className="flex-row items-center justify-between pb-2">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="text-destructive"/>
                                            <CardTitle className="text-lg">Pago de Vocalía Pendiente</CardTitle>
                                        </div>
                                         <Badge variant="destructive">DEUDA</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Partido contra <strong>{opponent.name}</strong></p>
                                        <p>Fecha: {isClient ? new Date(match.date).toLocaleDateString() : ''}</p>
                                        <p className="text-2xl font-bold mt-2 text-destructive">${details?.total.toFixed(2)}</p>
                                        <Button className="mt-2" asChild>
                                            <Link href="/committees">Ir a Pagar</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">El equipo está al día con sus pagos.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="calendar">
            <Card>
                <CardHeader><CardTitle>Calendario</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="stats">
            <Card>
                <CardHeader><CardTitle>Estadísticas</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="results">
            <Card>
                <CardHeader><CardTitle>Resultados</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="sanctions">
            <Card>
                <CardHeader><CardTitle>Sanciones</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
