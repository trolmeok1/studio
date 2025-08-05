
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePen } from 'lucide-react';

export default function CommitteesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePen className="text-primary" />
            Gestión de Vocalías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            La página de vocalías está en construcción. ¡Vuelve pronto para ver las actualizaciones!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
