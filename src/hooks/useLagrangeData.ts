import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LagrangeAxis {
  id: string;
  label: string;
  color: string;
}

export interface LagrangeNode {
  id: string;
  titulo: string;
  episodio: number;
  eje: string;
  angulo: string;
  palabras_clave: string[];
  url: string | null;
  position_x: number;
  position_y: number;
}

export interface LagrangeConnection {
  id: string;
  from_node: string;
  to_node: string;
  tipo: string;
}

export function useLagrangeAxes() {
  return useQuery({
    queryKey: ["lagrange-axes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lagrange_axes")
        .select("*")
        .order("id");
      
      if (error) throw error;
      return data as LagrangeAxis[];
    },
  });
}

export function useLagrangeNodes() {
  return useQuery({
    queryKey: ["lagrange-nodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lagrange_nodes")
        .select("*")
        .order("episodio");
      
      if (error) throw error;
      return data as LagrangeNode[];
    },
  });
}

export function useLagrangeConnections() {
  return useQuery({
    queryKey: ["lagrange-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lagrange_connections")
        .select("*");
      
      if (error) throw error;
      return data as LagrangeConnection[];
    },
  });
}

export function useLagrangeData() {
  const axesQuery = useLagrangeAxes();
  const nodesQuery = useLagrangeNodes();
  const connectionsQuery = useLagrangeConnections();

  return {
    axes: axesQuery.data ?? [],
    nodes: nodesQuery.data ?? [],
    connections: connectionsQuery.data ?? [],
    isLoading: axesQuery.isLoading || nodesQuery.isLoading || connectionsQuery.isLoading,
    error: axesQuery.error || nodesQuery.error || connectionsQuery.error,
  };
}
