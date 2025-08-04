
'use client';

import type { Match } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface MatchCardProps {
    match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
    const { teams, score } = match;
    const homeTeam = teams.home;
    const awayTeam = teams.away;

    const homeScore = score?.home ?? 0;
    const awayScore = score?.away ?? 0;

    const isHomeWinner = homeScore > awayScore;
    const isAwayWinner = awayScore > homeScore;
    const isDraw = homeScore === awayScore;

    const TeamDisplay = ({ team, score, isWinner }: { team: typeof homeTeam, score: number, isWinner: boolean }) => (
        <div className="flex flex-col items-center gap-2 text-center w-28">
            <Link href={`/teams/${team.id}`} className="hover:opacity-80 transition-opacity">
                <Image
                    src={team.logoUrl}
                    alt={team.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                    data-ai-hint="team logo"
                />
            </Link>
            <p className={cn("font-semibold leading-tight", isWinner && "text-primary")}>{team.name}</p>
        </div>
    );


    return (
        <Card className="p-4">
            <CardContent className="p-0 flex items-center justify-around">
                <TeamDisplay team={homeTeam} score={homeScore} isWinner={isHomeWinner} />

                <div className="text-center">
                    <div className="flex items-center gap-3">
                        <span className={cn("text-3xl font-bold", isHomeWinner && "text-primary")}>
                            {homeScore}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className={cn("text-3xl font-bold", isAwayWinner && "text-primary")}>
                            {awayScore}
                        </span>
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">Finalizado</p>
                </div>

                <TeamDisplay team={awayTeam} score={awayScore} isWinner={isAwayWinner} />
            </CardContent>
        </Card>
    );
}
