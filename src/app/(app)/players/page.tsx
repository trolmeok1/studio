import { players } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PlayersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">
        Player Roster
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {players.map((player) => (
          <Card key={player.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="p-0">
              <Link href={`/players/${player.id}`}>
                <Image
                  src={player.photoUrl}
                  alt={`Photo of ${player.name}`}
                  width={400}
                  height={400}
                  className="w-full h-auto aspect-square object-cover"
                  data-ai-hint="player portrait"
                />
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Badge variant={player.category === 'Máxima' ? 'default' : 'secondary'}>{player.category}</Badge>
              <h3 className="text-xl font-bold font-headline mt-2">{player.name}</h3>
              <p className="text-muted-foreground">{player.team}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/players/${player.id}`}>View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
