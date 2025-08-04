
'use client';
import { teams as initialTeams, type Team, type Category } from '@/lib/mock-data';
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AddTeam } from './_components/AddTeam';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

const categories: Category[] = ['Máxima', 'Primera', 'Segunda'];

const getNeonColorForCategory = (category: Category) => {
    switch (category) {
        case 'Máxima': return 'purple';
        case 'Primera': return 'blue';
        case 'Segunda': return 'green';
        default: return 'none';
    }
}

const TeamCard = ({ team }: { team: Team }) => {
  return (
    <Card neon={getNeonColorForCategory(team.category)} className="flex flex-col group transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <Image
            src={team.logoUrl}
            alt={`Logo de ${team.name}`}
            width={400}
            height={300}
            className="w-full h-40 object-cover rounded-md"
            data-ai-hint="team logo"
          />
        </CardContent>
        <CardHeader className="pt-0 flex-grow">
          <CardTitle className="text-lg font-headline truncate">{team.name}</CardTitle>
          <Badge variant="secondary" className="w-fit">{team.category}</Badge>
        </CardHeader>
      <CardFooter>
         <Button asChild className="w-full">
            <Link href={`/teams/${team.id}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function TeamsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Category>('Máxima');
  const teams = initialTeams.filter(t => t.category !== 'Copa');

  const filteredTeams = useMemo(() => {
    return teams.filter(team => team.category === activeTab);
  }, [activeTab, teams]);


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
        {user.permissions.teams.edit && <AddTeam />}
      </div>
       
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Category)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                {categories.map(category => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
            </TabsList>
            
            {categories.map(category => (
                <TabsContent key={category} value={category}>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                        {filteredTeams.map((team) => (
                           <TeamCard key={team.id} team={team} />
                        ))}
                    </div>
                     {filteredTeams.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">
                            No hay equipos en esta categoría.
                        </div>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    </div>
  );
}
