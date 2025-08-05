import { getPlayerById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Trophy } from 'lucide-react';
import { headers } from 'next/headers';
import { Card } from '@/components/ui/card';

export default async function DigitalIdCardPage({ params }: { params: { id: string } }) {
  const player = await getPlayerById(params.id);

  if (!player) {
    notFound();
  }

  const host = headers().get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const profileUrl = `${protocol}://${host}/players/${player.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    profileUrl
  )}`;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <Card className="bg-gradient-to-br from-primary via-indigo-900 to-black text-primary-foreground rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline">Liga Control ID</h2>
            <Trophy className="h-8 w-8 text-accent" />
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Image
              src={player.photoUrl}
              alt={`ID de ${player.name}`}
              width={128}
              height={128}
              className="rounded-full border-4 border-accent object-cover aspect-square"
              data-ai-hint="player portrait"
            />
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wider text-accent">Jugador</p>
              <p className="text-2xl font-bold">{player.name}</p>
              <p className="text-sm uppercase tracking-wider text-accent mt-2">Equipo</p>
              <p className="text-lg font-semibold">{player.team}</p>
            </div>
          </div>
          <div className="border-t border-accent/20 my-4"></div>
          <div className="flex items-center gap-4">
             <Image
              src={qrCodeUrl}
              alt="Código QR del Perfil del Jugador"
              width={100}
              height={100}
              className="rounded-lg bg-white p-1"
            />
            <div className="text-sm">
                <p><strong className="text-accent">Categoría:</strong> {player.category}</p>
                <p><strong className="text-accent">ID:</strong> P-{player.id}</p>
                 <p className="mt-2 text-xs opacity-70">Escanea para ver el perfil completo</p>
            </div>
          </div>
        </Card>
        <Button className="w-full mt-6" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
      </div>
    </div>
  );
}
