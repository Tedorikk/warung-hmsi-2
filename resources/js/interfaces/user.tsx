// @/interfaces/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
  }
  
  export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot?: {
      model_id: number;
      role_id: number;
      model_type: string;
    };
  }
  