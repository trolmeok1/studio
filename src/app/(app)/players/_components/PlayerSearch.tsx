
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Player, Team, Category } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const orderedCategories: Category[] = ['Máxima', 'Primera', 'Segunda'];

export function PlayerSearch({ allPlayers, allTeams }: { allPlayers: Player[], allTeams: Team[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(allTeams.map(t => t.category))].filter(c => c !== 'Copa') as Category[];
        return uniqueCategories.sort((a,b) => orderedCategories.indexOf(a) - orderedCategories.indexOf(b));
    }, [allTeams]);

    const [activeTab, setActiveTab] = useState<Category>(categories.length > 0 ? categories[0] : 'Máxima');

    const filteredTeams = useMemo(() => {
        if (!allTeams || allTeams.length === 0) {
            return [];
        }
        const lowercasedFilter = searchTerm.toLowerCase();

        let teamsInCategory = allTeams.filter(team => team.category === activeTab);

        if (!searchTerm) {
            return teamsInCategory;
        }

        const filteredPlayers = allPlayers.filter(player =>
            player.name.toLowerCase().includes(lowercasedFilter) &&
            player.category === activeTab
        );

        const teamIdsWithFilteredPlayers = new Set(filteredPlayers.map(p => p.teamId));

        return teamsInCategory.filter(team => teamIdsWithFilteredPlayers.has(team.id));

    }, [searchTerm, activeTab, allPlayers, allTeams]);


    const getPlayersByTeam = (teamId: string) => {
        const lowercasedFilter = searchTerm.toLowerCase();
        return allPlayers.filter(p =>
            p.teamId === teamId &&
            (p.name.toLowerCase().includes(lowercasedFilter) || !searchTerm)
        );
    }

    return (
        <Card>
            <div className="p-4">
                <Input
                    placeholder="Buscar jugador por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>
             <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Category)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    {orderedCategories.map(category => (
                        <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                    ))}
                </TabsList>

                {orderedCategories.map(category => (
                    <TabsContent key={category} value={category}>
                        <Accordion type="single" collapsible className="w-full">
                            {filteredTeams.map(team => (
                                <AccordionItem value={team.id} key={team.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-3">
                                            <Image src={team.logoUrl} alt={team.name} width={40} height={40} className="rounded-full" data-ai-hint="team logo" />
                                            <span>{team.name}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                                            {getPlayersByTeam(team.id).map(player => (
                                                <Link key={player.id} href={`/players/${player.id}`}>
                                                    <Card className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                                                        <Image src={player.photoUrl} alt={player.name} width={48} height={48} className="rounded-full" data-ai-hint="player portrait" />
                                                        <div>
                                                            <p className="font-semibold">{player.name}</p>
                                                            <Badge variant="outline" className={cn(player.status === 'activo' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500')}>
                                                                {player.status === 'activo' ? 'Activo' : 'Inactivo'}
                                                            </Badge>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                         {filteredTeams.length === 0 && (
                            <div className="text-center p-8 text-muted-foreground">
                                No se encontraron jugadores o equipos que coincidan con la búsqueda en esta categoría.
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>

        </Card>
    );
}
