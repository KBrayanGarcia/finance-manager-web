import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  PlusCircle,
  Clock,
} from 'lucide-react';
import { useAccounts } from '@/features/accounts/use-accounts';
import { useTransactions } from '@/features/transactions/use-transactions';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage(): React.ReactElement {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: transactionsData, isLoading: isLoadingTx } = useTransactions({ limit: 5 });

  const totalBalance = accounts.reduce((acc, account) => acc + Number(account.currentBalance), 0);
  const recentTransactions = transactionsData?.data ?? [];

  return (
    <PageContainer
      title="Panel de Control"
      description="Resumen de tus cuentas financieras y últimos movimientos"
      actions={
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link to="/transactions">
              <PlusCircle className="w-4 h-4 mr-2" />
              Ver Transacciones
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Grilla de Métricas Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance Total Consolidado
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground truncate">
                {isLoadingAccounts ? (
                  <span className="text-muted-foreground text-lg">Cargando...</span>
                ) : (
                  `$${totalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Suma de todas tus cuentas activas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cuentas Financieras
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground truncate">
                {isLoadingAccounts ? '...' : accounts.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cuentas activas registradas en el sistema
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transacciones
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground truncate">
                {isLoadingTx ? '...' : (transactionsData?.total ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Movimientos históricos registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Cuentas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground m-0">Mis Cuentas</h3>
            <Link to="/accounts" className="text-xs text-primary font-medium hover:underline flex-shrink-0">
              Administrar cuentas →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Card key={account.id} className="border-border shadow-sm hover:shadow transition-shadow">
                <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base font-semibold truncate">{account.name}</CardTitle>
                    <CardDescription className="text-xs">{account.type}</CardDescription>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: account.color || '#3B82F6' }}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold truncate">
                    ${Number(account.currentBalance).toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      {account.currency}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sección de Transacciones Recientes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground m-0">Últimos Movimientos</h3>
            <Link to="/transactions" className="text-xs text-primary font-medium hover:underline flex-shrink-0">
              Ver todo el historial →
            </Link>
          </div>

          <Card className="border-border shadow-sm">
            <CardContent className="p-0">
              {recentTransactions.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-sm text-muted-foreground">
                  No hay transacciones registradas recientemente.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentTransactions.map((tx) => {
                    const isIncome = tx.type === 'INCOME';
                    const isTransfer = tx.type === 'TRANSFER';

                    return (
                      <div
                        key={tx.id}
                        className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isIncome
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : isTransfer
                                ? 'bg-blue-500/10 text-blue-600'
                                : 'bg-rose-500/10 text-rose-600'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : isTransfer ? (
                              <ArrowLeftRight className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-foreground m-0 truncate">
                              {tx.description || (isTransfer ? 'Transferencia' : 'Transacción')}
                            </p>
                            <p className="text-[11px] sm:text-xs text-muted-foreground m-0 truncate">
                              {format(new Date(tx.transactionDate), 'dd MMMM yyyy', { locale: es })}
                              {tx.account && ` • ${tx.account.name}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div
                            className={`text-xs sm:text-sm font-semibold ${
                              isIncome ? 'text-emerald-600' : isTransfer ? 'text-blue-600' : 'text-foreground'
                            }`}
                          >
                            {isIncome ? '+' : isTransfer ? '' : '-'}$
                            {Number(tx.amount).toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                          <Badge variant={isIncome ? 'success' : isTransfer ? 'secondary' : 'outline'} className="text-[10px] sm:text-xs">
                            {tx.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
