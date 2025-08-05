'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTeams, type Team, type Category } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Search, Shield, Users } from 'lucide-react';
import Link from 'next/link';

const TeamCard = ({ team }: { team: Team }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={team.logoUrl} alt={`${team.name} logo`} data-ai-hint="team logo"/>
                <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <CardDescription>{team.president?.name || 'Presidente no asignado'}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex justify-end">
                <Link href={`/teams/${team.id}`}>
                    <Button variant="outline" size="sm">
                        Ver Equipo
                    </Button>
                </Link>
            </div>
        </CardContent>
    </Card>
);

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<Category>('Máxima');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTeams() {
            setLoading(true);
            const allTeams = await getTeams();
            setTeams(allTeams);
            setLoading(false);
        }
        loadTeams();
    }, []);

    const filteredTeams = useMemo(() => {
        return teams
            .filter(team => team.category === activeTab)
            .filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [teams, activeTab, searchTerm]);
    
    const categories: Category[] = useMemo(() => {
       const uniqueCategories = [...new Set(teams.map(t => t.category))];
       // Custom sort order
       const order: Category[] = ['Máxima', 'Primera', 'Segunda', 'Copa'];
       return uniqueCategories.sort((a,b) => order.indexOf(a) - order.indexOf(b));
    }, [teams]);


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Equipos</h2>
                    <p className="text-muted-foreground">
                        Gestiona los equipos de la liga, su información y sus jugadores.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Registrar Nuevo Equipo
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <CardTitle>Listado de Equipos</CardTitle>
                         <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar equipo..."
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Category)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                             {categories.map(cat => (
                                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                             ))}
                        </TabsList>

                        {categories.map(cat => (
                             <TabsContent key={cat} value={cat}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                                    {loading ? (
                                        Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-40 bg-muted rounded-lg animate-pulse"></div>)
                                    ) : filteredTeams.length > 0 ? (
                                        filteredTeams.map(team => <TeamCard key={team.id} team={team} />)
                                    ) : (
                                        <div className="col-span-full text-center py-10">
                                            <p>No se encontraron equipos para "{cat}" {searchTerm && `con el nombre "${searchTerm}"`}.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
