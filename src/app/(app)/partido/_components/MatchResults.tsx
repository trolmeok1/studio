

'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Match, Category } from '@/lib/mock-data';
import { getMatches } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MatchCard } from './MatchCard';

export function MatchResults() {
    const [isClient, setIsClient] = useState(false);
    const [allMatches, setAllMatches] = useState<Match[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

    useEffect(() => {
        setIsClient(true);
        getMatches().then(setAllMatches);
    }, []);

    const groupedPastMatches = useMemo(() => {
        if (!isClient) return {};

        const pastMatches = allMatches
            .filter(m => m.status === 'finished')
            .filter(m => selectedCategory === 'all' || m.category === selectedCategory)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return pastMatches.reduce((acc, match) => {
            const date = new Date(match.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(match);
            return acc;
        }, {} as Record<string, Match[]>);

    }, [isClient, selectedCategory, allMatches]);

    if (!isClient) {
        return null;
    }

    return (
        <>
            <div className="flex justify-end">
                <div className="w-full max-w-xs">
                     <Select onValueChange={(value) => setSelectedCategory(value as Category | 'all')} defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por categoría..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las Categorías</SelectItem>
                            <SelectItem value="Máxima">Máxima</SelectItem>
                            <SelectItem value="Primera">Primera</SelectItem>
                            <SelectItem value="Segunda">Segunda</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             {Object.keys(groupedPastMatches).length > 0 ? Object.entries(groupedPastMatches).map(([date, matchesOnDate]) => (
                <div key={date}>
                    <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {matchesOnDate.map(match => <MatchCard key={match.id} match={match} />)}
                    </div>
                </div>
            )) : (
                 <p className="text-muted-foreground text-center py-8">No se han registrado resultados para la categoría seleccionada.</p>
            )}
        </>
    );
}
