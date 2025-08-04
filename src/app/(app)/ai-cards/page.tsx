

'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { players, teams, type Category } from '@/lib/mock-data';
import Image from 'next/image';
import { Printer } from 'lucide-react';

export default function AiCardsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<Category | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(teams.map((t) => t.category))], []);
  
  const filteredTeams = useMemo(() => {
    if (!selectedCategoryId) return [];
    return teams.filter((team) => team.category === selectedCategoryId);
  }, [selectedCategoryId]);

  const selectedTeamPlayers = useMemo(() => {
    if (!selectedTeamId) return [];
    return players.filter((p) => p.teamId === selectedTeamId);
  }, [selectedTeamId]);
    
  const handlePrint = () => {
    window.print();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value as Category);
    setSelectedTeamId(null); // Reset team selection when category changes
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="text-center print:hidden">
        <h2 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
            Generador de Carnets
          </span>
        </h2>
      </div>

      <Card className="lg:col-span-2 print:shadow-none print:border-none print:bg-transparent">
        <CardContent className="pt-6 print:p-0">
          <div className="grid gap-4 md:grid-cols-3 print:hidden">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Seleccionar Categoría</h3>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige una categoría..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div>
              <h3 className="text-lg font-medium mb-2">2. Seleccionar Equipo</h3>
              <Select onValueChange={setSelectedTeamId} value={selectedTeamId || ''} disabled={!selectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedCategoryId ? "Elige un equipo..." : "Primero elige categoría"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTeamId && (
                <div>
                     <h3 className="text-lg font-medium mb-2 invisible">3. Imprimir</h3>
                    <Button onClick={handlePrint} className="w-full md:w-auto">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir Carnets ({selectedTeamPlayers.length})
                    </Button>
                </div>
            )}
          </div>

          {selectedTeamId && (
             <div id="card-grid" className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {selectedTeamPlayers.map(selectedPlayer => {
                    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        `/players/${selectedPlayer.id}`
                    )}`;
                    const team = teams.find(t => t.id === selectedPlayer.teamId);

                    return (
                     <div key={selectedPlayer.id} className="id-card-wrapper">
                         <Card className="p-0 w-full max-w-[300px] aspect-[2.125/3.375] bg-white rounded-2xl shadow-lg overflow-hidden relative flex flex-col font-sans border-2 border-gray-200">
                           {/* Background Pattern */}
                           <div className="absolute inset-0 bg-repeat bg-center" style={{backgroundImage: `linear-gradient(135deg, rgba(128,0,0,0.1) 25%, transparent 25%), linear-gradient(225deg, rgba(128,0,0,0.1) 25%, transparent 25%), linear-gradient(45deg, rgba(128,0,0,0.1) 25%, transparent 25%), linear-gradient(315deg, rgba(128,0,0,0.1) 25%, #fff 25%)`, backgroundSize: '10px 10px'}}></div>
                           
                           {/* Vertical Text */}
                           <div className="absolute top-0 left-0 h-full flex items-center justify-center" style={{writingMode: 'vertical-rl'}}>
                               <span className="text-sm font-bold text-gray-500 transform rotate-180 tracking-wider">Ciudad de Quito</span>
                           </div>
                            <div className="absolute top-0 right-0 h-full flex items-center justify-center" style={{writingMode: 'vertical-rl'}}>
                               <span className="text-sm font-bold text-gray-500 tracking-wider">C.D. José Miguel</span>
                           </div>

                           <div className="relative z-10 flex flex-col flex-grow p-2">
                               {/* Header */}
                               <header className="flex justify-between items-start p-2">
                                   <Image src="https://placehold.co/100x100.png" alt="Logo Ciudad de Quito" width={50} height={50} data-ai-hint="city logo" />
                                   <div className="text-center bg-red-800 text-white p-2 rounded-lg shadow-md">
                                       <p className="font-bold text-lg leading-tight">{selectedPlayer.category}</p>
                                       <p className="text-xs underline">Categoría</p>
                                   </div>
                               </header>

                               {/* Main Content */}
                               <main className="flex-grow flex flex-col items-center justify-center text-center mt-2">
                                   <p className="font-bold text-3xl">{selectedPlayer.name.split(' ')[0]}</p>
                                   <p className="font-light text-2xl -mt-1">{selectedPlayer.name.split(' ').slice(1).join(' ')}</p>
                                   <Image
                                       src={selectedPlayer.photoUrl}
                                       alt={`Foto de ${selectedPlayer.name}`}
                                       width={120}
                                       height={120}
                                       className="rounded-lg border-4 border-white shadow-lg mt-2 object-cover aspect-square"
                                       data-ai-hint="player portrait"
                                   />
                                   <div className="text-xs mt-2 text-left bg-white/50 px-2 py-1 rounded">
                                       <p><strong className="font-semibold">Cédula:</strong> {selectedPlayer.idNumber}</p>
                                       <p><strong className="font-semibold">F. Nac.:</strong> {new Date(selectedPlayer.birthDate).toLocaleDateString('es-ES', { month: 'long', day: '2-digit', year: 'numeric' })}</p>
                                   </div>
                               </main>
                               
                               {/* Footer */}
                               <footer className="bg-red-800 text-white mt-2 p-2 rounded-lg shadow-inner flex items-center justify-around">
                                   <div className="w-16 h-16 bg-white flex items-center justify-center rounded-md">
                                        <Image src={qrCodeUrl} alt="QR Code" width={60} height={60} />
                                   </div>
                                   <div className="text-center">
                                       <p className="text-5xl font-bold">{selectedPlayer.jerseyNumber}</p>
                                       <p className="text-sm -mt-1 underline">No.</p>
                                   </div>
                                   <div className="bg-white p-1 rounded-full">
                                        <Image src={team?.logoUrl || "https://placehold.co/100x100.png"} alt={selectedPlayer.team} width={50} height={50} className="rounded-full" data-ai-hint="team logo" />
                                   </div>
                               </footer>
                           </div>
                         </Card>
                     </div>
                 )})}
             </div>
          )}
        </CardContent>
      </Card>
      <style jsx global>{`
        @media screen {
            #card-grid {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            }
        }
        @media print {
            body * {
                visibility: hidden;
            }
            #card-grid, #card-grid * {
                visibility: visible;
            }
            #card-grid {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 10px !important;
                padding: 1cm !important;
                margin: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .id-card-wrapper {
                break-inside: avoid;
                page-break-inside: avoid;
                width: 100% !important;
                max-width: 100% !important;
                display: block !important;
            }
            .id-card-wrapper > div {
                box-shadow: none !important;
                border: 2px solid #ddd !important;
            }
            @page {
                size: A4 portrait;
                margin: 0;
            }
        }
      `}</style>
    </div>
  );
}
