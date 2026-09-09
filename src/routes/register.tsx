import React from 'react';
import { createFileRoute, Link, useNavigate, redirect } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegister } from '@/features/auth/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().optional(),
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    const token = useAuthStore.getState().token;
    if (token) {
      throw redirect({ to: '/' });
    }
  },
  component: RegisterPage,
});

function RegisterPage(): React.ReactElement {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName || undefined,
        email: values.email,
        password: values.password,
      });
      navigate({ to: '/' });
    } catch {
      // Manejo de error visual
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para comenzar a administrar tus finanzas personales
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {registerMutation.isError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Error al registrarse. El correo podría ya estar en uso.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground" htmlFor="firstName">
                  Nombre
                </label>
                <Input
                  id="firstName"
                  placeholder="Tu nombre"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground" htmlFor="lastName">
                  Apellido
                </label>
                <Input
                  id="lastName"
                  placeholder="Tu apellido"
                  {...register('lastName')}
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-foreground" htmlFor="email">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-foreground" htmlFor="password">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
