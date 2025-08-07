
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
        setPresidentIdNumber('');
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
        if (!selectedTeamId || !requestType || !playerInName || !playerInIdNumber || !playerInBirthDate || !playerInJerseyNumber || !profilePhoto || !idCardPhoto || !presidentIdNumber) {
            hasError = true;
        }
        if (requestType === 'requalification' && (!playerOutId || !reason)) {
            hasError = true;
        }

        if (hasError) {
            toast({
                title: 'Campos incompletos',
                description: 'Por favor, completa todos los campos requeridos para generar la solicitud.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const playerOut = players.find(p => p.id === playerOutId);
            
            const newRequestData: Omit<RequalificationRequest, 'id' | 'playerInPhotoUrl' | 'playerInIdCardUrl'> = {
                teamId: selectedTeam!.id,
                teamName: selectedTeam!.name,
                teamLogoUrl: selectedTeam!.logoUrl,
                requestType: requestType as RequestType,
                date: new Date().toISOString(),
                status: 'pending',
                
                presidentName: selectedTeam!.president?.name || 'N/A',
                presidentIdNumber,

                playerInName,
                playerInIdNumber,
                playerInBirthDate,
                playerInJerseyNumber,
                
                playerOutName: playerOut?.name || null,
                playerOutIdNumber: playerOut?.idNumber || null,
                reason: reason || null,
            };

            const createdRequest = await addRequalificationRequest(newRequestData, profilePhotoPreview, idCardPhotoPreview);
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
                const printWindow = window.open('', '', 'height=800,width=800');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>Comprobante de Solicitud</title>');
                    printWindow.document.write('<style>body{font-family:serif;padding:20px;color:black;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #000;padding:8px;text-align:left;}th{background-color:#e0e0e0;} .signature { margin-top: 60px; text-align: center; } .signature-line { border-top: 1px solid black; width: 250px; margin: 0 auto; } .photo-section { margin-top: 20px; page-break-before: always; } .photo-container { margin-top: 10px; }</style>');
                    printWindow.document.write('</head><body>');
                    printWindow.document.write(printContent.innerHTML);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.print();
                }
            }
        };

        if (!request) return null;

        const bodyText = request.requestType === 'recalibration' 
            ? `Por medio de la Presente queremos solicitarles de la manera más atenta y comedida la recalificación para la segunda vuelta del campeonato de la categoría ${selectedTeam?.category}.<br/><br/>
               Solicito el cambio del Señor ${request.playerOutName} con C.I ${request.playerOutIdNumber} puesto que ${request.reason}.<br/><br/>
               Por este motivo solicitamos la recalificación del siguiente jugador:`
            : `Por medio de la Presente queremos solicitarles de la manera más atenta y comedida la calificación para la segunda vuelta del campeonato de la categoría ${selectedTeam?.category}.<br/><br/>
               Por este motivo solicitamos la calificación del siguiente jugador:`;

        return (
            <Card className="mt-8 border-primary">
                <CardHeader>
                    <CardTitle>Solicitud Generada Exitosamente</CardTitle>
                    <CardDescription>Revisa el documento y procede a imprimirlo para presentarlo.</CardDescription>
                </CardHeader>
                <CardContent className="border rounded-md p-4 bg-white text-black">
                    <div ref={printRef}>
                        <header className="text-center mb-10">
                            {request.teamLogoUrl && <Image src={request.teamLogoUrl} alt={request.teamName} width={80} height={80} className="mx-auto mb-2" />}
                            <h2 className="text-2xl font-bold uppercase">"CLUB DEPORTIVO {request.teamName}"</h2>
                        </header>
                        <p className="text-right mb-6">Quito, {format(new Date(request.date), 'dd \'de\' MMMM \'del\' yyyy', { locale: es })}</p>
                        <div className="mb-6">
                            <p>Señores</p>
                            <p className="font-bold">COMISION DE CALIFICACION</p>
                            <p className="font-bold">LIGA BARRIAL LA LUZ</p>
                            <p>Presente.-</p>
                        </div>
                        <p className="mb-6">Reciban un cordial saludo de quienes conformamos el Club Deportivo {request.teamName}.</p>
                        <p className="mb-6" dangerouslySetInnerHTML={{ __html: bodyText }}></p>
                         <table>
                            <thead>
                                <tr>
                                    <th>N.-</th>
                                    <th>NOMBRES Y APELLIDOS</th>
                                    <th>N° CEDULA</th>
                                    <th>FECHA DE NACIMIENTO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{request.playerInJerseyNumber}</td>
                                    <td>{request.playerInName}</td>
                                    <td>{request.playerInIdNumber}</td>
                                    <td>{request.playerInBirthDate}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mt-6">En espera de que la petición sea favorablemente acogida por ustedes nos despedimos.</p>
                        <div className="signature">
                            <p>Atentamente,</p>
                            <div className="h-20">{/* Espacio para firma */}</div>
                            <div className="signature-line"></div>
                            <p>{request.presidentName}</p>
                            <p>PRESIDENTE</p>
                            <p>C.I. {request.presidentIdNumber}</p>
                            <p>Club Deportivo {request.teamName}</p>
                        </div>
                         <div className="photo-section">
                            <h3>Documentos Adjuntos</h3>
                             <div className="photo-container">
                                <h4>Foto de Perfil</h4>
                                {request.playerInPhotoUrl && <img src={request.playerInPhotoUrl} alt="Foto de perfil" style={{ maxWidth: '200px', border: '1px solid #ccc', padding: '5px' }} />}
                            </div>
                            <div className="photo-container">
                                <h4>Foto de Cédula</h4>
                                {request.playerInIdCardUrl && <img src={request.playerInIdCardUrl} alt="Foto de cédula" style={{ maxWidth: '300px', border: '1px solid #ccc', padding: '5px' }} />}
                            </div>
                         </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setLastRequest(null)}>Cerrar</Button>
                    <Button onClick={handlePrint}><Printer className="mr-2"/>Imprimir Documento</Button>
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
                                    <Label htmlFor="presidentIdNumber">Cédula del Presidente</Label>
                                    <Input id="presidentIdNumber" value={presidentIdNumber} onChange={(e) => setPresidentIdNumber(e.target.value)} placeholder="Cédula del presidente del equipo" />
                                </div>
                                
                                {requestType === 'requalification' && (
                                    <>
                                        <div className="space-y-1">
                                            <Label htmlFor="playerOut">Jugador Saliente</Label>
                                            <Select onValueChange={setPlayerOutId} value={playerOutId || ''} disabled={players.length === 0}>
                                                <SelectTrigger id="playerOut"><SelectValue placeholder="Selecciona el jugador a dar de baja..." /></SelectTrigger>
                                                <SelectContent>
                                                    {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="reason">Motivo del Cambio</Label>
                                            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej: No ha pisado cancha, lesión, etc." />
                                        </div>
                                    </>
                                )}
                                
                                <Card className="p-4 mt-4">
                                    <CardTitle className="text-lg mb-4">Información del Jugador Entrante</CardTitle>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label htmlFor="playerInName">Nombre Completo</Label>
                                                <Input id="playerInName" value={playerInName} onChange={(e) => setPlayerInName(e.target.value)} placeholder="Nombre del nuevo jugador" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="playerInIdNumber">N° de Cédula</Label>
                                                <Input id="playerInIdNumber" value={playerInIdNumber} onChange={(e) => setPlayerInIdNumber(e.target.value)} placeholder="Cédula del nuevo jugador" />
                                            </div>
                                        </div>
                                         <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label htmlFor="playerInBirthDate">Fecha de Nacimiento</Label>
                                                <Input id="playerInBirthDate" type="date" value={playerInBirthDate} onChange={(e) => setPlayerInBirthDate(e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="playerInJerseyNumber">N° de Camiseta</Label>
                                                <Input id="playerInJerseyNumber" type="number" value={playerInJerseyNumber} onChange={(e) => setPlayerInJerseyNumber(e.target.value)} placeholder="Ej: 10" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="space-y-2">
                                                <Label>Foto de Perfil (Tipo Carnet)</Label>
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-20 h-20">
                                                        {profilePhotoPreview ? <AvatarImage src={profilePhotoPreview} /> : null}
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
                                    </div>
                                </Card>
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading || !requestType}>
                            <UserPlus className="mr-2" />
                            {isLoading ? 'Enviando...' : 'Generar y Enviar Solicitud'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
