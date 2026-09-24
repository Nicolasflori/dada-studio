// Generado con el MCP de Supabase (mcp__...__generate_typescript_types).
// Volver a generar cada vez que cambie el esquema (supabase/schema.sql o una migración nueva)
// para que el resto de la app tenga los tipos de columnas reales, no solo los declarados a mano.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      alumnos: {
        Row: {
          activo: boolean;
          contacto: string | null;
          created_at: string;
          fecha_inicio: string;
          id: string;
          nombre: string;
          profesor_id: string;
        };
        Insert: {
          activo?: boolean;
          contacto?: string | null;
          created_at?: string;
          fecha_inicio?: string;
          id?: string;
          nombre: string;
          profesor_id: string;
        };
        Update: {
          activo?: boolean;
          contacto?: string | null;
          created_at?: string;
          fecha_inicio?: string;
          id?: string;
          nombre?: string;
          profesor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alumnos_profesor_id_fkey";
            columns: ["profesor_id"];
            isOneToOne: false;
            referencedRelation: "profesores";
            referencedColumns: ["id"];
          },
        ];
      };
      clases: {
        Row: {
          created_at: string;
          dia: string;
          hora: string;
          id: string;
          nombre: string;
          profesor_id: string;
        };
        Insert: {
          created_at?: string;
          dia: string;
          hora: string;
          id?: string;
          nombre: string;
          profesor_id: string;
        };
        Update: {
          created_at?: string;
          dia?: string;
          hora?: string;
          id?: string;
          nombre?: string;
          profesor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clases_profesor_id_fkey";
            columns: ["profesor_id"];
            isOneToOne: false;
            referencedRelation: "profesores";
            referencedColumns: ["id"];
          },
        ];
      };
      inscripciones: {
        Row: {
          alumno_id: string;
          clase_id: string;
          created_at: string;
          id: string;
        };
        Insert: {
          alumno_id: string;
          clase_id: string;
          created_at?: string;
          id?: string;
        };
        Update: {
          alumno_id?: string;
          clase_id?: string;
          created_at?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inscripciones_alumno_id_fkey";
            columns: ["alumno_id"];
            isOneToOne: false;
            referencedRelation: "alumnos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscripciones_clase_id_fkey";
            columns: ["clase_id"];
            isOneToOne: false;
            referencedRelation: "clases";
            referencedColumns: ["id"];
          },
        ];
      };
      pagos: {
        Row: {
          alumno_id: string;
          created_at: string;
          fecha: string;
          fecha_liquidacion: string | null;
          id: string;
          liquidado: boolean;
          medio_pago: string | null;
          mes_correspondiente: string;
          monto: number;
          profesor_id: string;
        };
        Insert: {
          alumno_id: string;
          created_at?: string;
          fecha?: string;
          fecha_liquidacion?: string | null;
          id?: string;
          liquidado?: boolean;
          medio_pago?: string | null;
          mes_correspondiente: string;
          monto: number;
          profesor_id: string;
        };
        Update: {
          alumno_id?: string;
          created_at?: string;
          fecha?: string;
          fecha_liquidacion?: string | null;
          id?: string;
          liquidado?: boolean;
          medio_pago?: string | null;
          mes_correspondiente?: string;
          monto?: number;
          profesor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pagos_alumno_id_fkey";
            columns: ["alumno_id"];
            isOneToOne: false;
            referencedRelation: "alumnos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pagos_profesor_id_fkey";
            columns: ["profesor_id"];
            isOneToOne: false;
            referencedRelation: "profesores";
            referencedColumns: ["id"];
          },
        ];
      };
      profesores: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          nombre: string;
          porcentaje_taller: number;
          rol: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          nombre: string;
          porcentaje_taller?: number;
          rol: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          nombre?: string;
          porcentaje_taller?: number;
          rol?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      alternar_liquidado: {
        Args: { p_liquidado: boolean; p_pago_id: string };
        Returns: undefined;
      };
      is_owner: { Args: Record<PropertyKey, never>; Returns: boolean };
      mi_profesor_id: { Args: Record<PropertyKey, never>; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
