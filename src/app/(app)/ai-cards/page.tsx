
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
    const grid = document.getElementById('card-grid');
    if (!grid) return;

    setIsGenerating(true);

    // Temporarily add a class to scale up for better quality
    grid.classList.add('high-quality-capture');

    const canvas = await html2canvas(grid, {
      scale: 3, // Increase scale for higher resolution
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Remove the class after capture
    grid.classList.remove('high-quality-capture');

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;
    
    // Check if the image height exceeds pdf height, if so, we might need multiple pages
    // For this case, we assume 9 cards fit on one A4 page.
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`carnets_${selectedTeamId}.pdf`);
    setIsGenerating(false);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value as Category);
    setSelectedTeamId(null); // Reset team selection when category changes
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
        
        <div id="pdf-capture-wrapper" className="absolute -left-[9999px] top-0">
          {selectedTeamId && (
                  <div id="card-grid" className="p-4 bg-white grid grid-cols-3 gap-4" style={{ width: '210mm', minHeight: '297mm' }}>
                      {selectedTeamPlayers.map(selectedPlayer => {
                          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                              `/players/${selectedPlayer.id}`
                          )}`;
                          const team = teams.find(t => t.id === selectedPlayer.teamId);

                          return (
                          <div key={selectedPlayer.id} className="id-card-wrapper">
                              <div className="w-full max-w-[320px] aspect-[6/9] bg-[#1a233c] text-white rounded-2xl shadow-lg overflow-hidden p-4 flex flex-col font-sans">
                                  {/* Background Shapes */}
                                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                      <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full opacity-50"></div>
                                      <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-orange-500/10 rounded-full opacity-50"></div>
                                      <div className="absolute top-[20%] right-[-50px] w-48 h-1 bg-orange-500/30 -rotate-45"></div>
                                      <div className="absolute top-[10%] left-[-50px] w-48 h-1 bg-purple-500/30 rotate-45"></div>
                                  </div>
                                  
                                  <div className="relative z-10 flex flex-col items-center h-full text-center">
                                      {/* Header */}
                                      <header className="text-center">
                                          <div className="font-bold text-md tracking-wider uppercase">
                                              <span>Liga Deportiva Barrial</span>
                                              <br/>
                                              <span>La Luz</span>
                                          </div>
                                      </header>

                                      {/* Main Content */}
                                      <main className="flex-1 w-full mt-3">
                                          <div className="w-32 h-32 md:w-40 md:h-40 p-1.5 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-md mx-auto">
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
                                          
                                          <div className="text-center mt-1 text-base space-y-1">
                                            <p>{selectedPlayer.category.toUpperCase()}</p>
                                            <p className="text-muted-foreground">{selectedPlayer.idNumber}</p>
                                            <div className="flex items-center justify-center gap-2">
                                              <span className="font-semibold">{selectedPlayer.team}</span>
                                                {team?.logoUrl && (
                                                  <Image 
                                                      src={team.logoUrl}
                                                      alt={`Logo de ${team.name}`}
                                                      width={24}
                                                      height={24}
                                                      className="rounded-full"
                                                      data-ai-hint="team logo"
                                                  />
                                              )}
                                            </div>
                                          </div>
                                      </main>

                                      <footer className="w-full mt-4 border-t border-white/20 pt-3">
                                        <div className="flex items-center justify-between gap-4 w-full">
                                            {/* QR Code */}
                                            <div className="w-16 h-16 bg-white p-1 rounded-md">
                                                <Image src={qrCodeUrl} alt="QR Code" width={64} height={64} />
                                            </div>
                                            
                                            <Image src="https://placehold.co/100x100.png" alt="Logo de la Liga" width={56} height={56} className="rounded-md" data-ai-hint="league logo" />
                                            
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
        </div>
      </main>

      <style jsx global>{`
        .high-quality-capture {
            transform: scale(1.2); /* Scale up for capture */
            transform-origin: top left;
        }
      `}</style>
    </div>
  );
}
