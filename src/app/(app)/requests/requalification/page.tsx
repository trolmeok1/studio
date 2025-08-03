
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { teams as allTeams, getPlayersByTeamId, requalificationRequests as allRequests, type Player, type Team, type RequalificationRequest } from '@/lib/mock-data';
import { ArrowLeft, Printer, UserPlus, UserX, FileText, BadgeCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

const initialNewPlayerState = {
    number: '',
    firstName: '',
    lastName: '',
    idNumber: '',
};

type NewPlayer = typeof initialNewPlayerState;
type RequestType = 'qualification' | 'requalification';

const RequestHistory = () => {
    const [requests, setRequests] = useState<RequalificationRequest[]>(allRequests);

    const getStatusVariant = (status: RequalificationRequest['status']) => {
        switch (status) {
            case 'approved': return 'default';
            case 'rejected': return 'destructive';
            case 'pending': return 'secondary';
        }
    };
    
     const getStatusIcon = (status: RequalificationRequest['status']) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
            case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Historial de Solicitudes</CardTitle>
                <CardDescription>Revisa el estado de todas las solicitudes de calificación y recalificación.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Jugador Entrante</TableHead>
                            <TableHead>Jugador Saliente</TableHead>
                            <TableHead>Estado</TableHead>
                             <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell>{format(new Date(req.date), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{req.teamName}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{req.requestType === 'qualification' ? 'Calificación' : 'Recalificación'}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{req.playerInName}</TableCell>
                                <TableCell>{req.playerOutName || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(req.status)} className="flex items-center gap-1 w-fit">
                                        {getStatusIcon(req.status)}
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     {req.status === 'pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">Aprobar</Button>
                                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">Rechazar</Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function RequalificationPage() {
    const [step, setStep] = useState(1);
    const [requestType, setRequestType] = useState<RequestType | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [reason, setReason] = useState('');
    const [playerOutId, setPlayerOutId] = useState('');
    const [playerIn, setPlayerIn] = useState<NewPlayer>(initialNewPlayerState);
    const [presidentId, setPresidentId] = useState('');

    const selectedTeam = useMemo(() => allTeams.find(t => t.id === selectedTeamId), [selectedTeamId]);
    const teamPlayers = useMemo(() => selectedTeamId ? getPlayersByTeamId(selectedTeamId) : [], [selectedTeamId]);
    const playerOut = useMemo(() => teamPlayers.find(p => p.id === playerOutId), [playerOutId]);

    const handleNextStep = () => {
        const isQualificationValid = requestType === 'qualification' && selectedTeam && playerIn.firstName && playerIn.idNumber;
        const isRequalificationValid = requestType === 'requalification' && selectedTeam && playerOut && playerIn.firstName && playerIn.idNumber;

        if (isQualificationValid || isRequalificationValid) {
            setStep(2);
        } else {
            alert('Por favor, completa todos los campos requeridos.');
        }
    };
    
    const handlePrint = () => {
        window.print();
    }

    const resetForm = () => {
        setStep(1);
        setRequestType(null);
        setSelectedTeamId('');
        setReason('');
        setPlayerOutId('');
        setPlayerIn(initialNewPlayerState);
        setPresidentId('');
    };

    if (step === 2 && selectedTeam && (requestType === 'qualification' || playerOut)) {
        const documentTitle = requestType === 'qualification' ? 'CALIFICACIÓN' : 'RECALIFICACIÓN';
        const requestText = requestType === 'qualification'
            ? `Por medio de la Presente queremos solicitarles de la manera más atenta y comedida la calificación para el campeonato de la categoría ${selectedTeam.category.toUpperCase()}.`
            : `Por medio de la Presente queremos solicitarles de la manera más atenta y comedida la recalificación para el campeonato de la categoría ${selectedTeam.category.toUpperCase()}.`;
        const changeText = requestType === 'requalification' && playerOut
            ? `Solicito el cambio del Señor ${playerOut.name.toUpperCase()} con C.I. ${playerOut.idNumber} calificado con el Número ${playerOut.jerseyNumber} puesto que ${reason || 'el motivo especificado'}.`
            : `Puesto que ${reason || 'el motivo especificado'}.`;

        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Card className="print:shadow-none print:border-none">
                    <CardHeader className="print:hidden">
                        <CardTitle>Documento de {documentTitle.toLowerCase()} Generado</CardTitle>
                        <CardDescription>Los datos han sido guardados. Revisa el documento y procede a imprimir.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 print:hidden mb-6">
                            <Button variant="outline" onClick={resetForm}>
                                <ArrowLeft className="mr-2" />
                                Volver / Nueva Solicitud
                            </Button>
                             <Button onClick={handlePrint}>
                                <Printer className="mr-2" />
                                Imprimir Documento
                            </Button>
                        </div>

                        {/* Printable Document */}
                        <div id="printable-document" className="bg-white text-black p-8 max-w-2xl mx-auto border border-gray-300 print:border-none">
                            <header className="text-center mb-10">
                                <h1 className="text-2xl font-bold">"CLUB DEPORTIVO {selectedTeam.name.toUpperCase()}"</h1>
                                <p className="text-sm">FUNDADO EL 1 DE SEPTIEMBRE DEL 2001</p>
                            </header>

                            <div className="text-right mb-8">
                                <p>Quito, {format(new Date(), "d 'de' MMMM 'del' yyyy", { locale: es })}</p>
                            </div>

                            <div className="mb-6">
                                <p>Señores</p>
                                <p className="font-bold">COMISIÓN DE CALIFICACIÓN</p>
                                <p className="font-bold">LIGA BARRIAL LA LUZ</p>
                                <p>Presente.-</p>
                            </div>

                            <div className="space-y-4 text-justify leading-relaxed">
                                <p>Reciban un cordial saludo de quienes conformamos el Club Deportivo {selectedTeam.name}.</p>
                                <p>{requestText}</p>
                                <p>{changeText}</p>
                                <p>Por este motivo solicitamos la {documentTitle.toLowerCase()} del siguiente jugador:</p>
                            </div>

                            <table className="w-full border-collapse border border-black my-6 text-sm">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-black p-1">N.-</th>
                                        <th className="border border-black p-1">NOMBRES</th>
                                        <th className="border border-black p-1">APELLIDOS</th>
                                        <th className="border border-black p-1">N° CÉDULA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-1 text-center">{playerIn.number || playerOut?.jerseyNumber || ''}</td>
                                        <td className="border border-black p-1">{playerIn.firstName.toUpperCase()}</td>
                                        <td className="border border-black p-1">{playerIn.lastName.toUpperCase()}</td>
                                        <td className="border border-black p-1 text-center">{playerIn.idNumber}</td>
                                    </tr>
                                </tbody>
                            </table>

                             <p className="mb-8">
                                En espera de que la petición sea favorablemente acogida por ustedes nos despedimos.
                            </p>
                            <p className="text-xs text-muted-foreground mb-16">
                                Nota: Adjuntar copia de cédula a color del nuevo jugador.
                            </p>

                            <div className="text-center">
                                <p className="mb-12">Atentamente,</p>
                                <div className="inline-block border-t border-gray-600 px-16 pt-2">
                                     <p className="font-semibold">{selectedTeam.president?.name || '_____________________'}</p>
                                    <p>PRESIDENTE</p>
                                    <p>C.I. {presidentId || '_____________________'}</p>
                                    <p>Club Deportivo {selectedTeam.name}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <style jsx global>{`
                    @media print {
                        body {
                            background: white !important;
                            color: black !important;
                        }
                        .print\\:hidden { display: none !important; }
                        .print\\:shadow-none { box-shadow: none !important; }
                        .print\\:border-none { border: none !important; }
                        .flex-1.space-y-4 { padding: 0 !important; }
                        #printable-document {
                            max-width: 100% !important;
                            margin: 0 !important;
                            border: none !important;
                            padding: 0 !important;
                        }
                    }
                    @page {
                        size: A4 portrait;
                        margin: 2cm;
                    }
                `}</style>
            </div>
        );
    }

    if (!requestType) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle>Nueva Solicitud</CardTitle>
                        <CardDescription>Selecciona el tipo de solicitud que deseas realizar.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setRequestType('qualification')}>
                            <BadgeCheck className="h-8 w-8" />
                            <span className="text-lg">Calificación</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setRequestType('requalification')}>
                            <FileText className="h-8 w-8" />
                             <span className="text-lg">Recalificación</span>
                        </Button>
                    </CardContent>
                </Card>
                <RequestHistory />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Solicitud de {requestType === 'qualification' ? 'Calificación' : 'Recalificación'} de Jugador</CardTitle>
                            <CardDescription>Paso 1 de 2: Completa la información para la solicitud.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setRequestType(null)}>Cambiar Tipo</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Team and Reason Section */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg">1. Datos de la Solicitud</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="team">Equipo</Label>
                                <Select onValueChange={setSelectedTeamId} value={selectedTeamId}>
                                    <SelectTrigger id="team">
                                        <SelectValue placeholder="Selecciona un equipo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allTeams.map(team => (
                                            <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="presidentId">Cédula del Presidente</Label>
                                <Input id="presidentId" value={presidentId} onChange={e => setPresidentId(e.target.value)} placeholder="C.I. del presidente del club" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="reason">Razón de la {requestType === 'qualification' ? 'Calificación' : 'Recalificación'} (Puesto que...)</Label>
                            <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder={requestType === 'qualification' ? "Ej: ...el jugador es un nuevo refuerzo para el equipo." : "Ej: ...el jugador anterior no ha pisado cancha."} />
                        </div>
                    </div>

                    {/* Players Section */}
                    <div className={`grid ${requestType === 'requalification' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
                        {/* Player Out */}
                        {requestType === 'requalification' && (
                            <div className="space-y-4 p-4 border rounded-lg border-destructive">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><UserX className="text-destructive"/> 2. Jugador Saliente</h3>
                                <Select onValueChange={setPlayerOutId} value={playerOutId} disabled={!selectedTeamId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={selectedTeamId ? "Selecciona el jugador a reemplazar..." : "Primero elige un equipo"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamPlayers.map(player => (
                                            <SelectItem key={player.id} value={player.id}>{player.name} (C.I. {player.idNumber})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {playerOut && (
                                    <Card className="bg-muted/50 p-3 text-sm">
                                        <p><strong>Nombre:</strong> {playerOut.name}</p>
                                        <p><strong>Cédula:</strong> {playerOut.idNumber}</p>
                                        <p><strong>Número Camiseta:</strong> {playerOut.jerseyNumber}</p>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* Player In */}
                        <div className="space-y-4 p-4 border rounded-lg border-primary">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><UserPlus className="text-primary"/> {requestType === 'requalification' ? '3.' : '2.'} Jugador Entrante</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="playerInFirstName">Nombres</Label>
                                    <Input id="playerInFirstName" value={playerIn.firstName} onChange={e => setPlayerIn({...playerIn, firstName: e.target.value})} placeholder="Nombres completos" />
                                </div>
                                <div>
                                    <Label htmlFor="playerInLastName">Apellidos</Label>
                                    <Input id="playerInLastName" value={playerIn.lastName} onChange={e => setPlayerIn({...playerIn, lastName: e.target.value})} placeholder="Apellidos completos" />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="playerInId">Número de Cédula</Label>
                                    <Input id="playerInId" value={playerIn.idNumber} onChange={e => setPlayerIn({...playerIn, idNumber: e.target.value})} placeholder="C.I. del nuevo jugador" />
                                </div>
                                <div>
                                    <Label htmlFor="playerInNumber">N° Camiseta</Label>
                                    <Input 
                                        id="playerInNumber" 
                                        type="number" 
                                        value={playerIn.number} 
                                        onChange={e => setPlayerIn({...playerIn, number: e.target.value})} 
                                        placeholder={requestType === 'requalification' && playerOut ? `Reemplaza N° ${playerOut.jerseyNumber}` : "N°"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Button onClick={handleNextStep} className="w-full" size="lg">
                        Generar Documento de {requestType === 'qualification' ? 'Calificación' : 'Recalificación'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
