export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image: string
          published_at: string | null
          is_published: boolean
          author_id: string
          category_id: string
          read_time: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image: string
          published_at?: string | null
          is_published?: boolean
          author_id: string
          category_id: string
          read_time?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          cover_image?: string
          published_at?: string | null
          is_published?: boolean
          author_id?: string
          category_id?: string
          read_time?: string
        }
      }
      authors: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          avatar: string
          bio: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          avatar: string
          bio: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          avatar?: string
          bio?: string
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          description: string
          image: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          description: string
          image: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          description?: string
          image?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
