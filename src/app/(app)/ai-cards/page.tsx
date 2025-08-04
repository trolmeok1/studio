
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { players, teams, type Category } from '@/lib/mock-data';
import Image from 'next/image';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

// Function to fetch image as Base64 data URI
const toDataURL = (url: string): Promise<string> => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));


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

    const leagueLogoUrl = 'https://placehold.co/100x100.png';
    const leagueLogoBase64 = await toDataURL(leagueLogoUrl).catch(() => '');


    for (let i = 0; i < selectedTeamPlayers.length; i++) {
        const player = selectedTeamPlayers[i];
        const page = Math.floor(i / 9);
        if (page > 0 && i % 9 === 0) {
            pdf.addPage();
        }

        const row = Math.floor((i % 9) / 3);
        const col = (i % 9) % 3;

        const x = marginX * (col + 1) + col * cardWidthMM;
        const y = marginY * (row + 1) + row * cardHeightMM;
        
        // --- Draw Card Background ---
        pdf.setFillColor('#1a233c'); // Dark blue background
        pdf.roundedRect(x, y, cardWidthMM, cardHeightMM, 3, 3, 'F');

        // --- Header ---
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#FFFFFF');
        pdf.text('LIGA DEPORTIVA BARRIAL', x + cardWidthMM / 2, y + 7, { align: 'center' });
        pdf.setFontSize(8);
        pdf.text('LA LUZ', x + cardWidthMM / 2, y + 11, { align: 'center' });


        // --- Player Photo ---
        try {
            const playerPhotoBase64 = await toDataURL(player.photoUrl);
            pdf.addImage(playerPhotoBase64, 'PNG', x + (cardWidthMM - 35) / 2, y + 15, 35, 35);
        } catch (error) {
            console.error('Error loading player photo:', error);
            pdf.setFillColor('#CCCCCC');
            pdf.rect(x + (cardWidthMM - 35) / 2, y + 15, 35, 35, 'F');
        }
        
        pdf.setDrawColor('#FFA500'); // Orange border
        pdf.setLineWidth(1);
        pdf.rect(x + (cardWidthMM - 35) / 2, y + 15, 35, 35, 'S');


        // --- Player Info ---
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#FFA500'); // Orange color for name
        pdf.text(player.name.toUpperCase(), x + cardWidthMM / 2, y + 58, { align: 'center', maxWidth: cardWidthMM - 10 });
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#FFFFFF');
        pdf.text(player.category.toUpperCase(), x + cardWidthMM / 2, y + 64, { align: 'center' });
        pdf.text(player.idNumber, x + cardWidthMM / 2, y + 68, { align: 'center' });
        pdf.setFont('helvetica', 'bold');
        pdf.text(player.team.toUpperCase(), x + cardWidthMM / 2, y + 72, { align: 'center' });

        // --- Footer Elements ---
        const footerY = y + 76;
        const footerItemSize = 16;
        
        // QR Code
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`/players/${player.id}`)}`;
        try {
            const qrCodeBase64 = await toDataURL(qrCodeUrl);
            pdf.setFillColor('#FFFFFF');
            pdf.rect(x + 5, footerY, footerItemSize, footerItemSize, 'F'); // White background for QR
            pdf.addImage(qrCodeBase64, 'PNG', x + 5.5, footerY + 0.5, footerItemSize - 1, footerItemSize - 1);
        } catch (error) {
            console.error('Error loading QR code:', error);
        }

        // League Logo
        if (leagueLogoBase64) {
             const logoX = x + (cardWidthMM - footerItemSize) / 2;
             pdf.addImage(leagueLogoBase64, 'PNG', logoX, footerY, footerItemSize, footerItemSize);
        }

        // Jersey Number
        const jerseyX = x + cardWidthMM - 10;
        const jerseyY = footerY + (footerItemSize / 2);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#9400D3'); // Vivid Violet for a "neon" effect
        pdf.text(player.jerseyNumber.toString(), jerseyX, jerseyY, { align: 'center', baseline: 'middle' });
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
      </main>
    </div>
  );
}
