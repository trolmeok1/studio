'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { players } from '@/lib/mock-data';
import Image from 'next/image';
import { User, QrCode, Shield, Trophy } from 'lucide-react';

export default function AiCardsPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId) || null;

  const qrCodeUrl = selectedPlayer
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        `/players/${selectedPlayer.id}`
      )}`
    : `https://placehold.co/150x150.png`;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Generador de Carnets AI
        </h2>
      </div>

      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Seleccionar Jugador</h3>
              <Select onValueChange={setSelectedPlayerId} value={selectedPlayerId || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige un jugador..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} - {player.team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPlayer && (
             <div className="mt-8 flex justify-center">
                 <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white rounded-2xl shadow-2xl p-6 space-y-4 w-full max-w-lg relative overflow-hidden border-accent/20 border-2">
                    <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold font-headline tracking-wider uppercase text-accent">LIGA DEPORTIVA BARRIAL LA LUZ</h2>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <Image
                                src={selectedPlayer.photoUrl}
                                alt={`ID of ${selectedPlayer.name}`}
                                width={150}
                                height={150}
                                className="rounded-lg border-4 border-accent object-cover aspect-square"
                                data-ai-hint="player portrait"
                            />
                             <div className="mt-2 text-center bg-background/10 rounded-md px-3 py-1">
                                <p className="text-sm text-accent tracking-widest">N°</p>
                                <p className="text-4xl font-bold">{selectedPlayer.id.slice(-2)}</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            <div>
                                <p className="text-sm uppercase tracking-wider text-accent">Nombres</p>
                                <p className="text-2xl font-bold">{selectedPlayer.name}</p>
                            </div>
                             <div>
                                <p className="text-sm uppercase tracking-wider text-accent">Cédula</p>
                                <p className="text-lg font-semibold">1712345678</p>
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-wider text-accent">Categoría</p>
                                <p className="text-lg font-semibold">{selectedPlayer.category}</p>
                            </div>
                             <div>
                                <p className="text-sm uppercase tracking-wider text-accent">Equipo</p>
                                <div className="flex items-center gap-2">
                                     <Image src="https://placehold.co/40x40.png" alt={selectedPlayer.team} width={24} height={24} className="rounded-full bg-white" data-ai-hint="team logo" />
                                    <p className="text-lg font-semibold">{selectedPlayer.team}</p>
                                </div>
                            </div>
                        </div>
                         <Image
                            src={qrCodeUrl}
                            alt="Player Profile QR Code"
                            width={120}
                            height={120}
                            className="rounded-lg bg-white p-1"
                        />
                    </div>
                 </Card>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}