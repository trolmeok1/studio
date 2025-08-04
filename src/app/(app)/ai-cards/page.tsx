
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { players, teams, type Category } from '@/lib/mock-data';
import Image from 'next/image';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import type { Player } from '@/lib/types';

// Function to fetch image as Base64 data URI
const toDataURL = (url: string): Promise<string> => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

const CardPreview = ({ player }: { player: Player | null }) => {
    if (!player) return null;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`/players/${player.id}`)}`;
    const leagueLogoUrl = 'https://placehold.co/100x100.png';

    return (
        <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4">Vista Previa del Carnet</h3>
            <div className="w-80 h-[480px] bg-[#1a233c] text-white rounded-2xl p-6 flex flex-col shadow-lg">
                {/* Header */}
                <div className="text-center mb-4">
                    <p className="font-bold text-sm">LIGA DEPORTIVA BARRIAL</p>
                    <p className="font-bold text-lg">LA LUZ</p>
                </div>

                {/* Player Photo */}
                <div className="flex justify-center mb-4">
                     <div className="w-32 h-32 rounded-full border-2 border-[#FFA500] overflow-hidden">
                        <Image src={player.photoUrl} alt={player.name} width={128} height={128} className="object-cover w-full h-full" />
                    </div>
                </div>

                {/* Player Info */}
                <div className="text-center flex-grow">
                    <p className="font-bold text-2xl text-[#FFA500] uppercase">{player.name}</p>
                    <p className="text-sm uppercase">{player.category}</p>
                    <p className="text-sm">{player.idNumber}</p>
                    <p className="font-bold uppercase">{player.team}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                    {/* QR Code */}
                    <div className="w-16 h-16 bg-white p-1 rounded-md">
                        <Image src={qrCodeUrl} alt="QR Code" width={64} height={64} />
                    </div>
                    {/* League Logo */}
                    <div className="w-16 h-16">
                         <Image src={leagueLogoUrl} alt="League Logo" width={64} height={64} className="object-contain" />
                    </div>
                    {/* Jersey Number */}
                    <div className="w-16 h-16 flex items-center justify-center">
                        <span className="font-bold text-4xl" style={{color: '#9400D3'}}>{player.jerseyNumber}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


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
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#FFFFFF');
        pdf.text('LIGA DEPORTIVA BARRIAL', x + cardWidthMM / 2, y + 7, { align: 'center' });
        pdf.setFontSize(9);
        pdf.text('LA LUZ', x + cardWidthMM / 2, y + 12, { align: 'center' });


        // --- Player Photo ---
        const photoSize = 30; // Further reduced photo size
        const photoX = x + (cardWidthMM - photoSize) / 2;
        const photoY = y + 18;
        pdf.setDrawColor('#FFA500'); // Orange border
        pdf.setLineWidth(1);
        pdf.rect(photoX, photoY, photoSize, photoSize, 'S');
        
        try {
            const playerPhotoBase64 = await toDataURL(player.photoUrl);
            pdf.addImage(playerPhotoBase64, 'PNG', photoX, photoY, photoSize, photoSize);
        } catch (error) {
            console.error('Error loading player photo:', error);
            pdf.setFillColor('#CCCCCC');
            pdf.rect(photoX, photoY, photoSize, photoSize, 'F');
        }


        // --- Player Info ---
        const infoY = photoY + photoSize + 10; // Adjusted info position
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#FFA500'); // Orange color for name
        pdf.text(player.name.toUpperCase(), x + cardWidthMM / 2, infoY, { align: 'center', maxWidth: cardWidthMM - 10 });
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold'); // Bold font for category and team
        pdf.setTextColor('#FFFFFF');
        pdf.text(player.category.toUpperCase(), x + cardWidthMM / 2, infoY + 6, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(player.idNumber, x + cardWidthMM / 2, infoY + 10, { align: 'center' });
        pdf.setFont('helvetica', 'bold'); // Bold font for category and team
        pdf.setFontSize(9);
        pdf.text(player.team.toUpperCase(), x + cardWidthMM / 2, infoY + 14, { align: 'center' });

        // --- Footer Elements ---
        const footerY = y + cardHeightMM - 20;
        const itemSize = 15;
        
        // QR Code
        const qrX = x + 5;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`/players/${player.id}`)}`;
        try {
            const qrCodeBase64 = await toDataURL(qrCodeUrl);
            pdf.addImage(qrCodeBase64, 'PNG', qrX, footerY, itemSize, itemSize);
        } catch (error) {
            console.error('Error loading QR code:', error);
        }

        // League Logo
        if (leagueLogoBase64) {
             const logoX = x + (cardWidthMM - itemSize) / 2;
             pdf.addImage(leagueLogoBase64, 'PNG', logoX, footerY, itemSize, itemSize);
        }

        // Jersey Number
        const jerseyX = x + cardWidthMM - itemSize - 5;
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#FFA500'); 
        pdf.text(player.jerseyNumber.toString(), jerseyX + itemSize / 2, footerY + itemSize / 2 + 4, { align: 'center' });
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
        
        {selectedTeamId && (
            <CardPreview player={selectedTeamPlayers[0] || null} />
        )}

      </main>
    </div>
  );
}
