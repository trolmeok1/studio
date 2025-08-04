

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { upcomingMatches as allMatches, type Match, getTeamsByCategory, standings as mockStandings, type Category } from '@/lib/mock-data';
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
        const gdB = b.goalsFor - b.goalsAgainst;
        return gdB - gdA;
    })
    .map((s, index) => ({ ...s, rank: index + 1 }));

    const getRowClass = (rank: number) => {
        switch(rank) {
            case 1: return 'bg-amber-400/20 hover:bg-amber-400/30';
            case 2: return 'bg-slate-400/20 hover:bg-slate-400/30';
            case 3: return 'bg-orange-600/20 hover:bg-orange-600/30';
            default: return '';
        }
    }

    return (
        <Card neon="blue">
            <CardHeader>
                <CardTitle>
                    Tabla de Posiciones - {category} {group ? `- Grupo ${group}` : ''}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead className="text-center">PJ</TableHead>
                            <TableHead className="text-center">G</TableHead>
                            <TableHead className="text-center">E</TableHead>
                            <TableHead className="text-center">P</TableHead>
                            <TableHead className="text-center">GF</TableHead>
                            <TableHead className="text-center">GC</TableHead>
                            <TableHead className="text-center">GD</TableHead>
                            <TableHead className="text-center font-bold">PTS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {standings.map((s) => (
                            <TableRow key={s.teamId} className={cn(getRowClass(s.rank))}>
                                <TableCell className="font-bold">{s.rank}</TableCell>
                                <TableCell>
                                    <Link href={`/teams/${s.teamId}`} className="flex items-center gap-3 hover:text-primary">
                                        <Image
                                            src={getTeamsByCategory(category, group).find(t => t.id === s.teamId)?.logoUrl || ''}
                                            alt={s.teamName}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                            data-ai-hint="team logo"
                                        />
                                        <span className="font-medium">{s.teamName}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-center">{s.played}</TableCell>
                                <TableCell className="text-center">{s.wins}</TableCell>
                                <TableCell className="text-center">{s.draws}</TableCell>
                                <TableCell className="text-center">{s.losses}</TableCell>
                                <TableCell className="text-center">{s.goalsFor}</TableCell>
                                <TableCell className="text-center">{s.goalsAgainst}</TableCell>
                                <TableCell className="text-center">{s.goalsFor - s.goalsAgainst}</TableCell>
                                <TableCell className="text-center font-bold">{s.points}</TableCell>
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
             <TabsContent value="maxima">
                <LeagueView category="Máxima" />
            </TabsContent>
            <TabsContent value="primera">
                <LeagueView category="Primera" />
            </TabsContent>
            <TabsContent value="segunda" className="space-y-6">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <LeagueView category="Segunda" group="A" />
                    <LeagueView category="Segunda" group="B" />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
