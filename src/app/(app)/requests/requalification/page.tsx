
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
import { Textarea } from '@/components/ui/textarea';

type RequestType = 'qualification' | 'requalification';

export default function RequalificationRequestPage() {
    const { toast } = useToast();
    const { user } = useAuth();

    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [requestType, setRequestType] = useState<RequestType | ''>('');
    
    // Form fields
    const [presidentName, setPresidentName] = useState('');
    const [presidentIdNumber, setPresidentIdNumber] = useState('');

    const [playerInName, setPlayerInName] = useState('');
    const [playerInIdNumber, setPlayerInIdNumber] = useState('');
    const [playerInBirthDate, setPlayerInBirthDate] = useState('');
    const [playerInJerseyNumber, setPlayerInJerseyNumber] = useState('');
    const [reason, setReason] = useState('');
    
    const [playerOutId, setPlayerOutId] = useState<string | null>(null);

    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [idCardPhoto, setIdCardPhoto] = useState<File | null>(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [idCardPhotoPreview, setIdCardPhotoPreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [lastRequest, setLastRequest] = useState<RequalificationRequest | null>(null);
    
    const selectedTeam = useMemo(() => teams.find(t => t.id === selectedTeamId), [teams, selectedTeamId]);
    const selectedPlayerOut = useMemo(() => players.find(p => p.id === playerOutId), [players, playerOutId]);

    useEffect(() => {
        getTeams().then(setTeams);
    }, []);

    useEffect(() => {
        if (selectedTeamId) {
            getPlayersByTeamId(selectedTeamId).then(setPlayers);
            const team = teams.find(t => t.id === selectedTeamId);
            if(team?.president) {
                setPresidentName(team.president.name);
                setPresidentIdNumber(team.president.idNumber || '');
            }
        } else {
            setPlayers([]);
            setPresidentName('');
            setPresidentIdNumber('');
        }
    }, [selectedTeamId, teams]);

    const resetForm = () => {
        setPlayerInName('');
        setPlayerInIdNumber('');
        setPlayerInBirthDate('');
        setPlayerInJerseyNumber('');
        setReason('');
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
        const requiredFields = [selectedTeamId, requestType, presidentName, presidentIdNumber, playerInName, playerInIdNumber, playerInBirthDate, playerInJerseyNumber, reason, profilePhoto, idCardPhoto];

        if (requiredFields.some(field => !field)) {
             hasError = true;
        }

        if (requestType === 'requalification' && !playerOutId) {
            hasError = true;
        }

        if (hasError) {
            toast({
                title: 'Campos incompletos',
                description: 'Por favor, completa todos los campos requeridos, incluyendo las fotos.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const newRequestData: Omit<RequalificationRequest, 'id'> = {
                teamId: selectedTeam!.id,
                teamName: selectedTeam!.name,
                teamLogoUrl: selectedTeam!.logoUrl,
                requestType: requestType as RequestType,
                date: new Date().toISOString(),
                status: 'pending',
                presidentName,
                presidentIdNumber,
                playerInName,
                playerInIdNumber,
                playerInBirthDate,
                playerInJerseyNumber,
                playerInPhotoUrl: profilePhotoPreview!, 
                playerInIdCardUrl: idCardPhotoPreview!,
                playerOutId: requestType === 'requalification' ? playerOutId : null,
                playerOutName: requestType === 'requalification' ? selectedPlayerOut?.name || null : null,
                playerOutIdNumber: requestType === 'requalification' ? selectedPlayerOut?.idNumber || null : null,
                playerOutJerseyNumber: requestType === 'requalification' ? selectedPlayerOut?.jerseyNumber.toString() || null : null,
                reason,
            };

            const createdRequest = await addRequalificationRequest(newRequestData);
            setLastRequest(createdRequest);

            toast({
                title: 'Solicitud Enviada',
                description: `Tu solicitud ha sido enviada para aprobación.`,
            });
            resetForm();
            setSelectedTeamId('');

        } catch (error) {
             console.error("Error al enviar solicitud:", error)
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
                const printWindow = window.open('', '', 'height=800,width=800');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>Comprobante de Solicitud</title>');
                    printWindow.document.write('<style>body{font-family:sans-serif;}.page-break{page-break-before:always;}</style>');
                    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">');
                    printWindow.document.write('</head><body class="p-4">');
                    printWindow.document.write(printContent.innerHTML);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    // Wait for images to load
                    setTimeout(() => {
                        printWindow.print();
                    }, 500); 
                }
            }
        };

        if (!request) return null;

        const splitName = (fullName: string) => {
            const parts = fullName.split(' ');
            const firstName = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
            const lastName = parts.slice(Math.ceil(parts.length / 2)).join(' ');
            return { firstName, lastName };
        };
        const playerInNames = splitName(request.playerInName);


        return (
            <Card className="mt-8 border-primary">
                <CardHeader>
                    <CardTitle>Solicitud Enviada Exitosamente</CardTitle>
                    <CardDescription>Guarda o imprime este comprobante de tu solicitud.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div ref={printRef} className="bg-white text-black text-sm">
                        {/* --- Page 1: Formal Letter --- */}
                        <div className="p-8 border border-gray-300">
                             <header className="text-center mb-6">
                                <Image src={request.teamLogoUrl} alt={`Logo ${request.teamName}`} width={80} height={80} className="mx-auto mb-2" />
                                <h1 className="text-xl font-bold uppercase">{`"CLUB DEPORTIVO ${request.teamName.toUpperCase()}"`}</h1>
                            </header>
                            <p className="text-right mb-6">Quito, {format(new Date(request.date), "dd 'de' MMMM 'del' yyyy", { locale: es })}</p>
                            <div className="mb-4">
                                <p>Señores</p>
                                <p className="font-bold">COMISION DE CALIFICACION</p>
                                <p className="font-bold">LIGA BARRIAL LA LUZ</p>
                                <p>Presente.-</p>
                            </div>
                            <p className="mb-4">Reciban un cordial saludo de quienes conformamos el Club Deportivo {request.teamName}.</p>
                            <p className="mb-4">Por medio de la Presente queremos solicitarles de la manera más atenta y comedida la {request.requestType === 'qualification' ? 'calificación' : 'recalificación'} para el campeonato de la categoría {selectedTeam?.category}.</p>
                             {request.requestType === 'requalification' && request.playerOutName && (
                                <p className="mb-4">
                                    Solicito el cambio del Señor {request.playerOutName.toUpperCase()} con C.I {request.playerOutIdNumber} calificado con el Número {request.playerOutJerseyNumber} puesto que {request.reason}.
                                </p>
                             )}
                            <p className="mb-4">Por este motivo solicitamos la {request.requestType === 'qualification' ? 'calificación' : 'recalificación'} del siguiente jugador:</p>

                             <table className="w-full border-collapse border border-black my-4">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-black p-1">N.-</th>
                                        <th className="border border-black p-1">NOMBRES</th>
                                        <th className="border border-black p-1">APELLIDOS</th>
                                        <th className="border border-black p-1">Nº CEDULA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-1 text-center">{request.playerInJerseyNumber}</td>
                                        <td className="border border-black p-1">{playerInNames.firstName}</td>
                                        <td className="border border-black p-1">{playerInNames.lastName}</td>
                                        <td className="border border-black p-1">{request.playerInIdNumber}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className="mb-12">En espera de que la petición sea favorablemente acogida por ustedes nos despedimos.</p>

                            <div className="text-center">
                                <p>Atentamente,</p>
                                <div className="w-64 h-16 mx-auto"></div>
                                <p className="border-t border-black w-64 mx-auto pt-1">{request.presidentName}</p>
                                <p>PRESIDENTE</p>
                                <p>C.I. {request.presidentIdNumber}</p>
                                <p>Club Deportivo {request.teamName}</p>
                            </div>
                        </div>

                        {/* --- Page 2: Evidence --- */}
                        <div className="page-break p-8">
                             <h2 className="text-xl font-bold text-center mb-6">HOJA DE EVIDENCIA</h2>
                             <div className="grid grid-cols-1 gap-8">
                                <div className="text-center">
                                    <h3 className="font-semibold mb-2">Foto de Perfil del Jugador Entrante</h3>
                                     <Image src={request.playerInPhotoUrl} alt="Foto de perfil" width={200} height={250} className="rounded-md border p-1 mx-auto object-contain" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold mb-2">Foto de Cédula del Jugador Entrante</h3>
                                    <Image src={request.playerInIdCardUrl} alt="Foto de cédula" width={350} height={220} className="rounded-md border p-1 mx-auto object-contain" />
                                </div>
                             </div>
                        </div>

                    </div>
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
            
            <Card className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Formulario de Solicitud</CardTitle>
                        <CardDescription>Completa todos los campos para generar la solicitud. Será revisada por la directiva.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Datos del Presidente del Club</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="presidentName">Nombre Completo del Presidente</Label>
                                    <Input id="presidentName" value={presidentName} onChange={(e) => setPresidentName(e.target.value)} placeholder="Nombre del presidente" />
                                </div>
                                <div>
                                    <Label htmlFor="presidentIdNumber">Cédula del Presidente</Label>
                                    <Input id="presidentIdNumber" value={presidentIdNumber} onChange={(e) => setPresidentIdNumber(e.target.value)} placeholder="Cédula del presidente" />
                                </div>
                            </CardContent>
                        </Card>


                        {requestType && (
                            <>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Datos del Jugador Entrante</CardTitle>
                                    </CardHeader>
                                     <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="playerInName">Nombre Completo</Label>
                                                <Input id="playerInName" value={playerInName} onChange={(e) => setPlayerInName(e.target.value)} placeholder="Nombres y apellidos" />
                                            </div>
                                             <div>
                                                <Label htmlFor="playerInIdNumber">Cédula</Label>
                                                <Input id="playerInIdNumber" value={playerInIdNumber} onChange={(e) => setPlayerInIdNumber(e.target.value)} placeholder="Número de cédula" />
                                            </div>
                                        </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="playerInBirthDate">Fecha de Nacimiento</Label>
                                                <Input id="playerInBirthDate" type="date" value={playerInBirthDate} onChange={(e) => setPlayerInBirthDate(e.target.value)} />
                                            </div>
                                             <div>
                                                <Label htmlFor="playerInJerseyNumber">Número de Camiseta</Label>
                                                <Input id="playerInJerseyNumber" type="number" value={playerInJerseyNumber} onChange={(e) => setPlayerInJerseyNumber(e.target.value)} placeholder="Ej: 10" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {requestType === 'requalification' && (
                                     <div className="space-y-1">
                                        <Label htmlFor="playerOut">Jugador Saliente</Label>
                                        <Select onValueChange={setPlayerOutId} value={playerOutId || ''} disabled={players.length === 0}>
                                            <SelectTrigger id="playerOut"><SelectValue placeholder="Selecciona el jugador a dar de baja..." /></SelectTrigger>
                                            <SelectContent>
                                                {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (Nº {p.jerseyNumber})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                
                                <div className="space-y-1">
                                    <Label htmlFor="reason">Motivo de la Solicitud</Label>
                                    <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explica brevemente el motivo de este cambio o nuevo ingreso..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="space-y-2">
                                        <Label>Foto de Perfil (Tipo Carnet)</Label>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-20 h-20">
                                                {profilePhotoPreview && <AvatarImage src={profilePhotoPreview} />}
                                                <AvatarFallback><User /></AvatarFallback>
                                            </Avatar>
                                            <Button asChild variant="outline">
                                                <label htmlFor="profile-photo" className="cursor-pointer">
                                                    <FileUp className="mr-2" /> Subir Foto
                                                    <input id="profile-photo" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'profile')} accept="image/*" />
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
                                                    <FileUp className="mr-2" /> Subir Cédula
                                                    <input id="id-card-photo" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'id')} accept="image/*" />
                                                </label>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
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
