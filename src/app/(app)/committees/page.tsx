'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Printer, Calendar } from 'lucide-react';
import Image from 'next/image';

// Mock data - we'll replace this with dynamic data later
const matchData = {
  date: '2024-07-28',
  vocalTeam: 'Galaxy Gliders',
  teamA: {
    name: 'Cosmic Comets',
    logoUrl: 'https://placehold.co/100x100.png',
    players: Array.from({ length: 11 }, (_, i) => `Jugador A${i + 1}`),
  },
  teamB: {
    name: 'Solar Flares',
    logoUrl: 'https://placehold.co/100x100.png',
    players: Array.from({ length: 11 }, (_, i) => `Jugador B${i + 1}`),
  },
};

export default function CommitteesPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
       <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Hoja de Vocalía
        </h2>
        <Button onClick={handlePrint}>
          <Printer className="mr-2" />
          Imprimir
        </Button>
      </div>

      <Card className="p-6 md:p-8 print:shadow-none print:border-none">
        <CardContent className="p-0">
          <header className="flex flex-col items-center mb-6">
            <div className="flex w-full justify-between items-center mb-4">
                <Image src="https://placehold.co/100x100.png" alt="Logo Izquierdo" width={80} height={80} data-ai-hint="league logo" />
                <div className="text-center">
                    <h1 className="text-xl font-bold uppercase">Campeonato Independiente F.I.Q. 2015-2016</h1>
                    <h2 className="text-2xl font-bold uppercase mt-1">Hoja de Vocalía</h2>
                </div>
                <Image src="https://placehold.co/100x100.png" alt="Logo Derecho" width={80} height={80} data-ai-hint="league logo" />
            </div>
            <div className="w-full flex justify-between items-center text-lg">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5"/>
                    <strong>FECHA:</strong> 
                    <Input className="w-40" type="date" defaultValue={matchData.date} />
                </div>
                <div className="flex items-center gap-2">
                    <strong>EQUIPO VOCAL:</strong>
                    <Input className="w-64" defaultValue={matchData.vocalTeam} />
                </div>
            </div>
          </header>

          <main className="grid grid-cols-2 gap-8 mb-6">
            {/* Team A */}
            <div className="space-y-2">
                <h3 className="font-bold text-center text-lg uppercase bg-muted p-2 rounded-t-md">EQUIPO: {matchData.teamA.name}</h3>
                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60%]">JUGADORES</TableHead>
                                <TableHead className="text-center">GOL</TableHead>
                                <TableHead className="text-center">TARJETA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matchData.teamA.players.map((player, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium py-1">{player}</TableCell>
                                    <TableCell className="py-1"><Input className="h-8 text-center" /></TableCell>
                                    <TableCell className="py-1"><Input className="h-8 text-center" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <Label className="font-bold text-lg whitespace-nowrap">RESULTADO FINAL:</Label>
                    <Input className="h-10 text-center font-bold text-xl"/>
                </div>
            </div>

            {/* Team B */}
            <div className="space-y-2">
                <h3 className="font-bold text-center text-lg uppercase bg-muted p-2 rounded-t-md">EQUIPO: {matchData.teamB.name}</h3>
                <div className="border">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60%]">JUGADORES</TableHead>
                                <TableHead className="text-center">GOL</TableHead>
                                <TableHead className="text-center">TARJETA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matchData.teamB.players.map((player, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium py-1">{player}</TableCell>
                                    <TableCell className="py-1"><Input className="h-8 text-center" /></TableCell>
                                    <TableCell className="py-1"><Input className="h-8 text-center" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <div className="flex items-center gap-2 pt-2">
                    <Label className="font-bold text-lg whitespace-nowrap">RESULTADO FINAL:</Label>
                    <Input className="h-10 text-center font-bold text-xl"/>
                </div>
            </div>
          </main>
          
          <section className="space-y-4 mb-8">
                <div>
                    <Label className="font-bold">REPORTE DEL ÁRBITRO:</Label>
                    <Textarea rows={3}/>
                </div>
                <div>
                    <Label className="font-bold">REPORTE DEL VOCAL:</Label>
                    <Textarea rows={3}/>
                </div>
          </section>

          <footer className="grid grid-cols-2 gap-8">
                <div>
                    <h4 className="font-bold text-center bg-muted p-1">VALORES A CANCELAR</h4>
                     <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>TARJETAS</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>MULTAS</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>TIZADO</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>ARBITRAJE</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow className="font-bold bg-muted/50">
                                <TableCell>TOTAL $</TableCell>
                                <TableCell><Input className="h-8 font-bold" /></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className="border p-2 mt-2">
                        <p className="font-bold">OBSERVACIONES:</p>
                        <p className="text-sm">EL VALOR DE LA MULTA PUEDE SER CANCELADO EN DOS PARTES</p>
                    </div>
                </div>
                 <div>
                    <h4 className="font-bold text-center bg-muted p-1">VALORES A CANCELAR</h4>
                     <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>TARJETAS</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>MULTAS</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>TIZADO</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>ARBITRAJE</TableCell>
                                <TableCell><Input className="h-8" /></TableCell>
                            </TableRow>
                             <TableRow className="font-bold bg-muted/50">
                                <TableCell>TOTAL $</TableCell>
                                <TableCell><Input className="h-8 font-bold" /></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                     <div className="border p-2 mt-2">
                        <p className="font-bold">OBSERVACIONES:</p>
                        <p className="text-sm">EL VALOR DE LA MULTA PUEDE SER CANCELADO EN DOS PARTES</p>
                    </div>
                </div>
                
                 <div className="pt-16 text-center">
                    <div className="border-t w-64 mx-auto pt-2">
                        <p className="font-bold">NOMBRE Y FIRMA DEL ÁRBITRO</p>
                    </div>
                </div>
                 <div className="pt-16 text-center">
                    <div className="border-t w-64 mx-auto pt-2">
                        <p className="font-bold">FIRMA DEL VOCAL</p>
                    </div>
                </div>
          </footer>

        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .flex-1.space-y-4 {
            padding: 0;
          }
          header, footer {
            page-break-before: auto;
            page-break-after: auto;
          }
          main {
            page-break-inside: avoid;
          }
          .flex.items-center.justify-between, .print\:shadow-none, .print\:border-none {
            box-shadow: none !important;
            border: none !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
