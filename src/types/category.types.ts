export type CategoryType = 'EXPENSE' | 'INCOME';

export interface Category {
  readonly id: string;
  readonly userId: string | null;
  readonly name: string;
  readonly type: CategoryType;
  readonly icon?: string;
  readonly color?: string;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateCategoryPayload {
  readonly name: string;
  readonly type: CategoryType;
  readonly icon?: string;
  readonly color?: string;
}

export interface UpdateCategoryPayload {
  readonly name?: string;
  readonly type?: CategoryType;
  readonly icon?: string;
  readonly color?: string;
  readonly isActive?: boolean;
}
