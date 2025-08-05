'use client';

import { getTeamById, getPlayersByTeamId } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export default function TeamRosterPage() {
  const params = useParams();
  const teamId = typeof params.id === 'string' ? params.id : '';
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }

  const allPlayers = getPlayersByTeamId(teamId);
  const incomingPlayers = allPlayers.filter(p => p.status === 'activo');
  const outgoingPlayers = allPlayers.filter(p => p.status === 'inactivo');

  const splitName = (fullName: string) => {
    const parts = fullName.split(' ');
    const firstName = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
    const lastName = parts.slice(Math.ceil(parts.length / 2)).join(' ');
    return { firstName, lastName };
  };

  const PlayerTable = ({ title, players, startIndex = 0 }: { title: string, players: typeof allPlayers, startIndex?: number }) => (
    <div className="mb-8">
        <h2 className="bg-gray-300 text-black font-bold text-center p-1 text-md mb-2 border border-black">{title}</h2>
        <table className="w-full border-collapse border border-black text-xs text-center">
            <thead className="bg-gray-200 font-bold">
                <tr>
                    <th className="border border-black p-1 w-8">N-</th>
                    <th className="border border-black p-1">NOMBRES</th>
                    <th className="border border-black p-1">APELLIDOS</th>
                    <th className="border border-black p-1">FECHA DE NACIMIENTO</th>
                    <th className="border border-black p-1">N° CEDULA</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player, index) => {
                     const { firstName, lastName } = splitName(player.name);
                     return (
                        <tr key={player.id} className="[&>td]:p-1">
                            <td className="border border-black">{startIndex + index + 1}</td>
                            <td className="border border-black text-left pl-2">{firstName}</td>
                            <td className="border border-black text-left pl-2">{lastName}</td>
                            <td className="border border-black text-left pl-2">{player.birthDate}</td>
                            <td className="border border-black">{player.idNumber}</td>
                        </tr>
                    )
                })}
                 {Array.from({ length: Math.max(0, (title.includes('ENTRANTES') ? 25 : 5) - players.length) }).map((_, index) => (
                     <tr key={`empty-${index}`} className="h-6 [&>td]:p-1">
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                    </tr>
                ))}
            </tbody>
        </table>
         {title.includes('SALIENTES') && (
            <div className="border border-black border-t-0 p-1">
                <p className="font-bold text-xs">MOTIVO:</p>
                <div className="h-12"></div>
            </div>
        )}
    </div>
);


  return (
    <div className="bg-background min-h-screen p-4 md:p-8 print:p-0">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg print:shadow-none print:rounded-none print:p-4">
             <header className="flex justify-between items-center pb-4 border-b-2 border-primary print:hidden">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Nómina de Jugadores</h1>
                    <p className="text-muted-foreground">Equipo: {team.name}</p>
                </div>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Nómina
                </Button>
            </header>

            <main id="printable-roster" className="mt-8 print:mt-0 text-black bg-white">
                <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <Image src={team.logoUrl} alt="Logo" width={80} height={80} data-ai-hint="team logo" />
                        <div>
                            <p className="font-bold text-red-700 text-lg">LIGA DEPORTIVA BARRIAL "LA LUZ"</p>
                            <p className="text-sm">FILIAL A LA UNION DE LIGAS INDEPENDIENTES DEL CANTON QUITO</p>
                            <p className="text-sm font-semibold">NOMINA DE JUGADORES CAMPEONATO 2023 - 2024</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 border-y border-black text-sm mb-2">
                    <div className="flex border-r border-black">
                        <span className="font-bold p-1 bg-gray-200 w-32 text-left border-r border-black">NOMBRE DEL CLUB:</span>
                        <span className="p-1 flex-grow text-center">{team.name}</span>
                    </div>
                     <div className="flex">
                        <span className="font-bold p-1 bg-gray-200 w-32 text-left border-r border-black">CATEGORIA:</span>
                        <span className="p-1 flex-grow text-center">{team.category}</span>
                    </div>
                </div>
                
                <PlayerTable title="JUGADORES ENTRANTES (ACTIVOS)" players={incomingPlayers} />
                <PlayerTable title="JUGADORES SALIENTES (INACTIVOS)" players={outgoingPlayers} startIndex={incomingPlayers.length} />

            </main>
        </div>
        <style jsx global>{`
            @media print {
              body {
                background-color: white !important;
              }
              .print\\:hidden {
                display: none !important;
              }
               .print\\:p-0 {
                padding: 0 !important;
               }
               .print\\:mt-0 {
                margin-top: 0 !important;
               }
               .print\\:shadow-none {
                box-shadow: none !important;
              }
               .print\\:rounded-none {
                border-radius: 0 !important;
              }
            }
            @page {
                size: A4 portrait;
                margin: 1cm;
            }
        `}</style>
    </div>
  );
}
