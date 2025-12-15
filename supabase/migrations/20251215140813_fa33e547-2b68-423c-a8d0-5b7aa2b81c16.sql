-- Create enum for connection types
CREATE TYPE public.connection_type AS ENUM ('consecuencia', 'retroalimentacion', 'tension', 'espejo', 'contradiccion');

-- Create enum for node angles
CREATE TYPE public.node_angle AS ENUM ('psicologico', 'institucional', 'tecnologico', 'existencial', 'politico', 'filosofico');

-- Create table for Lagrange axes (ejes)
CREATE TABLE public.lagrange_axes (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b3b3b',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on axes (public read)
ALTER TABLE public.lagrange_axes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view axes" 
ON public.lagrange_axes 
FOR SELECT 
USING (true);

-- Create table for Lagrange nodes (nodos)
CREATE TABLE public.lagrange_nodes (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  episodio INTEGER NOT NULL,
  eje TEXT NOT NULL REFERENCES public.lagrange_axes(id) ON DELETE CASCADE,
  angulo node_angle NOT NULL DEFAULT 'psicologico',
  palabras_clave TEXT[] DEFAULT '{}',
  url TEXT,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on nodes (public read)
ALTER TABLE public.lagrange_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view nodes" 
ON public.lagrange_nodes 
FOR SELECT 
USING (true);

-- Create table for node connections (conexiones)
CREATE TABLE public.lagrange_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node TEXT NOT NULL REFERENCES public.lagrange_nodes(id) ON DELETE CASCADE,
  to_node TEXT NOT NULL REFERENCES public.lagrange_nodes(id) ON DELETE CASCADE,
  tipo connection_type NOT NULL DEFAULT 'consecuencia',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(from_node, to_node)
);

-- Enable RLS on connections (public read)
ALTER TABLE public.lagrange_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view connections" 
ON public.lagrange_connections 
FOR SELECT 
USING (true);

-- Insert the 5 main axes
INSERT INTO public.lagrange_axes (id, label, color) VALUES
  ('miedo_control', 'Miedo → Control', '#5a1a1a'),
  ('culpa_obediencia', 'Culpa → Obediencia', '#3b3b3b'),
  ('tecnologia_vigilancia', 'Tecnología → Vigilancia', '#1f2f3a'),
  ('fatiga_delegacion', 'Fatiga → Delegación', '#2e1f3a'),
  ('conciencia_silencio', 'Conciencia → Silencio', '#1a3a2e');

-- Insert sample nodes
INSERT INTO public.lagrange_nodes (id, titulo, episodio, eje, angulo, palabras_clave, url, position_x, position_y) VALUES
  ('ep01', 'El miedo como lenguaje común', 1, 'miedo_control', 'psicologico', ARRAY['miedo', 'normalización', 'seguridad'], '/podcast/episodio-01', 350, 300),
  ('ep02', 'La trampa de la razón', 2, 'culpa_obediencia', 'filosofico', ARRAY['razón', 'control', 'lógica'], '/podcast/episodio-02', 450, 250),
  ('ep03', 'La comedia del control', 3, 'miedo_control', 'politico', ARRAY['control', 'humor', 'poder'], '/podcast/episodio-03', 280, 400),
  ('ep17', 'Delegar para no decidir', 17, 'fatiga_delegacion', 'institucional', ARRAY['fatiga', 'burocracia', 'obediencia'], '/podcast/episodio-17', 700, 500),
  ('ep25', 'La vigilancia como cuidado', 25, 'tecnologia_vigilancia', 'tecnologico', ARRAY['vigilancia', 'tecnología', 'protección'], '/podcast/episodio-25', 600, 200),
  ('ep42', 'El silencio de los que saben', 42, 'conciencia_silencio', 'existencial', ARRAY['silencio', 'conocimiento', 'pasividad'], '/podcast/episodio-42', 850, 350);

-- Insert sample connections
INSERT INTO public.lagrange_connections (from_node, to_node, tipo) VALUES
  ('ep01', 'ep17', 'consecuencia'),
  ('ep17', 'ep01', 'retroalimentacion'),
  ('ep01', 'ep03', 'espejo'),
  ('ep02', 'ep42', 'contradiccion'),
  ('ep25', 'ep17', 'tension'),
  ('ep03', 'ep25', 'consecuencia');