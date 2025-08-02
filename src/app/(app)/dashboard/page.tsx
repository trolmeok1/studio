import {
  Card,
  CardContent,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { players, teams, standings, topScorers, sanctions } from '@/lib/mock-data';
import { Users, Shield, Trophy, Swords, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Dashboard del Torneo
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jugadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
            <p className="text-xs text-muted-foreground">Registrados en todas las categorías</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">Compitiendo esta temporada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidos Jugados</CardTitle>
            <Swords className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">En todos los torneos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Jornada</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 de Julio, 2024</div>
            <p className="text-xs text-muted-foreground">Partidos del fin de semana</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Tabla de Posiciones (Máxima)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Pos</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead className="text-center">PJ</TableHead>
                  <TableHead className="text-center">G</TableHead>
                  <TableHead className="text-center">E</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((team) => (
                  <TableRow key={team.teamId}>
                    <TableCell className="font-medium">{team.rank}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                        <Image src={team.teamLogoUrl} alt={team.teamName} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                        <span>{team.teamName}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">{team.played}</TableCell>
                    <TableCell className="text-center">{team.wins}</TableCell>
                    <TableCell className="text-center">{team.draws}</TableCell>
                    <TableCell className="text-center">{team.losses}</TableCell>
                    <TableCell className="text-right font-bold">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Goleadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topScorers.map((scorer) => (
                <div key={scorer.playerName} className="flex items-center">
                  <span className="font-bold text-lg mr-4">{scorer.rank}.</span>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={scorer.playerName} data-ai-hint="player avatar"/>
                    <AvatarFallback>{scorer.playerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{scorer.playerName}</p>
                    <p className="text-sm text-muted-foreground">{scorer.teamName}</p>
                  </div>
                  <div className="ml-auto font-medium">{scorer.goals} Goles</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="font-headline">Sanciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {sanctions.map((sanction) => (
                <div key={sanction.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50">
                  <Shield className="h-5 w-5 text-destructive mr-4" />
                  <div className="flex-1">
                    <p className="font-semibold">{sanction.playerName} <span className="text-muted-foreground font-normal">({sanction.teamName})</span></p>
                    <p className="text-sm text-muted-foreground">{sanction.reason}</p>
                  </div>
                   <Badge variant="destructive" className="ml-auto">{sanction.gamesSuspended} {sanction.gamesSuspended > 1 ? 'Partidos' : 'Partido'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
