'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPlayers, getTeams, type Player, type Team, type Category } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function PlayersPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [selectedTeam, setSelectedTeam] = useState('all');

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [playersData, teamsData] = await Promise.all([getPlayers(), getTeams()]);
            setPlayers(playersData);
            setTeams(teamsData);
            setLoading(false);
        }
        loadData();
    }, []);
    
    const categories = useMemo(() => ['all', ...Array.from(new Set(teams.map(t => t.category)))], [teams]);
    
    const teamsInCategory = useMemo(() => {
        if (selectedCategory === 'all') return teams;
        return teams.filter(t => t.category === selectedCategory);
    }, [teams, selectedCategory]);

    const filteredPlayers = useMemo(() => {
        return players.filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  player.idNumber.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || player.category === selectedCategory;
            const matchesTeam = selectedTeam === 'all' || player.teamId === selectedTeam;
            return matchesSearch && matchesCategory && matchesTeam;
        });
    }, [players, searchTerm, selectedCategory, selectedTeam]);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Jugadores</h2>
                    <p className="text-muted-foreground">
                        Busca y gestiona la información de todos los jugadores de la liga.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Jugadores</CardTitle>
                    <CardDescription>
                         Total de {filteredPlayers.length} jugadores encontrados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="relative flex-1 md:grow-0 w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por nombre o cédula..."
                                className="w-full rounded-lg bg-background pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v as Category | 'all'); setSelectedTeam('all'); }}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat === 'all' ? 'Todas las Categorías' : cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={selectedTeam} onValueChange={setSelectedTeam} disabled={selectedCategory === 'all'}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Equipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los Equipos</SelectItem>
                                    {teamsInCategory.map(team => <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Jugador</TableHead>
                                <TableHead>Cédula</TableHead>
                                <TableHead>Equipo</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Posición</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 10}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}><div className="h-8 bg-muted rounded animate-pulse"></div></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredPlayers.length > 0 ? (
                                filteredPlayers.map(player => (
                                    <TableRow key={player.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={player.photoUrl} alt={player.name} data-ai-hint="player photo"/>
                                                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{player.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{player.idNumber}</TableCell>
                                        <TableCell>{player.team}</TableCell>
                                        <TableCell>{player.category}</TableCell>
                                        <TableCell>{player.position}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/players/${player.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Ver Perfil
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No se encontraron jugadores con los filtros seleccionados.
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
