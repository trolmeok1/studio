
'use client';

import { useState, useEffect } from 'react';
import { getTeamById, getPlayersByTeamId, type Player, type Team, type PlayerPosition, upcomingMatches, type Person } from '@/lib/mock-data';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Users, Calendar, BarChart2, Award, ShieldAlert, BadgeInfo, Building, CalendarClock, UserSquare, AlertTriangle, DollarSign, Upload, FileText, Phone, User as UserIcon } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const initialNewPlayerState = {
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: undefined as Date | undefined,
    position: '' as PlayerPosition | '',
    jerseyNumber: '',
    status: 'activo' as 'activo' | 'inactivo',
    statusReason: '',
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
        status: newPlayer.status,
        statusReason: newPlayer.statusReason,
      };
      setPlayers([...players, newPlayerData]);
      setNewPlayer(initialNewPlayerState);
      setIsDialogOpen(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, person, showContact }: { icon: React.ElementType, label: string, person?: Person, showContact: boolean }) => (
    <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
        <Icon className="w-5 h-5 text-primary mt-1" />
        <div className="flex-grow">
            <p className="font-semibold">{label}</p>
            <p className="text-muted-foreground">{person?.name || 'No asignado'}</p>
        </div>
        {showContact && person?.phone && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Phone className="w-4 h-4"/>
                <span>{person.phone}</span>
            </div>
        )}
    </div>
  );

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
                    <h2 className="text-4xl font-bold tracking-tight font-headline">{team.name}</h2>
                    <p className="text-lg text-primary">Representado por {team.manager || 'No asignado'}</p>
                    <Badge className="mt-2 text-md">{team.category}</Badge>
                </div>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="info"><BadgeInfo className="mr-2" />Información</TabsTrigger>
            <TabsTrigger value="roster"><Users className="mr-2" />Nómina</TabsTrigger>
            <TabsTrigger value="finances"><DollarSign className="mr-2" />Finanzas</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="mr-2" />Calendario</TabsTrigger>
            <TabsTrigger value="stats"><BarChart2 className="mr-2" />Estadísticas</TabsTrigger>
            <TabsTrigger value="sanctions"><ShieldAlert className="mr-2" />Sanciones</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
            <Card>
                <CardHeader>
                    <CardTitle>Información del Club</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <InfoRow icon={UserIcon} label="Presidente" person={team.president} showContact={canEdit} />
                         <InfoRow icon={UserIcon} label="Secretario" person={team.secretary} showContact={canEdit} />
                         <InfoRow icon={UserIcon} label="Tesorero" person={team.treasurer} showContact={canEdit} />
                         <InfoRow icon={UserIcon} label="Vocal Principal" person={team.vocal} showContact={canEdit} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2 mt-4">Delegados Autorizados</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {team.delegates?.map((delegate, index) => (
                                <InfoRow key={index} icon={UserSquare} label={`Delegado ${index + 1}`} person={delegate} showContact={canEdit} />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="roster">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Plantilla de Jugadores ({players.length})</CardTitle>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                         <Button size="sm" variant="outline" asChild>
                            <Link href={`/teams/${teamId}/roster`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Descargar Nómina
                            </Link>
                        </Button>
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
                              <div className="space-y-2">
                                <Label>Estado del Jugador</Label>
                                <RadioGroup
                                    value={newPlayer.status}
                                    onValueChange={(value: 'activo' | 'inactivo') => setNewPlayer({ ...newPlayer, status: value })}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="activo" id="status-active" />
                                        <Label htmlFor="status-active">Entrante (Activo)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="inactivo" id="status-inactive" />
                                        <Label htmlFor="status-inactive">Saliente (Inactivo)</Label>
                                    </div>
                                </RadioGroup>
                                </div>
                                {newPlayer.status === 'inactivo' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="statusReason">Razón de Salida</Label>
                                        <Textarea
                                            id="statusReason"
                                            value={newPlayer.statusReason}
                                            onChange={(e) => setNewPlayer({ ...newPlayer, statusReason: e.target.value })}
                                            placeholder="Ej: Transferencia a otro club, retiro, etc."
                                        />
                                    </div>
                                )}
                            </div>
                            <Button onClick={handleAddPlayer} className="w-full" size="lg">Guardar Jugador</Button>
                          </DialogContent>
                        </Dialog>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                   <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {players.map((player) => (
                      <Card key={player.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg">
                        <CardHeader className="p-0 relative">
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
                           <Badge className={cn(
                               "absolute top-2 right-2",
                               player.status === 'activo' ? 'bg-green-600' : 'bg-destructive'
                           )}>
                                {player.status === 'activo' ? 'Activo' : 'Inactivo'}
                           </Badge>
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
