export interface Address {
    address?: any;
    confirmed?: any;
    unconfirmed?: any;
}

export interface Query {
    search?: string;
    page?: number;
    tag?: string;
    limit?: number; // How much will be queried
    current_user?: string; // When you are querying user info, you need current user
    username?: string; // Used to check votes, follows, or feed
    author?: string;
    skip?: number;
    first_load?: boolean;
    offset?: string
    permlink?: string;
    start_permlink?: string;
    start_author?: string;
    user?: string;
    type?: string;
    category?: string;
    url?: string;
    query?: string;
}

export interface PostsRes {
    results?: Array<any>;
}

export interface steemConnect {
    userId?: number;
    isAuthenticated?: boolean;
    username?: string;
    permissions?: Array<string>;
    token?: Array<string>;
};