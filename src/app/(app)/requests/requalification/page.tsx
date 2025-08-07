
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTeams, getPlayersByTeamId, type Player, type Team, type RequalificationRequest, addRequalificationRequest } from '@/lib/mock-data';
import { UserPlus, Printer, FileUp, User, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type RequestType = 'qualification' | 'requalification';

export default function RequalificationRequestPage() {
    const { toast } = useToast();
    const { user } = useAuth();

    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [requestType, setRequestType] = useState<RequestType | ''>('');
    
    // Form fields
    const [playerInName, setPlayerInName] = useState('');
    const [playerOutId, setPlayerOutId] = useState<string | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [idCardPhoto, setIdCardPhoto] = useState<File | null>(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [idCardPhotoPreview, setIdCardPhotoPreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [lastRequest, setLastRequest] = useState<RequalificationRequest | null>(null);

    useEffect(() => {
        getTeams().then(setTeams);
    }, []);

    useEffect(() => {
        if (selectedTeamId) {
            getPlayersByTeamId(selectedTeamId).then(setPlayers);
        } else {
            setPlayers([]);
        }
    }, [selectedTeamId]);

    const resetForm = () => {
        setPlayerInName('');
        setPlayerOutId(null);
        setProfilePhoto(null);
        setIdCardPhoto(null);
        setProfilePhotoPreview(null);
        setIdCardPhotoPreview(null);
        setRequestType('');
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'id') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'profile') {
                    setProfilePhoto(file);
                    setProfilePhotoPreview(reader.result as string);
                } else {
                    setIdCardPhoto(file);
                    setIdCardPhotoPreview(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let hasError = false;
        if (!selectedTeamId || !requestType || !playerInName) {
            hasError = true;
        }
        if (requestType === 'requalification' && !playerOutId) {
            hasError = true;
        }
        if (requestType === 'qualification' && (!profilePhoto || !idCardPhoto)) {
            hasError = true;
        }

        if (hasError) {
            toast({
                title: 'Campos incompletos',
                description: 'Por favor, completa todos los campos requeridos para el tipo de solicitud.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        const team = teams.find(t => t.id === selectedTeamId)!;

        try {
            // In a real app, you would upload photos and get URLs first
            const newRequestData: Omit<RequalificationRequest, 'id'> = {
                teamId: team.id,
                teamName: team.name,
                requestType: requestType as RequestType,
                playerInName,
                playerOutName: requestType === 'requalification' ? players.find(p => p.id === playerOutId)?.name || null : null,
                date: new Date().toISOString(),
                status: 'pending',
                // Mock URLs
                playerInPhotoUrl: profilePhotoPreview, 
                playerInIdCardUrl: idCardPhotoPreview,
            };

            const createdRequest = await addRequalificationRequest(newRequestData);
            setLastRequest(createdRequest);

            toast({
                title: 'Solicitud Enviada',
                description: `Tu solicitud de ${requestType === 'qualification' ? 'nuevo ingreso' : 'recalificación'} ha sido enviada para aprobación.`,
            });
            resetForm();
            setSelectedTeamId('');

        } catch (error) {
             toast({ title: 'Error', description: 'No se pudo enviar la solicitud.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const PrintSection = ({ request }: { request: RequalificationRequest | null }) => {
        const printRef = useRef<HTMLDivElement>(null);
        
        const handlePrint = () => {
            const printContent = printRef.current;
            if (printContent) {
                const printWindow = window.open('', '', 'height=600,width=800');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>Comprobante de Solicitud</title>');
                    printWindow.document.write('<style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style>');
                    printWindow.document.write('</head><body>');
                    printWindow.document.write(printContent.innerHTML);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.print();
                }
            }
        };

        if (!request) return null;

        return (
            <Card className="mt-8 border-primary">
                <CardHeader>
                    <CardTitle>Solicitud Enviada Exitosamente</CardTitle>
                    <CardDescription>Guarda o imprime este comprobante de tu solicitud.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div ref={printRef}>
                        <h3>Detalles de la Solicitud</h3>
                        <table>
                            <tbody>
                                <tr><th>Equipo</th><td>{request.teamName}</td></tr>
                                <tr><th>Fecha</th><td>{format(new Date(request.date), 'PPpp', { locale: es })}</td></tr>
                                <tr><th>Tipo</th><td>{request.requestType}</td></tr>
                                <tr><th>Jugador Entrante</th><td>{request.playerInName}</td></tr>
                                {request.requestType === 'requalification' && (
                                    <tr><th>Jugador Saliente</th><td>{request.playerOutName}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {request.requestType === 'qualification' && (
                         <div className="flex gap-4 mt-4">
                            {request.playerInPhotoUrl && (
                                <div>
                                    <Label>Foto de Perfil</Label>
                                    <Image src={request.playerInPhotoUrl} alt="Foto de perfil" width={100} height={100} className="rounded-md border p-1" />
                                </div>
                            )}
                             {request.playerInIdCardUrl && (
                                <div>
                                    <Label>Foto de Cédula</Label>
                                    <Image src={request.playerInIdCardUrl} alt="Foto de cédula" width={150} height={100} className="rounded-md border p-1 object-contain" />
                                </div>
                            )}
                         </div>
                    )}
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button variant="outline" onClick={() => setLastRequest(null)}>Cerrar</Button>
                    <Button onClick={handlePrint}><Printer className="mr-2"/>Imprimir Comprobante</Button>
                </CardFooter>
            </Card>
        );
    }

    if (lastRequest) {
        return (
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <PrintSection request={lastRequest} />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="text-center">
                 <h2 className="text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
                       Solicitud de Calificación
                    </span>
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                    Genera una nueva solicitud de ingreso o recalificación de jugador para tu equipo.
                </p>
            </div>
            
            <Card className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Formulario de Solicitud</CardTitle>
                        <CardDescription>Completa todos los campos para generar la solicitud. Será revisada por la directiva.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <Label htmlFor="team">Tu Equipo</Label>
                                <Select onValueChange={setSelectedTeamId} value={selectedTeamId}>
                                    <SelectTrigger id="team"><SelectValue placeholder="Selecciona tu equipo" /></SelectTrigger>
                                    <SelectContent>{teams.map(team => <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="requestType">Tipo de Solicitud</Label>
                                <Select onValueChange={(v) => setRequestType(v as RequestType)} value={requestType} disabled={!selectedTeamId}>
                                    <SelectTrigger id="requestType"><SelectValue placeholder="Selecciona el tipo..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="qualification"><UserPlus className="mr-2" />Nuevo Ingreso</SelectItem>
                                        <SelectItem value="requalification"><Repeat className="mr-2" />Recalificación</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {requestType && (
                            <>
                                 <div className="space-y-1">
                                    <Label htmlFor="playerInName">Nombre del Jugador Entrante</Label>
                                    <Input id="playerInName" value={playerInName} onChange={(e) => setPlayerInName(e.target.value)} placeholder="Nombre completo del nuevo jugador" />
                                </div>
                                {requestType === 'requalification' && (
                                     <div className="space-y-1">
                                        <Label htmlFor="playerOut">Jugador Saliente</Label>
                                        <Select onValueChange={setPlayerOutId} value={playerOutId || ''} disabled={players.length === 0}>
                                            <SelectTrigger id="playerOut"><SelectValue placeholder="Selecciona el jugador a dar de baja..." /></SelectTrigger>
                                            <SelectContent>
                                                {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                 {requestType === 'qualification' && (
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="space-y-2">
                                            <Label>Foto de Perfil (Tipo Carnet)</Label>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-20 h-20">
                                                    {profilePhotoPreview && <AvatarImage src={profilePhotoPreview} />}
                                                    <AvatarFallback><User /></AvatarFallback>
                                                </Avatar>
                                                <Button asChild variant="outline">
                                                    <label htmlFor="profile-photo" className="cursor-pointer">
                                                        <FileUp className="mr-2" /> Subir
                                                        <input id="profile-photo" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'profile')} />
                                                    </label>
                                                </Button>
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Foto de Cédula (Frontal)</Label>
                                            <div className="flex items-center gap-4">
                                                 <div className="w-32 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                                    {idCardPhotoPreview ? <Image src={idCardPhotoPreview} alt="Cédula" width={128} height={80} className="object-contain" /> : <FileUp className="text-muted-foreground" />}
                                                 </div>
                                                <Button asChild variant="outline">
                                                    <label htmlFor="id-card-photo" className="cursor-pointer">
                                                        <FileUp className="mr-2" /> Subir
                                                        <input id="id-card-photo" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'id')} />
                                                    </label>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                 )}
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading || !requestType}>
                            <UserPlus className="mr-2" />
                            {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
