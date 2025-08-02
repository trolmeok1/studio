'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { players, teams } from '@/lib/mock-data';
import Image from 'next/image';
import { User, QrCode, Shield, Trophy, Printer } from 'lucide-react';

export default function AiCardsPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const selectedTeamPlayers = selectedTeamId
    ? players.filter((p) => p.teamId === selectedTeamId)
    : [];
    
  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Generador de Carnets AI
        </h2>
      </div>

      <Card className="lg:col-span-2 print:shadow-none print:border-none">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 print:hidden">
            <div>
              <h3 className="text-lg font-medium mb-2">Seleccionar Equipo</h3>
              <Select onValueChange={setSelectedTeamId} value={selectedTeamId || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige un equipo..." />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTeamId && (
                <div>
                     <h3 className="text-lg font-medium mb-2 invisible">Imprimir</h3>
                    <Button onClick={handlePrint} className="w-full md:w-auto">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir Carnets ({selectedTeamPlayers.length})
                    </Button>
                </div>
            )}
          </div>

          {selectedTeamId && (
             <div id="card-grid" className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {selectedTeamPlayers.map(selectedPlayer => (
                     <div key={selectedPlayer.id} className="id-card-wrapper">
                         <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white rounded-2xl shadow-lg p-4 space-y-2 relative overflow-hidden border-accent/20 border-2 aspect-[3.375/2.125] flex flex-col justify-between">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-accent"></div>
                            <div className="text-center">
                                <h2 className="text-xs font-bold font-headline tracking-tight uppercase text-accent">LIGA DEPORTIVA BARRIAL LA LUZ</h2>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={selectedPlayer.photoUrl}
                                        alt={`ID of ${selectedPlayer.name}`}
                                        width={80}
                                        height={80}
                                        className="rounded-md border-2 border-accent object-cover aspect-square"
                                        data-ai-hint="player portrait"
                                    />
                                     <div className="mt-1 text-center bg-background/10 rounded-md px-2 py-0.5">
                                        <p className="text-[0.6rem] text-accent tracking-widest">N°</p>
                                        <p className="text-xl font-bold">{selectedPlayer.id.slice(-2)}</p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div>
                                        <p className="text-[0.6rem] uppercase tracking-wider text-accent">Nombres</p>
                                        <p className="text-sm font-bold leading-tight">{selectedPlayer.name}</p>
                                    </div>
                                     <div>
                                        <p className="text-[0.6rem] uppercase tracking-wider text-accent">Cédula</p>
                                        <p className="text-xs font-semibold">1712345678</p>
                                    </div>
                                    <div>
                                        <p className="text-[0.6rem] uppercase tracking-wider text-accent">Categoría</p>
                                        <p className="text-xs font-semibold">{selectedPlayer.category}</p>
                                    </div>
                                     <div>
                                        <p className="text-[0.6rem] uppercase tracking-wider text-accent">Equipo</p>
                                        <div className="flex items-center gap-1">
                                             <Image src="https://placehold.co/40x40.png" alt={selectedPlayer.team} width={16} height={16} className="rounded-full bg-white" data-ai-hint="team logo" />
                                            <p className="text-xs font-semibold">{selectedPlayer.team}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </Card>
                     </div>
                 ))}
             </div>
          )}
        </CardContent>
      </Card>
      <style jsx global>{`
        .id-card-wrapper {
            break-inside: avoid;
        }
        @media print {
          body {
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .flex-1.space-y-4 {
            padding: 0;
          }
          #card-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            page-break-before: auto;
            page-break-after: auto;
          }
          .id-card-wrapper {
             page-break-inside: avoid;
             padding: 0;
             margin: 0;
          }
          .print\:hidden {
              display: none !important;
          }
          .print\:shadow-none {
              box-shadow: none !important;
          }
           .print\:border-none {
              border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
