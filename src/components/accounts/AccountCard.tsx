import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Account } from "@/types/account.types";

interface AccountCardProps {
    readonly account: Account;
    readonly onEdit: (account: Account) => void;
    readonly onDelete: (id: string) => void;
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps): React.ReactElement {
    return (
        <Card className="border-border shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div
                            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: account.color || "#3B82F6" }}
                        />
                        <CardTitle className="text-base font-bold truncate">{account.name}</CardTitle>
                    </div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground flex-shrink-0">
                        {account.type}
                    </span>
                </div>
                <CardDescription className="text-xs">Moneda: {account.currency}</CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
                <p className="text-xs text-muted-foreground m-0">Saldo actual</p>
                <div className="text-2xl font-bold text-foreground">
                    $
                    {Number(account.currentBalance).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            </CardContent>

            <div className="px-6 py-3 bg-muted/20 border-t border-border flex items-center justify-end gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(account)}
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(account.id)}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>
        </Card>
    );
}
