
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getTeams, getPlayersByTeamId, getRequalificationRequests, type Player, type Team, type RequalificationRequest } from '@/lib/mock-data';
import { ArrowLeft, Printer, UserPlus, UserX, FileText, BadgeCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type RequestType = 'qualification' | 'requalification';

const RequestHistory = () => {
    const [requests, setRequests] = useState<RequalificationRequest[]>([]);

    useEffect(() => {
        async function loadRequests() {
            const data = await getRequalificationRequests();
            setRequests(data);
        }
        loadRequests();
    }, []);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'approved': return 'default';
            case 'rejected': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="h-3 w-3" />;
            case 'rejected': return <XCircle className="h-3 w-3" />;
            default: return <Clock className="h-3 w-3" />;
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Solicitudes</CardTitle>
                <CardDescription>Revisa el estado de las solicitudes de calificación y recalificación enviadas.</CardDescription>
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
                                <TableCell>{req.date && !isNaN(new Date(req.date).getTime()) ? format(new Date(req.date), 'dd/MM/yyyy') : ''}</TableCell>
                                <TableCell>{req.teamName}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{req.requestType === 'qualification' ? 'Calificación' : 'Recalificación'}</Badge>
                                </TableCell>
                                <TableCell>{req.playerInName}</TableCell>
                                <TableCell>{req.playerOutName || 'N/A'}</TableCell>
                                <TableCell>
                                     <Badge variant={getStatusVariant(req.status)} className="flex items-center gap-1 w-fit">
                                        {getStatusIcon(req.status)}
                                        {req.status && req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};


export default function RequalificationPage() {
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [step, setStep] = useState(1);
    const [requestType, setRequestType] = useState<RequestType | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
    const [playerOut, setPlayerOut] = useState<Player | null>(null);
    const [playerIn, setPlayerIn] = useState({ name: '', idNumber: '', birthDate: '' });
    const [documentReady, setDocumentReady] = useState(false);

    useEffect(() => {
        async function loadTeams() {
            const teamsData = await getTeams();
            setAllTeams(teamsData);
        }
        loadTeams();
    }, []);

    const handleTeamChange = async (teamId: string) => {
        const team = allTeams.find(t => t.id === teamId) || null;
        setSelectedTeam(team);
        if (team) {
            const players = await getPlayersByTeamId(teamId);
            setTeamPlayers(players);
        } else {
            setTeamPlayers([]);
        }
    };

    const handleProceed = () => {
        setStep(step + 1);
    };

    const handleGenerateDocument = () => {
        if (!requestType || !selectedTeam || !playerIn.name || !playerIn.idNumber || !playerIn.birthDate) {
            // Add user feedback here, e.g., a toast notification
            return;
        }
        if (requestType === 'requalification' && !playerOut) {
            // Add user feedback here
            return;
        }
        setDocumentReady(true);
    };
    
     const handlePrint = () => {
        window.print();
    };

    if (documentReady) {
        const documentTitle = requestType === 'qualification' ? 'Calificación de Jugador' : 'Recalificación de Jugador';
        
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Card className="print:shadow-none print:border-none">
                    <CardHeader className="print:hidden">
                        <CardTitle>Documento de {documentTitle.toLowerCase()} Generado</CardTitle>
                        <CardDescription>
                            Este es el documento oficial para la solicitud. Imprímelo, recoge las firmas necesarias y preséntalo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="font-serif text-black bg-white p-12">
                        <header className="text-center mb-12">
                            <h1 className="text-2xl font-bold uppercase">Liga Deportiva Barrial "La Luz"</h1>
                            <p className="text-sm">Fundado el 15 de Mayo de 1993</p>
                            <p className="text-sm">Acuerdo Ministerial Nro. 00157</p>
                            <h2 className="text-xl font-bold mt-8 uppercase">{documentTitle}</h2>
                        </header>

                        <section className="mb-8">
                             <p className="text-right mb-8">
                                Quito, {format(new Date(), "d 'de' LLLL 'de' yyyy", { locale: es })}
                            </p>
                            <p className="mb-4">Señor Presidente de la Liga Deportiva Barrial "La Luz"</p>
                            <p className="mb-8">Presente.-</p>
                            <p className="leading-relaxed">
                                De mi consideración:
                            </p>
                             <p className="mt-4 leading-relaxed indent-8">
                                Yo, {selectedTeam?.president?.name || '[Nombre del Presidente]'}, en calidad de Presidente del club {selectedTeam?.name || '[Nombre del Club]'}, solicito a usted muy comedidamente se digne aceptar la {requestType === 'qualification' ? 'calificación' : 'recalificación'} del siguiente deportista para que participe en el presente campeonato.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h3 className="font-bold text-center mb-4 uppercase">Datos del Jugador</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border p-4 rounded">
                                {requestType === 'requalification' && (
                                    <>
                                        <div><strong>JUGADOR QUE SALE:</strong></div>
                                        <div>{playerOut?.name || '[Nombre del Jugador Saliente]'}</div>
                                    </>
                                )}
                                <div><strong>JUGADOR QUE INGRESA:</strong></div>
                                <div>{playerIn.name}</div>
                                <div><strong>NOMBRES COMPLETOS:</strong></div>
                                <div>{playerIn.name}</div>
                                <div><strong>NÚMERO DE CÉDULA:</strong></div>
                                <div>{playerIn.idNumber}</div>
                                <div><strong>FECHA DE NACIMIENTO:</strong></div>
                                <div>{playerIn.birthDate ? format(new Date(playerIn.birthDate), 'dd/MM/yyyy') : ''}</div>
                            </div>
                        </section>

                        <footer className="pt-24">
                            <div className="grid grid-cols-2 gap-16 text-center">
                                <div>
                                    <div className="border-t border-gray-400 pt-2">
                                        <p>{selectedTeam?.president?.name || '[Nombre Presidente]'}</p>
                                        <p className="text-sm">Presidente del Club</p>
                                    </div>
                                </div>
                                <div>
                                     <div className="border-t border-gray-400 pt-2">
                                        <p>{playerIn.name}</p>
                                        <p className="text-sm">Jugador</p>
                                    </div>
                                </div>
                            </div>
                             <div className="mt-24 text-center">
                                <div className="border-t border-gray-400 pt-2 inline-block">
                                    <p>Recibido por:</p>
                                    <p className="text-sm">(Sello y Firma de la Liga)</p>
                                </div>
                            </div>
                        </footer>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 print:hidden">
                        <Button variant="outline" onClick={() => setDocumentReady(false)}>
                            <ArrowLeft className="mr-2" /> Volver al formulario
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer className="mr-2" /> Imprimir Documento
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="text-center">
                 <h2 className="text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
                       Gestión de Solicitudes
                    </span>
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                    Genera documentos de calificación y recalificación de jugadores para tu equipo.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                <div className="lg:col-span-3">
                    <RequestHistory />
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nueva Solicitud</CardTitle>
                            <CardDescription>Sigue los pasos para generar un nuevo documento.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Paso 1: Tipo de Solicitud</h3>
                                    <Button onClick={() => { setRequestType('qualification'); handleProceed(); }} className="w-full justify-start" variant="outline">
                                        <UserPlus className="mr-2" /> Calificación de nuevo jugador
                                    </Button>
                                    <Button onClick={() => { setRequestType('requalification'); handleProceed(); }} className="w-full justify-start" variant="outline">
                                        <UserX className="mr-2" /> Recalificación (cambio de jugador)
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Paso 2: Completa los Datos</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="team">Equipo</Label>
                                            <Select onValueChange={handleTeamChange}>
                                                <SelectTrigger id="team">
                                                    <SelectValue placeholder="Selecciona un equipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allTeams.map(team => (
                                                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {requestType === 'requalification' && (
                                            <div>
                                                <Label htmlFor="player-out">Jugador que sale</Label>
                                                <Select onValueChange={(playerId) => setPlayerOut(teamPlayers.find(p => p.id === playerId) || null)} disabled={!selectedTeam}>
                                                    <SelectTrigger id="player-out">
                                                        <SelectValue placeholder="Selecciona un jugador a reemplazar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {teamPlayers.map(player => (
                                                            <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <div className="border p-4 rounded-md space-y-4">
                                            <h4 className="font-semibold text-md">Datos del Jugador Entrante</h4>
                                            <div>
                                                <Label htmlFor="player-in-name">Nombres y Apellidos Completos</Label>
                                                <Input id="player-in-name" value={playerIn.name} onChange={(e) => setPlayerIn(p => ({ ...p, name: e.target.value }))} />
                                            </div>
                                            <div>
                                                <Label htmlFor="player-in-id">N° de Cédula</Label>
                                                <Input id="player-in-id" value={playerIn.idNumber} onChange={(e) => setPlayerIn(p => ({ ...p, idNumber: e.target.value }))} />
                                            </div>
                                            <div>
                                                <Label htmlFor="player-in-birthdate">Fecha de Nacimiento</Label>
                                                <Input id="player-in-birthdate" type="date" value={playerIn.birthDate} onChange={(e) => setPlayerIn(p => ({ ...p, birthDate: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}><ArrowLeft className="mr-2" /> Volver</Button>}
                            {step === 2 && <Button onClick={handleGenerateDocument}><FileText className="mr-2" /> Generar Documento</Button>}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
