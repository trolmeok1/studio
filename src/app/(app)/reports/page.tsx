
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, ShieldAlert, DollarSign, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const ReportCard = ({ icon: Icon, title, description, children }: { icon: React.ElementType, title: string, description: string, children?: React.ReactNode }) => (
    <Card>
        <CardHeader>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {children}
            <Button className="w-full mt-4">
                <Download className="mr-2" />
                Generar Reporte
            </Button>
        </CardContent>
    </Card>
);


export default function ReportsPage() {

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">
                    Módulo de Reportes
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <ReportCard
                    icon={BarChart2}
                    title="Tabla de Posiciones Oficial"
                    description="Genere un documento PDF con la tabla de posiciones actual de una categoría, listo para imprimir o compartir."
                >
                     <div className="space-y-2">
                        <Label htmlFor="category-standings">Seleccionar Categoría</Label>
                        <Select>
                            <SelectTrigger id="category-standings">
                                <SelectValue placeholder="Elige una categoría..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Máxima">Máxima</SelectItem>
                                <SelectItem value="Primera">Primera</SelectItem>
                                <SelectItem value="Segunda">Segunda</SelectItem>
                                <SelectItem value="Copa">Copa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </ReportCard>

                <ReportCard
                    icon={Calendar}
                    title="Programación Semanal"
                    description="Cree un reporte con todos los partidos de la próxima jornada, incluyendo horarios, canchas y árbitros."
                >
                     <div className="space-y-2">
                        <Label htmlFor="week-schedule">Seleccionar Jornada</Label>
                        <Select>
                            <SelectTrigger id="week-schedule">
                                <SelectValue placeholder="Elige una jornada..." />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 22 }, (_, i) => (
                                     <SelectItem key={i + 1} value={`jornada-${i + 1}`}>Jornada {i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </ReportCard>

                <ReportCard
                    icon={ShieldAlert}
                    title="Reporte de Sanciones"
                    description="Liste todos los jugadores actualmente sancionados, el motivo de la sanción y los partidos de suspensión."
                >
                    <p className="text-sm text-muted-foreground">Este reporte incluirá a todos los jugadores con sanciones activas en todas las categorías.</p>
                </ReportCard>

                <ReportCard
                    icon={DollarSign}
                    title="Reporte Financiero Detallado"
                    description="Genere un estado de cuenta completo con ingresos por vocalías, pagos pendientes y multas aplicadas."
                >
                     <div className="space-y-2">
                        <Label htmlFor="finance-period">Seleccionar Periodo</Label>
                        <Select>
                            <SelectTrigger id="finance-period">
                                <SelectValue placeholder="Elige un periodo..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Semanal</SelectItem>
                                <SelectItem value="monthly">Mensual</SelectItem>
                                <SelectItem value="full">Todo el campeonato</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </ReportCard>
            </div>
        </div>
    );
}
