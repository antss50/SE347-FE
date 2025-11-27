export type User = {
    id: string;
    email: string;
    full_name: string;
    phone_number: string | null;
    user_type: 'individual' | 'business';
    identity_number: string | null;
    tax_id?: string | null;
};

export type LoginResponse = {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_in: number;
};

export type RegisterResponse = {
    user_id: string;
    email: string;
    verification_required: boolean;
}

export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta | unknown;
    timestamp: string;
    path: string;
}