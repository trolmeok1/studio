
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { teams as allTeams, getPlayersByTeamId, type Player, type Team } from '@/lib/mock-data';
import { ArrowLeft, Printer, UserPlus, UserX } from 'lucide-react';
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

export default function RequalificationPage() {
    const [step, setStep] = useState(1);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [reason, setReason] = useState('');
    const [playerOutId, setPlayerOutId] = useState('');
    const [playerIn, setPlayerIn] = useState<NewPlayer>(initialNewPlayerState);
    const [presidentId, setPresidentId] = useState('');

    const selectedTeam = useMemo(() => allTeams.find(t => t.id === selectedTeamId), [selectedTeamId]);
    const teamPlayers = useMemo(() => selectedTeamId ? getPlayersByTeamId(selectedTeamId) : [], [selectedTeamId]);
    const playerOut = useMemo(() => teamPlayers.find(p => p.id === playerOutId), [playerOutId]);

    const handleNextStep = () => {
        if (selectedTeam && playerOut && playerIn.firstName && playerIn.idNumber) {
            setStep(2);
        } else {
            alert('Por favor, completa todos los campos requeridos.');
        }
    };
    
    const handlePrint = () => {
        window.print();
    }

    if (step === 2 && selectedTeam && playerOut) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Card className="print:shadow-none print:border-none">
                    <CardHeader className="print:hidden">
                        <CardTitle>Documento de Recalificación Generado</CardTitle>
                        <CardDescription>Los datos han sido guardados. Revisa el documento y procede a imprimir.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 print:hidden mb-6">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                <ArrowLeft className="mr-2" />
                                Volver a Editar
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
                                <p>
                                    Por medio de la Presente queremos solicitarles de la manera más atenta y comedida la recalificación para la segunda vuelta del campeonato de la categoría {selectedTeam.category.toUpperCase()}.
                                </p>
                                <p>
                                    Solicito el cambio del Señor {playerOut.name.toUpperCase()} con C.I. {playerOut.idNumber} calificado con el Número {playerOut.jerseyNumber} puesto que <span className="font-semibold underline">{reason || 'el motivo especificado'}</span>.
                                </p>
                                <p>Por este motivo solicitamos la recalificación del siguiente jugador:</p>
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
                                        <td className="border border-black p-1 text-center">{playerOut.jerseyNumber}</td>
                                        <td className="border border-black p-1">{playerIn.firstName.toUpperCase()}</td>
                                        <td className="border border-black p-1">{playerIn.lastName.toUpperCase()}</td>
                                        <td className="border border-black p-1 text-center">{playerIn.idNumber}</td>
                                    </tr>
                                </tbody>
                            </table>

                             <p className="mb-20">
                                En espera de que la petición sea favorablemente acogida por ustedes nos despedimos.
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

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Solicitud de Recalificación de Jugador</CardTitle>
                    <CardDescription>Paso 1 de 2: Completa la información para el cambio de jugador.</CardDescription>
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
                            <Label htmlFor="reason">Razón de la Recalificación (Puesto que...)</Label>
                            <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Ej: ...hasta el momento no ha pisado cancha." />
                        </div>
                    </div>

                    {/* Players Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Player Out */}
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

                        {/* Player In */}
                        <div className="space-y-4 p-4 border rounded-lg border-primary">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><UserPlus className="text-primary"/> 3. Jugador Entrante</h3>
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
                            <div>
                                <Label htmlFor="playerInId">Número de Cédula</Label>
                                <Input id="playerInId" value={playerIn.idNumber} onChange={e => setPlayerIn({...playerIn, idNumber: e.target.value})} placeholder="C.I. del nuevo jugador" />
                            </div>
                        </div>
                    </div>
                    
                    <Button onClick={handleNextStep} className="w-full" size="lg">
                        Generar Documento de Recalificación
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

