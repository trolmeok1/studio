
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { players, teams, type Category } from '@/lib/mock-data';
import Image from 'next/image';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AiCardsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<Category | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = useMemo(() => [...new Set(teams.map((t) => t.category))], []);
  
  const filteredTeams = useMemo(() => {
    if (!selectedCategoryId) return [];
    return teams.filter((team) => team.category === selectedCategoryId);
  }, [selectedCategoryId]);

  const selectedTeamPlayers = useMemo(() => {
    if (!selectedTeamId) return [];
    return players.filter((p) => p.teamId === selectedTeamId);
  }, [selectedTeamId]);
    
  const handleDownloadPdf = async () => {
      if (!selectedTeamId) return;
      setIsGenerating(true);

      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const cardWidthMM = 63;
      const cardHeightMM = 95; 
      const marginX = (pdf.internal.pageSize.getWidth() - (3 * cardWidthMM)) / 4;
      const marginY = (pdf.internal.pageSize.getHeight() - (3 * cardHeightMM)) / 4;

      let cardCount = 0;

      for (const player of selectedTeamPlayers) {
          const page = Math.floor(cardCount / 9);
          if (page > 0 && cardCount % 9 === 0) {
              pdf.addPage();
          }

          const cardWrapper = document.getElementById(`player-card-${player.id}`);
          if (!cardWrapper) continue;
          
          cardWrapper.style.display = 'block';

          const canvas = await html2canvas(cardWrapper, {
              scale: 3,
              useCORS: true,
              backgroundColor: null, 
          });
          
          cardWrapper.style.display = 'none';

          const imgData = canvas.toDataURL('image/png');

          const row = Math.floor((cardCount % 9) / 3);
          const col = (cardCount % 9) % 3;

          const x = marginX * (col + 1) + col * cardWidthMM;
          const y = marginY * (row + 1) + row * cardHeightMM;

          pdf.addImage(imgData, 'PNG', x, y, cardWidthMM, cardHeightMM);

          cardCount++;
      }

      pdf.save(`carnets_${selectedTeamId}.pdf`);
      setIsGenerating(false);
  };


  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value as Category);
    setSelectedTeamId(null); 
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
            Generador de Carnets
          </span>
        </h2>
      </div>

      <main>
        <Card className="lg:col-span-2">
            <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
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
                        <h3 className="text-lg font-medium mb-2 invisible">3. Descargar</h3>
                        <Button onClick={handleDownloadPdf} className="w-full md:w-auto" disabled={isGenerating}>
                            <Download className="mr-2 h-4 w-4" />
                            {isGenerating ? 'Generando PDF...' : `Descargar PDF (${selectedTeamPlayers.length})`}
                        </Button>
                    </div>
                )}
            </div>
            </CardContent>
        </Card>
        
        <div className="absolute -left-[9999px] top-0">
          {selectedTeamPlayers.map(selectedPlayer => {
              const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  `/players/${selectedPlayer.id}`
              )}`;
              const team = teams.find(t => t.id === selectedPlayer.teamId);

              return (
              <div key={selectedPlayer.id} id={`player-card-${selectedPlayer.id}`} style={{ display: 'none', width: '320px'}}>
                  <div className="relative w-full max-w-[320px] aspect-[6/9.5] bg-[#1a233c] text-white rounded-2xl shadow-lg overflow-hidden p-4 flex flex-col font-sans">
                      
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                          <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full opacity-50"></div>
                          <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-orange-500/10 rounded-full opacity-50"></div>
                          <div className="absolute top-[20%] right-[-50px] w-48 h-1 bg-orange-500/30 -rotate-45"></div>
                          <div className="absolute top-[10%] left-[-50px] w-48 h-1 bg-purple-500/30 rotate-45"></div>
                      </div>
                      
                      <div className="relative z-10 flex flex-col h-full text-center">
                          <header className="text-center">
                              <div className="font-bold text-md tracking-wider uppercase">
                                  <span>Liga Deportiva Barrial</span>
                                  <br/>
                                  <span>La Luz</span>
                              </div>
                          </header>

                          <main className="w-full mt-3">
                              <Image
                                  src={selectedPlayer.photoUrl}
                                  alt={`Foto de ${selectedPlayer.name}`}
                                  width={200}
                                  height={200}
                                  className="w-40 h-40 rounded-md mx-auto object-cover border-4 border-orange-400"
                                  data-ai-hint="player portrait"
                              />
                              
                              <h2 className="mt-3 text-2xl font-bold text-orange-400 uppercase tracking-wide">{selectedPlayer.name}</h2>
                              
                              <div className="text-center mt-1 text-base space-y-1">
                                <p className="text-lg">{selectedPlayer.category.toUpperCase()}</p>
                                <p className="text-muted-foreground text-lg">{selectedPlayer.idNumber}</p>
                                <p className="font-semibold text-lg">{selectedPlayer.team}</p>
                              </div>
                          </main>

                          <footer className="w-full mt-auto border-t border-white/20 pt-3 grid grid-cols-3 items-center gap-4">
                              <Image src={qrCodeUrl} alt="QR Code" width={64} height={64} className="bg-white p-1 rounded-md mx-auto" />
                              
                              <Image src="https://placehold.co/100x100.png" alt="Logo de la Liga" width={56} height={56} className="rounded-md mx-auto" data-ai-hint="league logo" />
                              
                              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto">
                                  <span className="text-4xl font-bold text-primary">{selectedPlayer.jerseyNumber}</span>
                              </div>
                          </footer>
                      </div>
                  </div>
              </div>
              )})}
        </div>
      </main>
    </div>
  );
}
