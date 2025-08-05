'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTeamsByCategory, standings as mockStandings, type Category, type Standing } from '@/lib/mock-data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Goal, User, Home, Calendar as CalendarIcon, Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MatchResults } from './_components/MatchResults';

const LeagueView = ({ category, group }: { category: Category; group?: 'A' | 'B' }) => {
    const standings = mockStandings.filter(s => {
        const team = getTeamsByCategory(category, group).find(t => t.id === s.teamId);
        return !!team;
    })
    .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - a.goalsAgainst;
        return gdB - gdA;
    })
    .map((s, index) => ({ ...s, rank: index + 1 }));

    const getRowClass = (rank: number) => {
        if (rank <= 3) return 'bg-red-500/10';
        return '';
    };

    const getPositionClass = (rank: number) => {
        if (rank <= 3) return 'bg-red-500 text-white';
        return 'bg-muted/50';
    }

    return (
        <Card className="bg-gray-900/70 backdrop-blur-sm border-white/10" style={{ backgroundImage: `url('/field-bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <CardHeader className="text-center">
                <Image src="https://placehold.co/100x100.png" alt="Logo Liga" width={60} height={60} className="mx-auto" data-ai-hint="league logo" />
                <CardTitle className="text-white text-2xl font-bold tracking-widest uppercase">Tabla de Posiciones</CardTitle>
                <div className="bg-white/90 text-gray-800 font-bold py-1 px-4 rounded-md w-fit mx-auto">
                    {category} {group ? `- Grupo ${group}` : ''}
                </div>
            </CardHeader>
            <CardContent>
                <Table className="text-white">
                    <TableHeader>
                        <TableRow className="border-white/20 hover:bg-transparent">
                            <TableHead className="w-[50px] text-center text-muted-foreground">POS</TableHead>
                            <TableHead className="text-muted-foreground">EQUIPO</TableHead>
                            <TableHead className="text-center text-muted-foreground">PTS</TableHead>
                            <TableHead className="text-center text-muted-foreground">PJ</TableHead>
                            <TableHead className="text-center text-muted-foreground">G</TableHead>
                            <TableHead className="text-center text-muted-foreground">E</TableHead>
                            <TableHead className="text-center text-muted-foreground">P</TableHead>
                            <TableHead className="text-center text-muted-foreground">GF</TableHead>
                            <TableHead className="text-center text-muted-foreground">GC</TableHead>
                            <TableHead className="text-center text-muted-foreground">DG</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {standings.map((s) => (
                            <TableRow key={s.teamId} className={cn("border-white/10", getRowClass(s.rank))}>
                                <TableCell className="p-0 w-[50px]">
                                    <div className={cn("h-full w-full flex items-center justify-center font-bold", getPositionClass(s.rank))}>
                                        {s.rank}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/teams/${s.teamId}`} className="flex items-center gap-3 hover:text-primary">
                                        <Image
                                            src={getTeamsByCategory(category, group).find(t => t.id === s.teamId)?.logoUrl || ''}
                                            alt={s.teamName}
                                            width={24}
                                            height={24}
                                            className="rounded-full bg-white/20 p-0.5"
                                            data-ai-hint="team logo"
                                        />
                                        <span className="font-medium">{s.teamName}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-center font-bold text-lg">{s.points}</TableCell>
                                <TableCell className="text-center">{s.played}</TableCell>
                                <TableCell className="text-center">{s.wins}</TableCell>
                                <TableCell className="text-center">{s.draws}</TableCell>
                                <TableCell className="text-center">{s.losses}</TableCell>
                                <TableCell className="text-center">{s.goalsFor}</TableCell>
                                <TableCell className="text-center">{s.goalsAgainst}</TableCell>
                                <TableCell className="text-center">{s.goalsFor - s.goalsAgainst}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};


export default function PartidoPage() {
    
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                Resultados y Posiciones
              </span>
            </h2>
        </div>
        <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="results">Resultados</TabsTrigger>
                <TabsTrigger value="maxima">Posiciones: Máxima</TabsTrigger>
                <TabsTrigger value="primera">Posiciones: Primera</TabsTrigger>
                <TabsTrigger value="segunda">Posiciones: Segunda</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="space-y-6 mt-6">
                 <MatchResults />
            </TabsContent>
             <TabsContent value="maxima" className="mt-4">
                <LeagueView category="Máxima" />
            </TabsContent>
            <TabsContent value="primera" className="mt-4">
                <LeagueView category="Primera" />
            </TabsContent>
            <TabsContent value="segunda" className="mt-4 space-y-6">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <LeagueView category="Segunda" group="A" />
                    <LeagueView category="Segunda" group="B" />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
