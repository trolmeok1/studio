

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getTeams, type Team, type Category } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { AddTeam } from './_components/AddTeam';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/teams/${team.id}`}>
                        Ver Equipo
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
);

export default function TeamsPage() {
    const { user } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const loadTeams = useCallback(async () => {
        setLoading(true);
        const allTeams = await getTeams();
        setTeams(allTeams);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadTeams();
    }, [loadTeams]);

    const handleTeamAdded = useCallback((newTeam: Team) => {
        setTeams(prevTeams => [...prevTeams, newTeam]);
    }, []);

    const categories: Category[] = useMemo(() => {
       const uniqueCategories = [...new Set(teams.map(t => t.category))].filter(c => c !== 'Copa') as Category[];
       const order: Category[] = ['Máxima', 'Primera', 'Segunda'];
       return uniqueCategories.sort((a,b) => order.indexOf(a) - order.indexOf(b));
    }, [teams]);

    const filteredTeamsByCategory = (category: Category) => {
        return teams
            .filter(team => team.category === category)
            .filter(team => team.name && team.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const TeamList = ({ teamsToShow }: { teamsToShow: Team[] }) => {
         if (loading) {
            return (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 bg-muted rounded-lg animate-pulse"></div>)}
                </div>
            )
        }
        if (teamsToShow.length === 0) {
            return (
                 <div className="col-span-full text-center py-10">
                    <p>No se encontraron equipos {searchTerm && `con el nombre "${searchTerm}"`}.</p>
                </div>
            )
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
               {teamsToShow.map(team => <TeamCard key={team.id} team={team} />)}
            </div>
        )
    };
    
    const activeCategories = useMemo(() => {
        return categories.filter(cat => filteredTeamsByCategory(cat).length > 0 || !searchTerm);
    }, [categories, teams, searchTerm]);


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Equipos</h2>
                    <p className="text-muted-foreground">
                        Gestiona los equipos de la liga, su información y sus jugadores.
                    </p>
                </div>
                {user.permissions.teams.edit && <AddTeam onTeamAdded={handleTeamAdded} />}
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
                     <Accordion type="multiple" defaultValue={categories} className="w-full">
                       {categories.map((cat, index) => {
                            const teamsForCategory = filteredTeamsByCategory(cat);
                            if (teamsForCategory.length === 0 && searchTerm) {
                                return null;
                            }
                           return (
                               <AccordionItem value={cat} key={`${cat}-${index}`}>
                                   <AccordionTrigger className="text-lg font-semibold">{cat}</AccordionTrigger>
                                   <AccordionContent>
                                       <TeamList teamsToShow={teamsForCategory} />
                                   </AccordionContent>
                               </AccordionItem>
                           )
                       })}
                    </Accordion>
                     {loading && (
                        <div className="space-y-4">
                            <div className="h-12 bg-muted rounded-lg animate-pulse w-full"></div>
                            <div className="h-12 bg-muted rounded-lg animate-pulse w-full"></div>
                            <div className="h-12 bg-muted rounded-lg animate-pulse w-full"></div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
