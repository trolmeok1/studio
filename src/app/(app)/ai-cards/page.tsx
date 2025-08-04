
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
import { useToast } from '@/hooks/use-toast';

// Function to fetch image as Base64 data URI, with error handling
const toDataURL = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        // Use a placeholder for QR codes as they are dynamically generated and can cause issues.
        if (url.includes('api.qrserver.com')) {
             resolve(''); // Resolve with empty for QR codes for now
             return;
        }
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = () => resolve(''); // Resolve with empty string on reader error
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error(`Failed to fetch or convert image from ${url}:`, error);
                resolve(''); // Resolve with empty string on fetch error
            });
    });
};


const CardPreview = ({ player }: { player: Player | null }) => {
    if (!player) return null;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`/players/${player.id}`)}`;
    const leagueLogoUrl = 'https://placehold.co/100x100.png';
    const backgroundImageUrl = 'https://i.imgur.com/uP8hD5w.jpeg';

    return (
        <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4">Vista Previa del Carnet</h3>
            <div 
                className="w-80 h-[480px] text-white rounded-2xl p-6 flex flex-col shadow-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                 <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
                 <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <p className="font-bold text-sm">LIGA DEPORTIVA BARRIAL</p>
                        <p className="font-bold text-lg">LA LUZ</p>
                    </div>

                    {/* Player Photo */}
                    <div className="flex justify-center mb-4">
                        <div className="w-28 h-28 border-2 border-[#FFA500] overflow-hidden bg-gray-700">
                             <Image src={player.photoUrl} alt={player.name} width={112} height={112} className="object-cover w-full h-full" data-ai-hint="player portrait" />
                        </div>
                    </div>

                    {/* Player Info */}
                    <div className="text-center flex-grow">
                        <div className="h-4"></div>
                        <p className="font-bold text-2xl text-[#FFA500] uppercase">{player.name}</p>
                        <p className="font-bold text-xl uppercase mt-2">{player.team}</p>
                        <p className="font-bold text-lg uppercase">{player.category}</p>
                        <p className="text-sm">{player.idNumber}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                        {/* QR Code */}
                        <div className="w-16 h-16 bg-white p-1 rounded-md">
                            <Image src={qrCodeUrl} alt="QR Code" width={64} height={64} />
                        </div>
                        {/* League Logo */}
                        <div className="w-16 h-16">
                            <Image src={leagueLogoUrl} alt="League Logo" width={64} height={64} className="object-contain" data-ai-hint="league logo" />
                        </div>
                        {/* Jersey Number */}
                        <div className="w-16 h-16 flex items-center justify-center">
                            <span className="font-bold text-4xl text-[#FFA500]">{player.jerseyNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function AiCardsPage() {
  const [selection, setSelection] = useState<{ category: Category | null; teamId: string | null }>({
    category: null,
    teamId: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(teams.map((t) => t.category))];
    return uniqueCategories.filter(c => c !== 'Copa') as Category[];
  }, []);
  
  const filteredTeams = useMemo(() => {
    if (!selection.category) return [];
    return teams.filter((team) => team.category === selection.category);
  }, [selection.category]);

  const selectedTeamPlayers = useMemo(() => {
    if (!selection.teamId) return [];
    return players.filter((p) => p.teamId === selection.teamId);
  }, [selection.teamId]);
    
  const handleDownloadPdf = async () => {
    if (!selection.teamId) return;
    setIsGenerating(true);

    try {
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const cardWidthMM = 63;
        const cardHeightMM = 95;
        const marginX = (pdf.internal.pageSize.getWidth() - (3 * cardWidthMM)) / 4;
        const marginY = (pdf.internal.pageSize.getHeight() - (3 * cardHeightMM)) / 4;

        // Pre-fetch all assets
        const leagueLogoUrl = 'https://placehold.co/100x100.png';
        const backgroundImageUrl = 'https://i.imgur.com/uP8hD5w.jpeg';
        
        const [leagueLogoBase64, backgroundImageBase64] = await Promise.all([
            toDataURL(leagueLogoUrl),
            toDataURL(backgroundImageUrl),
        ]);

        const playersWithImages = await Promise.all(selectedTeamPlayers.map(async (player) => {
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`/players/${player.id}`)}`;
            const [playerPhotoBase64, qrCodeBase64] = await Promise.all([
                toDataURL(player.photoUrl),
                toDataURL(qrCodeUrl),
            ]);
            return { ...player, playerPhotoBase64, qrCodeBase64 };
        }));

        for (let i = 0; i < playersWithImages.length; i++) {
            const player = playersWithImages[i];
            const page = Math.floor(i / 9);
            if (page > 0 && i % 9 === 0) {
                pdf.addPage();
            }

            const row = Math.floor((i % 9) / 3);
            const col = (i % 9) % 3;

            const x = marginX * (col + 1) + col * cardWidthMM;
            const y = marginY * (row + 1) + row * cardHeightMM;
            
            // --- Draw Card Background ---
            if (backgroundImageBase64) {
                pdf.addImage(backgroundImageBase64, 'JPEG', x, y, cardWidthMM, cardHeightMM);
            } else {
                pdf.setFillColor('#1a233c'); // Dark blue background fallback
                pdf.roundedRect(x, y, cardWidthMM, cardHeightMM, 3, 3, 'F');
            }
            
            // Overlay for better text readability
            pdf.setFillColor(0, 0, 0);
            pdf.setGState(new (pdf.GState as any)({opacity: 0.5}));
            pdf.rect(x, y, cardWidthMM, cardHeightMM, 'F');
            pdf.setGState(new (pdf.GState as any)({opacity: 1}));

            // --- Header ---
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#FFFFFF');
            pdf.text('LIGA DEPORTIVA BARRIAL', x + cardWidthMM / 2, y + 7, { align: 'center' });
            pdf.setFontSize(10);
            pdf.text('LA LUZ', x + cardWidthMM / 2, y + 12, { align: 'center' });

            // --- Player Photo ---
            const photoSize = 25;
            const photoX = x + (cardWidthMM - photoSize) / 2;
            const photoY = y + 18;
            pdf.setDrawColor('#FFA500'); // Orange border
            pdf.setLineWidth(1);
            pdf.rect(photoX, photoY, photoSize, photoSize, 'S');
            
            if (player.playerPhotoBase64) {
                try {
                    pdf.addImage(player.playerPhotoBase64, 'PNG', photoX, photoY, photoSize, photoSize);
                } catch (e) {
                     console.error("Error adding player photo to PDF:", e);
                     pdf.setFillColor('#CCCCCC');
                     pdf.rect(photoX, photoY, photoSize, photoSize, 'F');
                }
            } else {
                pdf.setFillColor('#CCCCCC');
                pdf.rect(photoX, photoY, photoSize, photoSize, 'F');
            }

            // --- Player Info ---
            const infoY = photoY + photoSize + 8;
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#FFA500'); // Orange color for name
            pdf.text(player.name.toUpperCase(), x + cardWidthMM / 2, infoY, { align: 'center', maxWidth: cardWidthMM - 10 });
            
            pdf.setFontSize(11);
            pdf.setTextColor('#FFFFFF');
            pdf.text(player.team.toUpperCase(), x + cardWidthMM / 2, infoY + 6, { align: 'center' });
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.text(player.category.toUpperCase(), x + cardWidthMM / 2, infoY + 11, { align: 'center' });
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text(player.idNumber, x + cardWidthMM / 2, infoY + 15, { align: 'center' });

            // --- Footer Elements ---
            const footerY = y + cardHeightMM - 20;
            const itemSize = 15;
            
            // QR Code
            if (player.qrCodeBase64) {
                 try {
                    pdf.addImage(player.qrCodeBase64, 'PNG', x + 5, footerY, itemSize, itemSize);
                } catch(e) {
                    console.error("Error adding QR code to PDF:", e);
                }
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

        pdf.save(`carnets_${selection.teamId}.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({
            title: "Error al generar PDF",
            description: "No se pudieron cargar todos los recursos para el PDF. Por favor, inténtalo de nuevo.",
            variant: "destructive",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelection({ category: value as Category, teamId: null }); 
  };
  
  const handleTeamChange = (value: string) => {
      setSelection(prev => ({ ...prev, teamId: value }));
  }

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
                    <Select onValueChange={handleCategoryChange} value={selection.category || ''}>
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
                    <Select onValueChange={handleTeamChange} value={selection.teamId || ''} disabled={!selection.category}>
                        <SelectTrigger>
                        <SelectValue placeholder={selection.category ? "Elige un equipo..." : "Primero elige categoría"} />
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
                <div>
                    {selection.teamId && (
                        <>
                            <h3 className="text-lg font-medium mb-2 invisible">3. Descargar</h3>
                            <Button onClick={handleDownloadPdf} className="w-full" disabled={isGenerating}>
                                <Download className="mr-2 h-4 w-4" />
                                {isGenerating ? 'Generando PDF...' : `Descargar PDF (${selectedTeamPlayers.length})`}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            </CardContent>
        </Card>
        
        {selection.teamId && (
            <CardPreview player={selectedTeamPlayers[0] || null} />
        )}

      </main>
    </div>
  );
}
