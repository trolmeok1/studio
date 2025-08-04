

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 print:bg-white">
      <div className="text-center print:hidden">
        <h2 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
            Generador de Carnets
          </span>
        </h2>
      </div>

      <main>
        <Card className="lg:col-span-2 print:hidden">
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

            </CardContent>
        </Card>
        
        {selectedTeamId && (
                <div id="card-grid" className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedTeamPlayers.map(selectedPlayer => {
                        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                            `/players/${selectedPlayer.id}`
                        )}`;
                        const team = teams.find(t => t.id === selectedPlayer.teamId);

                        return (
                        <div key={selectedPlayer.id} className="id-card-wrapper">
                             <div className="w-full max-w-[320px] aspect-[6/9.5] bg-[#1a233c] text-white rounded-2xl shadow-lg overflow-hidden relative flex flex-col font-sans">
                                {/* Background Shapes */}
                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full opacity-50"></div>
                                    <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-orange-500/10 rounded-full opacity-50"></div>
                                    <div className="absolute top-[20%] right-[-50px] w-48 h-1 bg-orange-500/30 -rotate-45"></div>
                                     <div className="absolute top-[10%] left-[-50px] w-48 h-1 bg-purple-500/30 rotate-45"></div>
                                </div>
                                
                                <div className="relative z-10 flex flex-col p-4">
                                     {/* Header */}
                                    <header className="flex justify-center items-center text-center">
                                        <h3 className="font-bold text-md tracking-wider uppercase">Liga Deportiva Barrial La Luz</h3>
                                    </header>

                                     {/* Main Content */}
                                    <main className="flex flex-col items-center text-center mt-3">
                                        <div className="w-32 h-32 md:w-40 md:h-40 p-1.5 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-md">
                                             <Image
                                                src={selectedPlayer.photoUrl}
                                                alt={`Foto de ${selectedPlayer.name}`}
                                                width={200}
                                                height={200}
                                                className="rounded-sm object-cover w-full h-full"
                                                data-ai-hint="player portrait"
                                            />
                                        </div>
                                        
                                        <h2 className="mt-3 text-2xl font-bold text-orange-400 uppercase tracking-wide">{selectedPlayer.name}</h2>
                                        
                                        <div className="text-center mt-1 text-sm">
                                            <p>{selectedPlayer.category.toUpperCase()}</p>
                                            <p className="text-muted-foreground">{selectedPlayer.idNumber}</p>
                                             <div className="flex items-center justify-center gap-2 mt-1">
                                                {team?.logoUrl && (
                                                    <Image 
                                                        src={team.logoUrl}
                                                        alt={`Logo de ${team.name}`}
                                                        width={16}
                                                        height={16}
                                                        className="rounded-full"
                                                        data-ai-hint="team logo"
                                                    />
                                                )}
                                                <p className="font-semibold">{selectedPlayer.team}</p>
                                            </div>
                                        </div>
                                    </main>

                                    {/* Footer */}
                                    <footer className="mt-auto pt-3">
                                         <div className="flex items-end justify-between gap-4">
                                            {/* QR Code */}
                                            <div className="w-16 h-16 bg-white p-1 rounded-md">
                                                <Image src={qrCodeUrl} alt="QR Code" width={64} height={64} />
                                            </div>
                                             
                                            <Image src="https://placehold.co/100x100.png" alt="Logo de la Liga" width={40} height={40} className="rounded-full" data-ai-hint="league logo" />
                                             
                                             {/* Jersey Number */}
                                             <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                                                <span className="text-4xl font-bold text-primary">{selectedPlayer.jerseyNumber}</span>
                                            </div>
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}
      </main>

      <style jsx global>{`
        @media print {
            body {
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .print\\:hidden {
                display: none !important;
            }
            main, .flex-1 {
                padding: 0 !important;
                margin: 0 !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }
             #card-grid {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 10px !important;
                padding: 0 !important;
                margin: 0 !important;
                background-color: white !important;
            }
            .id-card-wrapper {
                break-inside: avoid;
                page-break-inside: avoid;
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

