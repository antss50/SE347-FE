export type User = {
    user_id: string;
    email: string;
    full_name: string;
    phone_number: string | null;
    user_type: 'individual' | 'business';
    identity_number: string | null;
    tax_id: string | null;
    email_verified: boolean;
    created_at: string;
};

export type LoginResponse = {
    user: User;
    access_token: string;
};

export type RegisterResponse = {
    user_id: string;
    email: string;
    verification_required: boolean;
}

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    meta: unknown;
    timestamp: string;
    path: string;
}