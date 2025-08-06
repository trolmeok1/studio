
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSanctionSettings, saveSanctionSettings, type SanctionSettings } from '@/lib/mock-data';

export default function SanctionsSettingsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<SanctionSettings>({
        yellowCardFine: 0,
        redCardFine: 0,
        absenceFine: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const savedSettings = await getSanctionSettings();
            setSettings(savedSettings);
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveSanctionSettings(settings);
            toast({
                title: "Configuración Guardada",
                description: "Las multas por sanciones han sido actualizadas.",
            });
        } catch (error) {
            console.error("Failed to save sanction settings:", error);
            toast({
                title: "Error al Guardar",
                description: "No se pudo guardar la configuración. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSettings(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    };

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                <Card>
                    <CardHeader>
                        <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-10 w-full bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Configuración de Sanciones</h2>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Tarifas de Sanciones Monetarias</CardTitle>
                    <CardDescription>
                        Establece los valores para las multas que se aplicarán automáticamente en las vocalías.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="yellowCardFine" className="text-base">Multa por Tarjeta Amarilla</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                                id="yellowCardFine"
                                type="number"
                                value={settings.yellowCardFine}
                                onChange={handleInputChange}
                                className="max-w-xs"
                                placeholder="1.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="redCardFine" className="text-base">Multa por Tarjeta Roja</Label>
                        <div className="flex items-center gap-2">
                             <span className="text-muted-foreground">$</span>
                            <Input
                                id="redCardFine"
                                type="number"
                                value={settings.redCardFine}
                                onChange={handleInputChange}
                                className="max-w-xs"
                                placeholder="5.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="absenceFine" className="text-base">Multa por Ausencia (W.O.)</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                                id="absenceFine"
                                type="number"
                                value={settings.absenceFine}
                                onChange={handleInputChange}
                                className="max-w-xs"
                                placeholder="20.00"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

