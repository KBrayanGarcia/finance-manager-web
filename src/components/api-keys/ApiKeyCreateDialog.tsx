import React, { useState } from "react";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Key, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateApiKeyResponse } from "@/types/api-key.types";

const createApiKeySchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    expirationOption: z.enum(["never", "30", "60", "90", "365"]),
});

type CreateApiKeyFormValues = z.infer<typeof createApiKeySchema>;

interface ApiKeyCreateDialogProps {
    readonly isOpen: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onSubmit: (params: {
        readonly name: string;
        readonly expiresAt?: string;
    }) => Promise<CreateApiKeyResponse | null>;
    readonly isSubmitting: boolean;
}

/**
 * Diálogo para la creación y revelación única de API Keys.
 */
export function ApiKeyCreateDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    isSubmitting,
}: ApiKeyCreateDialogProps): React.ReactElement {
    const [createdToken, setCreatedToken] = useState<CreateApiKeyResponse | null>(null);
    const [hasCopied, setHasCopied] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateApiKeyFormValues>({
        resolver: zodResolver(createApiKeySchema),
        defaultValues: {
            name: "",
            expirationOption: "never",
        },
    });

    const handleClose = (open: boolean) => {
        if (!open) {
            reset();
            setCreatedToken(null);
            setHasCopied(false);
        }
        onOpenChange(open);
    };

    const calculateExpiresAt = (option: string): string | undefined => {
        if (option === "never") return undefined;
        const days = parseInt(option, 10);
        return addDays(new Date(), days).toISOString();
    };

    const handleFormSubmit = async (values: CreateApiKeyFormValues) => {
        const expiresAt = calculateExpiresAt(values.expirationOption);
        const result = await onSubmit({ name: values.name, expiresAt });
        if (result) {
            setCreatedToken(result);
        }
    };

    const handleCopy = async () => {
        if (!createdToken) return;
        await navigator.clipboard.writeText(createdToken.rawKey);
        setHasCopied(true);
        toast.success("Clave copiada al portapapeles");
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary" />
                        <span>{createdToken ? "Token Generado Exitosamente" : "Generar Nueva API Key"}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {createdToken
                            ? "Asegúrate de copiar tu token ahora. Por motivos de seguridad, no se volverá a mostrar."
                            : "Crea un token de acceso personal para conectar el servidor MCP u otras integraciones."}
                    </DialogDescription>
                </DialogHeader>

                {createdToken ? (
                    <div className="space-y-4 py-2">
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3 text-amber-600 dark:text-amber-400 text-xs">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>
                                Esta es la <strong>única vez</strong> que podrás ver esta clave. Guárdala en tu archivo
                                de configuración o gestor de secretos seguro.
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Clave de acceso ({createdToken.name})
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    value={createdToken.rawKey}
                                    className="font-mono text-xs bg-muted/50 select-all"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="flex-shrink-0"
                                    onClick={handleCopy}
                                    title="Copiar token"
                                >
                                    {hasCopied ? (
                                        <Check className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" onClick={() => handleClose(false)} className="w-full">
                                Listo, he guardado mi clave
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label htmlFor="key-name" className="text-xs font-medium">
                                Nombre del Token / Aplicación
                            </label>
                            <Input id="key-name" placeholder="ej. Servidor MCP Claude Desktop" {...register("name")} />
                            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="key-expiration" className="text-xs font-medium">
                                Vigencia del Token
                            </label>
                            <select
                                id="key-expiration"
                                className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                {...register("expirationOption")}
                            >
                                <option value="never">Sin expiración (Recomendado para MCP)</option>
                                <option value="30">30 días</option>
                                <option value="60">60 días</option>
                                <option value="90">90 días</option>
                                <option value="365">1 año</option>
                            </select>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleClose(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Generando..." : "Generar Token"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
