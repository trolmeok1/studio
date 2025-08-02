
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { topScorers, sanctions } from '@/lib/mock-data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ShieldBan } from 'lucide-react';

function TopScorersTab() {
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

function SanctionsTab() {
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
                    Sancionado el: {new Date(sanction.date).toLocaleDateString()}
                </p>
             </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Reportes del Torneo
      </h2>

      <Tabs defaultValue="scorers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scorers">Tabla de Goleadores</TabsTrigger>
          <TabsTrigger value="sanctions">Sanciones y Suspensiones</TabsTrigger>
        </TabsList>
        <TabsContent value="scorers">
          <TopScorersTab />
        </TabsContent>
        <TabsContent value="sanctions">
          <SanctionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
