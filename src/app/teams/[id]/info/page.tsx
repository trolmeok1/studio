

'use client';

import { getTeamById, type Person } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export default function TeamInfoPrintPage() {
  const params = useParams();
  const teamId = typeof params.id === 'string' ? params.id : '';
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }
  
  const directiva = [
      { cargo: 'PRESIDENTE/A:', persona: team.president },
      { cargo: 'VICEPRESIDENTE/A:', persona: team.vicePresident },
      { cargo: 'TESORERO/A:', persona: team.treasurer },
      { cargo: 'SECRETARIO/A:', persona: team.secretary },
      { cargo: 'VOCAL 1:', persona: team.vocal },
  ];

  const TableRow = ({ label, value }: { label: string, value?: string }) => (
    <div className="flex border-y border-black text-sm">
        <span className="font-bold p-1 bg-gray-200 w-48 text-left border-r border-black">{label}:</span>
        <span className="p-1 flex-grow text-left pl-4">{value}</span>
    </div>
  );

  const DirectiveTableRow = ({ cargo, persona }: { cargo: string, persona?: Person }) => (
     <tr>
        <td className="border border-black p-1 font-bold">{cargo}</td>
        <td className="border border-black p-1">{persona?.name || ''}</td>
        <td className="border border-black p-1">{persona?.phone || ''}</td>
    </tr>
  );
  
  const DelegateTableRow = ({ index, persona }: { index: number, persona?: Person }) => (
     <tr>
        <td className="border border-black p-1">{index + 1}.-</td>
        <td className="border border-black p-1">{persona?.name || ''}</td>
        <td className="border border-black p-1">{persona?.phone || ''}</td>
    </tr>
  );


  return (
    <div className="bg-background min-h-screen p-4 md:p-8 print:p-0">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg print:shadow-none print:rounded-none print:p-4">
             <header className="flex justify-between items-center pb-4 border-b-2 border-primary print:hidden">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Nómina de la Directiva del Club</h1>
                    <p className="text-muted-foreground">Equipo: {team.name}</p>
                </div>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
            </header>

            <main id="printable-info" className="mt-8 print:mt-0 text-black bg-white">
                 <div className="flex items-center justify-center text-center flex-col mb-4">
                     <div className="flex items-center gap-4">
                        <Image src="https://placehold.co/100x100.png" alt="Logo Liga" width={80} height={80} data-ai-hint="league logo" />
                        <div>
                            <p className="font-bold text-red-700 text-lg">LIGA DEPORTIVA BARRIAL "LA LUZ"</p>
                            <p className="text-sm">A LA UNION DE LIGAS INDEPENDIENTES DEL CANTON QUITO</p>
                            <p className="text-sm font-semibold">CAMPEONATO 2023 - 2024</p>
                        </div>
                    </div>
                     <p className="font-bold text-md text-red-700 underline mt-2">NOMINA DE LA DIRECTIVA DEL CLUB</p>
                </div>

                <div className="space-y-px mb-4">
                    <TableRow label="NOMBRE DEL CLUB" value={team.name} />
                    <TableRow label="CATEGORIA" value={team.category} />
                </div>
                
                <table className="w-full border-collapse border border-black text-xs text-left mb-8">
                    <thead className="bg-gray-200 font-bold">
                        <tr>
                            <th className="border border-black p-1">CARGO</th>
                            <th className="border border-black p-1">NOMBRES Y APELLIDOS</th>
                            <th className="border border-black p-1">TELEFONO CELULAR O CONVENCIONAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {directiva.map(item => (
                            <DirectiveTableRow key={item.cargo} cargo={item.cargo} persona={item.persona} />
                        ))}
                    </tbody>
                </table>
                
                <p className="font-bold text-md text-red-700 underline text-center mb-2">NOMINA DE DELEGADOS A SESIONES</p>
                <table className="w-full border-collapse border border-black text-xs text-left">
                    <thead className="bg-gray-200 font-bold">
                        <tr>
                            <th className="border border-black p-1 w-12">N°</th>
                            <th className="border border-black p-1">NOMBRES Y APELLIDOS</th>
                            <th className="border border-black p-1">TELEFONO CELULAR O CONVENCIONAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 3 }).map((_, index) => (
                           <DelegateTableRow key={index} index={index} persona={team.delegates?.[index]} />
                        ))}
                    </tbody>
                </table>
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
