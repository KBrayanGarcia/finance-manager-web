import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { User, Key } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/page-container';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ApiKeyList } from '@/components/api-keys/ApiKeyList';
import { ApiKeyCreateDialog } from '@/components/api-keys/ApiKeyCreateDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from '@/features/api-keys/use-api-keys';
import { confirmAction } from '@/store/confirm.store';
import type { CreateApiKeyResponse } from '@/types/api-key.types';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage(): React.ReactElement {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: apiKeys = [], isLoading: isLoadingKeys } = useApiKeys();
  const createApiKeyMutation = useCreateApiKey();
  const deleteApiKeyMutation = useDeleteApiKey();

  const handleCreateToken = async (params: {
    readonly name: string;
    readonly expiresAt?: string;
  }): Promise<CreateApiKeyResponse | null> => {
    try {
      const response = await createApiKeyMutation.mutateAsync(params);
      toast.success('API Key generada con éxito');
      return response;
    } catch {
      toast.error('Error al generar la API Key');
      return null;
    }
  };

  const handleDeleteToken = async (id: string, name: string) => {
    const isConfirmed = await confirmAction({
      title: `¿Revocar API Key "${name}"?`,
      description:
        'Cualquier aplicación o servidor MCP que use este token perderá el acceso inmediatamente.',
      confirmLabel: 'Revocar Token',
    });

    if (!isConfirmed) return;

    try {
      await deleteApiKeyMutation.mutateAsync(id);
      toast.success('API Key revocada exitosamente');
    } catch {
      toast.error('Error al revocar la API Key');
    }
  };

  return (
    <PageContainer
      title="Ajustes de Cuenta"
      description="Administra tu información personal y tokens de integración segura"
    >
      <div className="max-w-3xl space-y-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Información Personal</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>Tokens de Acceso (API Keys)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="api-keys">
            <ApiKeyList
              apiKeys={apiKeys}
              isLoading={isLoadingKeys}
              onOpenCreate={() => setIsCreateOpen(true)}
              onDelete={handleDeleteToken}
            />
          </TabsContent>
        </Tabs>

        <ApiKeyCreateDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreateToken}
          isSubmitting={createApiKeyMutation.isPending}
        />
      </div>
    </PageContainer>
  );
}