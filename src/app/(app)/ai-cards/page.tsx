
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPlayers, getTeams, type Player, type Team, type Category } from '@/lib/mock-data';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

const toDataURL = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        if (!url) {
            resolve('');
            return;
        }
        if (url.startsWith('data:image')) {
            resolve(url);
            return;
        }

        fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error del proxy: ${response.statusText}`);
                }
                return response.text();
            })
            .then(dataUri => {
                resolve(dataUri);
            })
            .catch(error => {
                console.error(`Fallo al obtener la imagen desde el proxy para ${url}:`, error);
                resolve(''); 
            });
    });
};


export default function AiCardsPage() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // State for team-based generation
  const [teamSelection, setTeamSelection] = useState<{ category: Category | null; teamId: string | null }>({
    category: null,
    teamId: null,
  });
  
  // State for individual generation
  const [individualSelection, setIndividualSelection] = useState<{ category: Category | null; teamId: string | null, selectedPlayers: string[] }>({
    category: null,
    teamId: null,
    selectedPlayers: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
        setIsLoadingData(true);
        const [playersData, teamsData] = await Promise.all([getPlayers(), getTeams()]);
        setAllPlayers(playersData);
        setAllTeams(teamsData);
        setIsLoadingData(false);
    };
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allTeams.map((t) => t.category))];
    return uniqueCategories.filter(c => c !== 'Copa') as Category[];
  }, [allTeams]);
  
  const filteredTeamsForTeamSelection = useMemo(() => {
    if (!teamSelection.category) return [];
    return allTeams.filter((team) => team.category === teamSelection.category);
  }, [teamSelection.category, allTeams]);
  
  const filteredTeamsForIndividualSelection = useMemo(() => {
    if (!individualSelection.category) return [];
    return allTeams.filter((team) => team.category === individualSelection.category);
  }, [individualSelection.category, allTeams]);

  const selectedTeamPlayersForTeamSelection = useMemo(() => {
    if (!teamSelection.teamId) return [];
    return allPlayers.filter((p) => p.teamId === teamSelection.teamId);
  }, [teamSelection.teamId, allPlayers]);
  
  const playersForIndividualSelection = useMemo(() => {
    if (!individualSelection.teamId) return [];
    return allPlayers.filter((p) => p.teamId === individualSelection.teamId);
  }, [individualSelection.teamId, allPlayers]);

  const getShortName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 3) {
      // JHOEL ALEJANDRO ESPIN TORRES -> JHOEL ESPIN
      return `${parts[0]} ${parts[2]}`;
    }
    // LIONEL MESSI -> LIONEL MESSI
    return fullName;
  };
    
  const generatePdfForPlayers = async (playersToPrint: Player[], teamNameForFile: string) => {
    if (playersToPrint.length === 0) return;
    setIsGenerating(true);

    try {
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const cardWidthMM = 55;
        const cardHeightMM = 75;
        const marginX = (pdf.internal.pageSize.getWidth() - (3 * cardWidthMM)) / 4;
        const marginY = (pdf.internal.pageSize.getHeight() - (3 * cardHeightMM)) / 4;

        const leagueLogoUrl = localStorage.getItem('league-logo') || 'https://placehold.co/100x100.png';
        const backgroundImageUrl = localStorage.getItem('card-background-image') || 'https://i.imgur.com/uP8hD5w.jpeg';
        
        const [backgroundImageBase64, leagueLogoBase64] = await Promise.all([
            toDataURL(backgroundImageUrl),
            toDataURL(leagueLogoUrl),
        ]);
        
        const playersWithImages = await Promise.all(playersToPrint.map(async (player) => {
            const host = window.location.host;
            const protocol = window.location.protocol;
            const profileUrl = `${protocol}//${host}/players/${player.id}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`;
            
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
            
            if (backgroundImageBase64) {
                 try {
                    const imgProps = pdf.getImageProperties(backgroundImageBase64);
                    pdf.addImage(backgroundImageBase64, imgProps.format, x, y, cardWidthMM, cardHeightMM);
                 } catch (e) {
                     console.error("Error adding background image:", e);
                     pdf.setFillColor('#1a233c');
                     pdf.roundedRect(x, y, cardWidthMM, cardHeightMM, 3, 3, 'F');
                 }
            } else {
                pdf.setFillColor('#1a233c');
                pdf.roundedRect(x, y, cardWidthMM, cardHeightMM, 3, 3, 'F');
            }
            
            pdf.setFillColor(0, 0, 0);
            pdf.setGState(new (pdf.GState as any)({opacity: 0.5}));
            pdf.rect(x, y, cardWidthMM, cardHeightMM, 'F');
            pdf.setGState(new (pdf.GState as any)({opacity: 1}));

            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#FFFFFF');
            pdf.text('LIGA DEPORTIVA BARRIAL', x + cardWidthMM / 2, y + 5, { align: 'center' });
            pdf.setFontSize(9);
            pdf.text('LA LUZ', x + cardWidthMM / 2, y + 9, { align: 'center' });

            const photoSize = 25;
            const photoX = x + (cardWidthMM - photoSize) / 2;
            const photoY = y + 13;
            pdf.setDrawColor('#FFA500');
            pdf.setLineWidth(1);
            pdf.rect(photoX, photoY, photoSize, photoSize, 'S');
            
            if (player.playerPhotoBase64) {
                try {
                    const imgProps = pdf.getImageProperties(player.playerPhotoBase64);
                    pdf.addImage(player.playerPhotoBase64, imgProps.format, photoX, photoY, photoSize, photoSize);
                } catch (e) {
                     console.error("Error adding player photo to PDF:", e);
                     pdf.setFillColor('#CCCCCC');
                     pdf.rect(photoX, photoY, photoSize, photoSize, 'F');
                }
            } else {
                pdf.setFillColor('#CCCCCC');
                pdf.rect(photoX, photoY, photoSize, photoSize, 'F');
            }

            const infoY = photoY + photoSize + 6;
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#FFA500');
            const shortName = getShortName(player.name);
            pdf.text(shortName.toUpperCase(), x + cardWidthMM / 2, infoY, { align: 'center', maxWidth: cardWidthMM - 10 });
            
            const detailsY = infoY + 5;
            pdf.setFontSize(9);
            pdf.setTextColor('#FFFFFF');
            pdf.text(player.team.toUpperCase(), x + cardWidthMM / 2, detailsY, { align: 'center' });
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(8);
            pdf.text(player.category.toUpperCase(), x + cardWidthMM / 2, detailsY + 4, { align: 'center' });
            
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`C.I: ${player.idNumber}`, x + cardWidthMM / 2, detailsY + 7, { align: 'center' });
            pdf.text(`F. Nac: ${player.birthDate}`, x + cardWidthMM / 2, detailsY + 10, { align: 'center' });

            const footerY = y + cardHeightMM - 16;
            const itemSize = 15;
            
            if (player.qrCodeBase64) {
                 try {
                    const qrProps = pdf.getImageProperties(player.qrCodeBase64);
                    pdf.addImage(player.qrCodeBase64, qrProps.format, x + 5, footerY, itemSize, itemSize);
                } catch(e) {
                    console.error("Error adding QR code to PDF:", e);
                }
            }

            if (leagueLogoBase64) {
                const logoX = x + cardWidthMM - itemSize - 5;
                 try {
                    const logoProps = pdf.getImageProperties(leagueLogoBase64);
                    pdf.addImage(leagueLogoBase64, logoProps.format, logoX, footerY, itemSize, itemSize);
                } catch(e) {
                    console.error("Error adding league logo to PDF:", e);
                }
            }

            const jerseyX = x + (cardWidthMM / 2);
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#FFA500'); 
            pdf.text(player.jerseyNumber.toString(), jerseyX, footerY + itemSize / 2 + 4, { align: 'center' });
        }

        pdf.save(`carnets_${teamNameForFile.replace(/\s+/g, '_')}.pdf`);
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

  const handleDownloadPdfByTeam = () => {
    if (!teamSelection.teamId) return;
    const selectedTeamName = allTeams.find(t => t.id === teamSelection.teamId)?.name || 'equipo';
    generatePdfForPlayers(selectedTeamPlayersForTeamSelection, selectedTeamName);
  };
  
  const handleDownloadPdfByIndividual = () => {
    const playersToPrint = allPlayers.filter(p => individualSelection.selectedPlayers.includes(p.id));
    const selectedTeamName = allTeams.find(t => t.id === individualSelection.teamId)?.name || 'jugadores';
    generatePdfForPlayers(playersToPrint, selectedTeamName);
  }

  const handleCategoryChangeForTeam = (value: string) => {
    setTeamSelection({ category: value as Category, teamId: null }); 
  };
  
  const handleTeamChangeForTeam = (value: string) => {
      setTeamSelection(prev => ({ ...prev, teamId: value }));
  }
  
  const handleCategoryChangeForIndividual = (value: string) => {
    setIndividualSelection({ category: value as Category, teamId: null, selectedPlayers: [] }); 
  };
  
  const handleTeamChangeForIndividual = (value: string) => {
    setIndividualSelection(prev => ({ ...prev, teamId: value, selectedPlayers: [] }));
  };
  
  const handlePlayerCheckboxChange = (playerId: string) => {
    setIndividualSelection(prev => {
        const newSelectedPlayers = prev.selectedPlayers.includes(playerId)
            ? prev.selectedPlayers.filter(id => id !== playerId)
            : [...prev.selectedPlayers, playerId];
        return { ...prev, selectedPlayers: newSelectedPlayers };
    });
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

      <main className="space-y-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Generación por Equipo Completo</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <h3 className="text-lg font-medium mb-2">1. Seleccionar Categoría</h3>
                    <Select onValueChange={handleCategoryChangeForTeam} value={teamSelection.category || ''} disabled={isLoadingData}>
                        <SelectTrigger>
                        <SelectValue placeholder={isLoadingData ? "Cargando..." : "Elige una categoría..."} />
                        </SelectTrigger>
                        <SelectContent>
                        {categories.map((category, index) => (
                            <SelectItem key={`${category}-${index}`} value={category}>
                            {category}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">2. Seleccionar Equipo</h3>
                    <Select onValueChange={handleTeamChangeForTeam} value={teamSelection.teamId || ''} disabled={!teamSelection.category || isLoadingData}>
                        <SelectTrigger>
                        <SelectValue placeholder={!teamSelection.category ? "Primero elige categoría" : "Elige un equipo..."} />
                        </SelectTrigger>
                        <SelectContent>
                        {filteredTeamsForTeamSelection.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                            {team.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    {teamSelection.teamId && (
                        <>
                            <h3 className="text-lg font-medium mb-2 invisible">3. Descargar</h3>
                            <Button onClick={handleDownloadPdfByTeam} className="w-full" disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                {isGenerating ? 'Generando PDF...' : `Descargar PDF (${selectedTeamPlayersForTeamSelection.length})`}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Generación Individual por Jugador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label>1. Seleccionar Categoría</Label>
                        <Select onValueChange={handleCategoryChangeForIndividual} value={individualSelection.category || ''} disabled={isLoadingData}>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingData ? "Cargando..." : "Elige una categoría..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category, index) => (
                                    <SelectItem key={`ind-${category}-${index}`} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label>2. Seleccionar Equipo</Label>
                        <Select onValueChange={handleTeamChangeForIndividual} value={individualSelection.teamId || ''} disabled={!individualSelection.category || isLoadingData}>
                            <SelectTrigger>
                                <SelectValue placeholder={!individualSelection.category ? "Primero elige categoría" : "Elige un equipo..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredTeamsForIndividualSelection.map((team) => (
                                    <SelectItem key={`ind-${team.id}`} value={team.id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {playersForIndividualSelection.length > 0 && (
                    <div className="space-y-4">
                        <Label>3. Seleccionar Jugadores</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-md max-h-60 overflow-y-auto">
                            {playersForIndividualSelection.map(player => (
                                <div key={player.id} className="flex items-center space-x-2">
                                     <Checkbox
                                        id={`player-${player.id}`}
                                        checked={individualSelection.selectedPlayers.includes(player.id)}
                                        onCheckedChange={() => handlePlayerCheckboxChange(player.id)}
                                    />
                                    <Label htmlFor={`player-${player.id}`} className="flex items-center gap-2 cursor-pointer">
                                        <Image src={player.photoUrl} alt={player.name} width={24} height={24} className="rounded-full" />
                                        {player.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={handleDownloadPdfByIndividual}
                            disabled={isGenerating || individualSelection.selectedPlayers.length === 0}
                        >
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            {isGenerating ? 'Generando...' : `Generar PDF para Seleccionados (${individualSelection.selectedPlayers.length})`}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
