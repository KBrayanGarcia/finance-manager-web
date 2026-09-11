import { create } from 'zustand';

export interface ConfirmOptions {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly variant?: 'destructive' | 'default';
}

interface ConfirmState {
  readonly isOpen: boolean;
  readonly options: ConfirmOptions;
  readonly confirm: (options: ConfirmOptions) => Promise<boolean>;
  readonly handleConfirm: () => void;
  readonly handleCancel: () => void;
}

let resolvePromise: ((value: boolean) => void) | null = null;

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  options: {
    title: '',
    description: '',
  },
  confirm: (options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
      set({ isOpen: true, options });
    });
  },
  handleConfirm: () => {
    resolvePromise?.(true);
    resolvePromise = null;
    set({ isOpen: false });
  },
  handleCancel: () => {
    resolvePromise?.(false);
    resolvePromise = null;
    set({ isOpen: false });
  },
}));

/**
 * Muestra el diálogo de confirmación global y retorna una promesa con la decisión del usuario.
 */
export const confirmAction = (options: ConfirmOptions): Promise<boolean> => {
  return useConfirmStore.getState().confirm(options);
};
