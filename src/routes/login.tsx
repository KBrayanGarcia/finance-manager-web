import React from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@/features/auth/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, AlertCircle } from "lucide-react";

const loginSchema = z.object({
    email: z.email("Ingresa un correo electrónico válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
    beforeLoad: () => {
        const token = useAuthStore.getState().token;
        if (token) {
            throw redirect({ to: "/" });
        }
    },
    component: LoginPage,
});

function LoginPage(): React.ReactElement {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            await loginMutation.mutateAsync(values);
            navigate({ to: "/" });
        } catch {
            // El error se maneja visualmente a través del estado de la mutación
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-lg border-border">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                    <CardDescription>Ingresa tus credenciales para acceder a tu billetera financiera</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {loginMutation.isError && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Credenciales inválidas o error en el servidor.</span>
                            </div>
                        )}

                        <div className="space-y-1 text-left">
                            <label className="text-xs font-medium text-foreground" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <Input id="email" type="email" placeholder="ejemplo@correo.com" {...register("email")} />
                            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1 text-left">
                            <label className="text-xs font-medium text-foreground" htmlFor="password">
                                Contraseña
                            </label>
                            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                            {errors.password && (
                                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? "Ingresando..." : "Iniciar Sesión"}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register" className="text-primary font-medium hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
