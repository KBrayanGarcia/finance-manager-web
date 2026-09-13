import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User as UserIcon, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useUpdateProfile } from '@/features/auth/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().optional(),
  password: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Formulario para consultar y actualizar los datos del perfil de usuario.
 */
export function ProfileForm(): React.ReactElement {
  const user = useAuthStore((state) => state.user);
  const updateProfileMutation = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      password: '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSuccessMessage(false);
    await updateProfileMutation.mutateAsync({
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      password: values.password || undefined,
    });
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 4000);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserIcon className="w-7 h-7" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Usuario'}
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Perfil actualizado correctamente.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="p-first-name">
                Nombre
              </label>
              <Input id="p-first-name" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="p-last-name">
                Apellido
              </label>
              <Input id="p-last-name" {...register('lastName')} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" htmlFor="p-email">
              Correo Electrónico (No editable)
            </label>
            <Input id="p-email" value={user?.email ?? ''} disabled className="opacity-70" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" htmlFor="p-password">
              Nueva Contraseña (Opcional)
            </label>
            <Input
              id="p-password"
              type="password"
              placeholder="Dejar en blanco para mantener la actual"
              {...register('password')}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Guardando...' : 'Actualizar Información'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}