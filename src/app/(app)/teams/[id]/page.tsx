
import { getTeamById, getPlayersByTeamId, getMatchesByTeamId, sanctions, type Player, type Team, type Person, type Match, updatePlayerStatus } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Calendar, BarChart2, ShieldAlert, BadgeInfo, Printer, Pencil, List, LayoutGrid, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamDetailsClient } from './_components/TeamDetailsClient';

const InfoRow = ({ icon: Icon, label, person, showContact }: { icon: React.ElementType, label: string, person?: Person, showContact: boolean }) => (
    <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
        <Icon className="w-5 h-5 text-primary mt-1" />
        <div className="flex-grow">
            <p className="font-semibold">{label}</p>
            <p className="text-muted-foreground">{person?.name || 'No asignado'}</p>
        </div>
        {showContact && person?.phone && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Phone className="w-4 h-4"/>
                <span>{person.phone}</span>
            </div>
        )}
    </div>
  );

export default async function TeamDetailsPage({ params }: { params: { id: string }}) {
  const teamId = params.id;
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }

  const players = getPlayersByTeamId(teamId);
  const matches = getMatchesByTeamId(teamId);
  const teamSanctions = sanctions.filter(s => s.teamId === teamId);

  const futureMatches = matches.filter(m => m.status === 'future' || m.status === 'in-progress');
  const finishedMatches = matches.filter(m => m.status === 'finished');
  
  const vocalPayments = matches
    .filter(m => m.status === 'finished')
    .map(match => {
        const isHome = match.teams.home.id === teamId;
        const details = isHome ? match.teams.home.vocalPaymentDetails : match.teams.away.vocalPaymentDetails;
        return {
            date: match.date,
            opponent: isHome ? match.teams.away.name : match.teams.home.name,
            amount: details?.total || 0,
            status: details?.paymentStatus || 'pending'
        };
  });

  return (
    <TeamDetailsClient
        team={team}
        players={players}
        matches={matches}
        teamSanctions={teamSanctions}
        futureMatches={futureMatches}
        finishedMatches={finishedMatches}
        vocalPayments={vocalPayments}
    />
  );
}
