'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { teams } from '@/lib/mock-data';

const BracketNode = ({ team, isWinner }: { team: string; isWinner?: boolean }) => (
  <div className="flex items-center">
    <div
      className={`flex items-center justify-between w-32 h-8 px-2 border rounded
        ${isWinner ? 'bg-primary/20 border-primary font-bold' : 'bg-muted/50'}`}
    >
      <span className="text-sm truncate">{team}</span>
    </div>
    <div className="w-8 h-px bg-muted-foreground"></div>
  </div>
);

const BracketRound = ({ children, isFinal = false }: { children: React.ReactNode; isFinal?: boolean }) => (
  <div className={`flex flex-col justify-around ${isFinal ? '' : 'mr-8'}`}>
    {children}
  </div>
);

const BracketConnector = () => (
    <div className="w-8 flex justify-center items-center -ml-px">
        <div className="h-full w-px bg-muted-foreground relative">
             <div className="absolute top-1/2 -translate-y-1/2 -right-0.5 w-2 h-px bg-muted-foreground"></div>
        </div>
    </div>
);

const Matchup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center">
        <div className="flex flex-col justify-center space-y-10">
            {children}
        </div>
        <BracketConnector />
    </div>
);


const CopaBracket = () => (
  <div className="flex justify-center items-center scale-75 md:scale-100">
    <div className="flex">
        {/* Left Side */}
        <BracketRound>
            <Matchup>
                <BracketNode team="Equipo 1" isWinner/>
                <BracketNode team="Equipo 2" />
            </Matchup>
            <Matchup>
                <BracketNode team="Equipo 3" />
                <BracketNode team="Equipo 4" isWinner/>
            </Matchup>
             <Matchup>
                <BracketNode team="Equipo 5" isWinner/>
                <BracketNode team="Equipo 6" />
            </Matchup>
            <Matchup>
                <BracketNode team="Equipo 7" />
                <BracketNode team="Equipo 8" isWinner/>
            </Matchup>
        </BracketRound>
        <BracketRound>
             <Matchup>
                <BracketNode team="Equipo 1" isWinner/>
                <BracketNode team="Equipo 4" />
            </Matchup>
             <Matchup>
                <BracketNode team="Equipo 5" />
                <BracketNode team="Equipo 8" isWinner/>
            </Matchup>
        </BracketRound>
         <BracketRound>
             <Matchup>
                <BracketNode team="Equipo 1" />
                <BracketNode team="Equipo 8" isWinner/>
            </Matchup>
        </BracketRound>

        {/* Final */}
         <BracketRound isFinal>
             <div className="flex flex-col items-center justify-center h-full">
                <div className="text-2xl font-bold font-headline mb-4">Final</div>
                <div className="flex items-center space-x-4">
                    <div className="w-32 h-10 px-2 border rounded bg-destructive/80 text-destructive-foreground flex items-center justify-center font-bold">Equipo 8</div>
                     <div className="text-xl font-bold">VS</div>
                    <div className="w-32 h-10 px-2 border rounded bg-destructive/80 text-destructive-foreground flex items-center justify-center font-bold">Equipo 23</div>
                </div>
            </div>
        </BracketRound>

        {/* Right Side */}
         <BracketRound>
             <Matchup>
                <BracketNode team="Equipo 17" isWinner/>
                <BracketNode team="Equipo 18" />
            </Matchup>
        </BracketRound>
         <BracketRound>
             <Matchup>
                <BracketNode team="Equipo 17"/>
                <BracketNode team="Equipo 20" isWinner/>
            </Matchup>
             <Matchup>
                <BracketNode team="Equipo 21" />
                <BracketNode team="Equipo 23" isWinner/>
            </Matchup>
        </BracketRound>
        <BracketRound>
            <Matchup>
                <BracketNode team="Equipo 17" />
                <BracketNode team="Equipo 20" isWinner/>
            </Matchup>
            <Matchup>
                <BracketNode team="Equipo 21" />
                <BracketNode team="Equipo 24" isWinner/>
            </Matchup>
             <Matchup>
                <BracketNode team="Equipo 25" isWinner/>
                <BracketNode team="Equipo 26" />
            </Matchup>
            <Matchup>
                <BracketNode team="Equipo 27" />
                <BracketNode team="Equipo 28" isWinner/>
            </Matchup>
        </BracketRound>
    </div>
  </div>
);

export default function SchedulePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Programación de Partidos
      </h2>
      <Tabs defaultValue="copa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="copa">Copa La Luz</TabsTrigger>
          <TabsTrigger value="maxima">Máxima</TabsTrigger>
          <TabsTrigger value="primera">Primera</TabsTrigger>
        </TabsList>
        <TabsContent value="copa">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Copa La Luz (36 Equipos)</CardTitle>
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
                <p className="text-muted-foreground">Bracket para la categoría Máxima no disponible aún.</p>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="primera">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Primera</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <p className="text-muted-foreground">Bracket para la categoría Primera no disponible aún.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
