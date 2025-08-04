

import { teams as initialTeams, type Team } from '@/lib/mock-data';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AddTeam } from './_components/AddTeam';

export default function TeamsPage() {
  const teams = initialTeams.filter(t => t.category !== 'Copa');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-green-500 to-lime-400 text-transparent bg-clip-text">
                Equipos
              </span>
            </h2>
        </div>
        <AddTeam />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <Card key={team.id} neon="green" className="flex flex-col group transition-all hover:scale-[1.02]">
            <div className="p-0 relative">
                 <Image
                    src={team.logoUrl}
                    alt={`Logo de ${team.name}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    data-ai-hint="team logo"
                />
            </div>
             <CardHeader>
                <CardTitle className="text-xl font-headline truncate">{team.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{team.category}</Badge>
             </CardHeader>
            <CardFooter className="mt-auto">
                 <Link href={`/teams/${team.id}`} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2">
                    Ver Detalles
                </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
