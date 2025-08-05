
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function CopaPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-primary" />
            Copa de Campeones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            La página de la copa está en construcción. ¡Vuelve pronto para ver las actualizaciones!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
