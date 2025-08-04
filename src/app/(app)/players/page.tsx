

import { players as allPlayers, teams as allTeams, type Category } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { PlayerSearch } from './_components/PlayerSearch';

const categories: Category[] = ['Máxima', 'Primera', 'Segunda'];

export default function PlayersPage() {
  const getPlayersByTeam = (teamId: string) => {
    return allPlayers.filter(p => p.teamId === teamId);
  }

  const getTeamsByCategory = (category: Category) => {
      return allTeams.filter(t => t.category === category);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
          <div className="text-center w-full">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-400 text-transparent bg-clip-text">
                Lista de Jugadores
              </span>
            </h2>
          </div>
      </div>
       
       <PlayerSearch players={allPlayers} teams={allTeams} />
    </div>
  );
}
