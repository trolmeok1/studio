import { getPlayerById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Trophy, Shield, Goal, Handshake, CreditCard } from 'lucide-react';

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
  const player = getPlayerById(params.id);

  if (!player) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden sticky top-8">
            <Image
              src={player.photoUrl}
              alt={`Perfil de ${player.name}`}
              width={600}
              height={600}
              className="w-full h-auto object-cover"
              data-ai-hint="player portrait"
            />
            <CardContent className="p-6 text-center">
              <h1 className="text-3xl font-bold font-headline">{player.name}</h1>
              <p className="text-lg text-primary">{player.team}</p>
              <Badge className="mt-2">{player.category}</Badge>
              <Button asChild size="lg" className="w-full mt-6">
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
                <Shield /> Información del Equipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Equipo Actual</p>
                    <p className="text-xl font-semibold">{player.team}</p>
                  </div>
                  <Button asChild variant="ghost" size="icon">
                    <Link href="#">
                      <ArrowUpRight />
                    </Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
