
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, UserCheck, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getReferees, addReferee, updateReferee, type Referee } from '@/lib/mock-data';

const initialRefereeState: Omit<Referee, 'id'> = {
    name: '',
    phone: '',
    category: 'C',
};

const RefereeDialog = ({ referee, onSave }: { referee?: Referee, onSave: (referee: Referee) => void }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [refereeData, setRefereeData] = useState(referee || initialRefereeState);

    useEffect(() => {
        setRefereeData(referee || initialRefereeState);
    }, [referee]);

    const handleSave = () => {
        if (!refereeData.name || !refereeData.category) {
            alert("El nombre y la categoría son obligatorios.");
            return;
        }
        
        if ('id' in refereeData) {
            // It's an existing referee
            onSave(updateReferee(refereeData as Referee));
        } else {
             // It's a new referee
            onSave(addReferee(refereeData));
        }
        
        setIsDialogOpen(false);
        setRefereeData(initialRefereeState);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {referee ? (
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                ) : (
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Árbitro
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{referee ? 'Editar Árbitro' : 'Agregar Nuevo Árbitro'}</DialogTitle>
                    <DialogDescription>
                        Complete la información del árbitro.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" value={refereeData.name} onChange={(e) => setRefereeData({ ...refereeData, name: e.target.value })} placeholder="Ej: Néstor Pitana" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono (Opcional)</Label>
                        <Input id="phone" value={refereeData.phone} onChange={(e) => setRefereeData({ ...refereeData, phone: e.target.value })} placeholder="099..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select onValueChange={(value) => setRefereeData({ ...refereeData, category: value as 'A' | 'B' | 'C' })} value={refereeData.category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">Categoría A (Profesional)</SelectItem>
                                <SelectItem value="B">Categoría B (Amateur)</SelectItem>
                                <SelectItem value="C">Categoría C (Aspirante)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button onClick={handleSave} className="w-full mt-4">{referee ? 'Guardar Cambios' : 'Guardar Árbitro'}</Button>
            </DialogContent>
        </Dialog>
    );
};

export default function RefereesPage() {
    const { user } = useAuth();
    const canEdit = user.role === 'admin';
    const [referees, setReferees] = useState<Referee[]>([]);

    useEffect(() => {
        setReferees(getReferees());
    }, []);

    const handleSaveReferee = (savedReferee: Referee) => {
        if (referees.some(r => r.id === savedReferee.id)) {
            setReferees(referees.map(r => r.id === savedReferee.id ? savedReferee : r));
        } else {
            setReferees([...referees, savedReferee]);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">
                    Gestión de Árbitros
                </h2>
                {canEdit && <RefereeDialog onSave={handleSaveReferee} />}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Árbitros</CardTitle>
                    <CardDescription>
                        Directorio de todos los árbitros registrados en la liga.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Categoría</TableHead>
                                {canEdit && <TableHead className="text-right">Acciones</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {referees.map((referee) => (
                                <TableRow key={referee.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <UserCheck className="h-5 w-5 text-primary" />
                                        {referee.name}
                                    </TableCell>
                                    <TableCell>{referee.phone || 'N/A'}</TableCell>
                                    <TableCell>{referee.category}</TableCell>
                                    {canEdit && (
                                        <TableCell className="text-right">
                                            <RefereeDialog referee={referee} onSave={handleSaveReferee} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                             {referees.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={canEdit ? 4 : 3} className="text-center h-24">
                                        No hay árbitros registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
