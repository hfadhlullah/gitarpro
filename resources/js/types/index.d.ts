export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    email_verified_at?: string;
    profile_photo_url?: string | null;
}

export interface ProfileUser {
    id: number;
    name: string;
    profile_photo_url: string | null;
    videos_count: number;
    likes_received: number;
}

export interface SuggestedUser {
    id: number;
    name: string;
    profile_photo_path: string | null;
    videos_count: number;
}

export interface CommentItem {
    id: number;
    content: string;
    user_id: number;
    user: { id: number; name: string };
    created_at: string;
}

export interface TabData {
    format: string;
    content: string;
}

export interface VideoItem {
    id: number;
    title: string;
    url: string;
    likes_count: number;
    liked: boolean;
    user?: { id: number; name: string; profile_photo_url?: string | null };
    created_at: string;
    tab?: TabData | null;
    comments_count?: number;
    comments?: CommentItem[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export interface LessonItem {
    id: number;
    title: string;
    description: string | null;
    level: 'beginner' | 'intermediate' | 'pro';
    tags: string[];
    user: { id: number; name: string } | null;
    video_url: string | null;
    created_at: string;
}
