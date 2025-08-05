
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';

export default function CopaMatchPage() {
  const params = useParams();
  const matchId = params.id;

  if (!matchId) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-primary" />
            Detalles del Partido de Copa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detalles para el partido de copa con ID: {matchId}. Esta página está en construcción.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
