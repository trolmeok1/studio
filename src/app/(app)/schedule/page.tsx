
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { teams } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Dices, RefreshCw } from 'lucide-react';
import React from 'react';

const BracketNode = ({ team, isWinner, score }: { team: string; isWinner?: boolean; score?: number }) => (
  <div className="flex items-center">
    <div
      className={`flex items-center justify-between w-36 h-8 px-2 border rounded
        ${isWinner ? 'bg-primary/20 border-primary font-bold' : 'bg-muted/50'}`}
    >
      <span className="text-sm truncate">{team}</span>
      {score !== undefined && <span className="text-xs font-mono bg-background px-1 rounded">{score}</span>}
    </div>
    <div className="w-8 h-px bg-muted-foreground"></div>
  </div>
);

const Matchup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center my-4">
        <div className="flex flex-col justify-center space-y-4 bg-background/20 p-1 rounded-md">
            {children}
        </div>
        <div className="w-8 flex justify-center items-center -ml-px">
            <div className="h-1/2 w-px bg-muted-foreground relative border-r border-muted-foreground">
                 <div className="absolute top-1/2 -translate-y-1/2 -right-0 w-2 h-px bg-muted-foreground"></div>
            </div>
        </div>
    </div>
);

const Round = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col justify-around mr-8">
    {children}
  </div>
);

const FinalMatch = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h3 className="text-2xl font-bold font-headline mb-4 text-primary">FINAL</h3>
        <div className="p-4 border-2 border-primary rounded-lg bg-card shadow-lg">
            <div className="flex items-center space-x-4">
                 <div className="flex flex-col items-center gap-2">
                    <h4 className="font-bold text-lg">Equipo 8</h4>
                    <p className="text-4xl font-black">3</p>
                 </div>
                 <div className="text-xl font-bold text-muted-foreground">VS</div>
                 <div className="flex flex-col items-center gap-2">
                    <h4 className="font-bold text-lg">Equipo 23</h4>
                    <p className="text-4xl font-black">1</p>
                 </div>
            </div>
        </div>
         <div className="mt-4">
            <p className="text-sm text-muted-foreground">Campeón</p>
            <p className="text-xl font-bold text-amber-400">🏆 Equipo 8 🏆</p>
        </div>
    </div>
);

const CopaBracket = () => (
  <div className="flex justify-center p-4">
    <div className="flex items-start">
      {/* Ronda de 16 (Izquierda) */}
      <Round>
        {Array.from({ length: 8 }).map((_, i) => (
          <Matchup key={`l-r16-${i}`}>
            <BracketNode team={`Equipo ${i * 2 + 1}`} isWinner={i % 2 === 0} />
            <BracketNode team={`Equipo ${i * 2 + 2}`} />
          </Matchup>
        ))}
      </Round>

      {/* Octavos de Final (Izquierda) */}
      <Round>
        {Array.from({ length: 4 }).map((_, i) => (
          <Matchup key={`l-r8-${i}`}>
            <BracketNode team={`Equipo ${i * 4 + 1}`} isWinner={i % 2 === 0} />
            <BracketNode team={`Equipo ${i * 4 + 3}`} />
          </Matchup>
        ))}
      </Round>

      {/* Cuartos de Final (Izquierda) */}
      <Round>
         <Matchup>
            <BracketNode team="Equipo 1" isWinner />
            <BracketNode team="Equipo 5" />
          </Matchup>
          <Matchup>
            <BracketNode team="Equipo 9" />
            <BracketNode team="Equipo 13" isWinner />
          </Matchup>
      </Round>

      {/* Semifinal (Izquierda) */}
       <Round>
         <Matchup>
            <BracketNode team="Equipo 1" />
            <BracketNode team="Equipo 13" isWinner />
          </Matchup>
      </Round>
      
      {/* Final */}
      <div className="flex flex-col items-center justify-center h-full mx-8">
        <FinalMatch />
      </div>

       {/* Semifinal (Derecha) */}
       <Round>
         <Matchup>
            <BracketNode team="Equipo 17" isWinner />
            <BracketNode team="Equipo 29" />
          </Matchup>
      </Round>

       {/* Cuartos de Final (Derecha) */}
      <Round>
         <Matchup>
            <BracketNode team="Equipo 17" isWinner/>
            <BracketNode team="Equipo 21" />
          </Matchup>
          <Matchup>
            <BracketNode team="Equipo 25" />
            <BracketNode team="Equipo 29" isWinner />
          </Matchup>
      </Round>

      {/* Octavos de Final (Derecha) */}
      <Round>
        {Array.from({ length: 4 }).map((_, i) => (
          <Matchup key={`r-r8-${i}`}>
            <BracketNode team={`Equipo ${17 + i * 4}`} isWinner={i % 2 === 0} />
            <BracketNode team={`Equipo ${19 + i * 4}`} />
          </Matchup>
        ))}
      </Round>
      
      {/* Ronda de 16 (Derecha) */}
      <Round>
        {Array.from({ length: 8 }).map((_, i) => (
          <Matchup key={`r-r16-${i}`}>
            <BracketNode team={`Equipo ${17 + i * 2}`} isWinner={i % 2 === 0} />
            <BracketNode team={`Equipo ${18 + i * 2}`} />
          </Matchup>
        ))}
      </Round>

    </div>
  </div>
);


export default function SchedulePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
            Programación de Partidos
        </h2>
        <Card className="p-2 bg-card/50">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold mr-2">Admin:</span>
                 <Button variant="outline">
                    <Dices className="mr-2" />
                    Sorteo de Equipos
                </Button>
                <Button>
                    <RefreshCw className="mr-2" />
                    Actualizar Bracket
                </Button>
            </div>
        </Card>
      </div>

      <Tabs defaultValue="copa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="copa">Copa La Luz</TabsTrigger>
          <TabsTrigger value="maxima">Máxima</TabsTrigger>
          <TabsTrigger value="primera">Primera</TabsTrigger>
        </TabsList>
        <TabsContent value="copa">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Copa La Luz (32 Equipos)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <CopaBracket />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="maxima">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Máxima</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <p className="text-muted-foreground">Bracket para la categoría Máxima no disponible aún. Realiza el sorteo para empezar.</p>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="primera">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Primera</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <p className="text-muted-foreground">Bracket para la categoría Primera no disponible aún. Realiza el sorteo para empezar.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
