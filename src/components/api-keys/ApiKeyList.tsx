import React from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Key, Trash2, ShieldCheck, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ApiKey } from '@/types/api-key.types';

interface ApiKeyListProps {
  readonly apiKeys: readonly ApiKey[];
  readonly isLoading: boolean;
  readonly onOpenCreate: () => void;
  readonly onDelete: (id: string, name: string) => void;
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Nunca utilizado';
  return format(parseISO(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
}

function formatExpiration(dateString?: string): string {
  if (!dateString) return 'Sin expiración';
  const date = parseISO(dateString);
  const isExpired = isPast(date);
  const formatted = format(date, 'dd MMM yyyy', { locale: es });

  return isExpired ? `Expiró el ${formatted}` : `Expira el ${formatted}`;
}

/**
 * Componente que renderiza el listado de API Keys activas para integraciones.
 */
export function ApiKeyList({
  apiKeys,
  isLoading,
  onOpenCreate,
  onDelete,
}: ApiKeyListProps): React.ReactElement {
  if (isLoading) {
    return (
      <Card className="border-border shadow-sm p-8 text-center text-sm text-muted-foreground">
        Cargando tokens de acceso...
      </Card>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <Card className="border-border border-dashed shadow-sm p-8 text-center">
        <Key className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-base font-semibold text-foreground">No tienes tokens de acceso</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-sm mx-auto">
          Genera una API Key para conectar el servidor MCP de finanzas con Claude Desktop u otros asistentes de IA.
        </p>
        <Button onClick={onOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Generar Primera API Key</span>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Tokens Activos</h3>
          <p className="text-xs text-muted-foreground">
            Claves con permisos completos para acceder a tus recursos financieros.
          </p>
        </div>
        <Button onClick={onOpenCreate} size="sm" className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Nueva API Key</span>
        </Button>
      </div>

      <div className="grid gap-3">
        {apiKeys.map((key) => (
          <Card key={key.id} className="border-border shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary flex-shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-sm font-semibold truncate">{key.name}</CardTitle>
                  <CardDescription className="font-mono text-xs text-muted-foreground">
                    {key.prefix}••••••••••••••••
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={key.isActive ? 'default' : 'secondary'} className="text-[10px]">
                  {key.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(key.id, key.name)}
                  title="Revocar token"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground border-t border-border/50 mt-2 bg-muted/10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Creado: {formatDate(key.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Uso: {formatDate(key.lastUsedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:justify-end">
                <span>{formatExpiration(key.expiresAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}