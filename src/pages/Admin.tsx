import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // AXES CRUD
  const [axes, setAxes] = useState<any[]>([]);
  const [axisLabel, setAxisLabel] = useState("");
  const [axisColor, setAxisColor] = useState("#0070f3");
  // EPISODES CRUD
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [epTitle, setEpTitle] = useState("");
  const [epDesc, setEpDesc] = useState("");
  const [epDuration, setEpDuration] = useState("");
  const [epSeason, setEpSeason] = useState(1);
  const [epAxis, setEpAxis] = useState("");
  // NODES CRUD
  const [nodes, setNodes] = useState<any[]>([]);
  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeEje, setNodeEje] = useState("");
  const [nodeEpisodio, setNodeEpisodio] = useState("");
  const [nodeAngulo, setNodeAngulo] = useState("psicologico");
  const [nodeX, setNodeX] = useState(0);
  const [nodeY, setNodeY] = useState(0);

  useEffect(() => {
    fetchRoles();
    fetchAxes();
    fetchEpisodes();
    fetchNodes();
      const fetchNodes = async () => {
        const { data, error } = await supabase.from("lagrange_nodes").select("id, titulo, eje, episodio, angulo, position_x, position_y");
        if (!error && data) setNodes(data);
      };

      const handleAddNode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nodeTitle || !nodeEje || !nodeEpisodio) return;
        await supabase.from("lagrange_nodes").insert([{ titulo: nodeTitle, eje: nodeEje, episodio: Number(nodeEpisodio), angulo: nodeAngulo, position_x: nodeX, position_y: nodeY, id: nodeTitle.toLowerCase().replace(/ /g, "_") }]);
        setNodeTitle(""); setNodeEje(""); setNodeEpisodio(""); setNodeAngulo("psicologico"); setNodeX(0); setNodeY(0);
        await fetchNodes();
      };

      const handleDeleteNode = async (id: string) => {
        await supabase.from("lagrange_nodes").delete().eq("id", id);
        await fetchNodes();
      };
    const fetchEpisodes = async () => {
      const { data, error } = await supabase.from("lagrange_episodes").select("id, title, description, duration, season, axis");
      if (!error && data) setEpisodes(data);
    };

    const handleAddEpisode = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!epTitle || !epDesc || !epDuration || !epAxis) return;
      await supabase.from("lagrange_episodes").insert([{ title: epTitle, description: epDesc, duration: epDuration, season: epSeason, axis: epAxis }]);
      setEpTitle(""); setEpDesc(""); setEpDuration(""); setEpSeason(1); setEpAxis("");
      await fetchEpisodes();
    };

    const handleDeleteEpisode = async (id: string) => {
      await supabase.from("lagrange_episodes").delete().eq("id", id);
      await fetchEpisodes();
    };
  }, []);
  const fetchAxes = async () => {
    const { data, error } = await supabase.from("lagrange_axes").select("id, label, color");
    if (!error && data) setAxes(data);
  };

  const handleAddAxis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!axisLabel) return;
    await supabase.from("lagrange_axes").insert([{ label: axisLabel, color: axisColor, id: axisLabel.toLowerCase().replace(/ /g, "_") }]);
    setAxisLabel("");
    setAxisColor("#0070f3");
    await fetchAxes();
  };

  const handleDeleteAxis = async (id: string) => {
    await supabase.from("lagrange_axes").delete().eq("id", id);
    await fetchAxes();
  };

  const fetchRoles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("user_roles").select("id, user_id, role");
    if (!error && data) setRoles(data);
    setLoading(false);
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Buscar user_id por email
    const { data: users, error: userError } = await supabase.from("users").select("id").eq("email", email);
    if (userError || !users || users.length === 0) {
      setError("Usuario no encontrado");
      setLoading(false);
      return;
    }
    const user_id = users[0].id;
    const { error: insertError } = await supabase.from("user_roles").insert([{ user_id, role }]);
    if (insertError) setError("Error al asignar rol");
    await fetchRoles();
    setLoading(false);
  };

  const handleDeleteRole = async (id: string) => {
    setLoading(true);
    await supabase.from("user_roles").delete().eq("id", id);
    await fetchRoles();
    setLoading(false);
  };

  if (!isAdmin) return <div className="p-8">Acceso restringido.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-6 text-muted-foreground">Gestión de roles de usuario.</p>
      <form className="mb-6 flex gap-2" onSubmit={handleAddRole}>
        <input
          type="email"
          placeholder="Email del usuario"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)} className="border rounded px-2 py-1">
          <option value="viewer">viewer</option>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" className="px-4 py-1 rounded bg-primary text-primary-foreground font-semibold" disabled={loading}>
          Asignar rol
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="w-full border text-sm mb-12">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Usuario</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {roles.map(r => (
            <tr key={r.id}>
              <td className="p-2">{r.user_id}</td>
              <td className="p-2">{r.role}</td>
              <td className="p-2">
                <button onClick={() => handleDeleteRole(r.id)} className="text-red-500">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-display text-2xl font-bold mb-2">Nodos</h2>
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={handleAddNode}>
        <input type="text" placeholder="Título" value={nodeTitle} onChange={e => setNodeTitle(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
        <select value={nodeEje} onChange={e => setNodeEje(e.target.value)} className="border rounded px-2 py-1" required>
          <option value="">Eje</option>
          {axes.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
        <select value={nodeEpisodio} onChange={e => setNodeEpisodio(e.target.value)} className="border rounded px-2 py-1" required>
          <option value="">Episodio</option>
          {episodes.map(ep => <option key={ep.id} value={ep.id}>{ep.title}</option>)}
        </select>
        <select value={nodeAngulo} onChange={e => setNodeAngulo(e.target.value)} className="border rounded px-2 py-1">
          <option value="psicologico">Psicológico</option>
          <option value="institucional">Institucional</option>
          <option value="tecnologico">Tecnológico</option>
          <option value="existencial">Existencial</option>
          <option value="politico">Político</option>
          <option value="filosofico">Filosófico</option>
        </select>
        <input type="number" placeholder="X" value={nodeX} onChange={e => setNodeX(Number(e.target.value))} className="border rounded px-2 py-1 w-20" />
        <input type="number" placeholder="Y" value={nodeY} onChange={e => setNodeY(Number(e.target.value))} className="border rounded px-2 py-1 w-20" />
        <button type="submit" className="px-4 py-1 rounded bg-primary text-primary-foreground font-semibold">Agregar nodo</button>
      </form>
      <table className="w-full border text-sm mb-12">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Título</th>
            <th className="p-2 text-left">Eje</th>
            <th className="p-2 text-left">Episodio</th>
            <th className="p-2 text-left">Ángulo</th>
            <th className="p-2 text-left">X</th>
            <th className="p-2 text-left">Y</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {nodes.map(n => (
            <tr key={n.id}>
              <td className="p-2">{n.id}</td>
              <td className="p-2">{n.titulo}</td>
              <td className="p-2">{n.eje}</td>
              <td className="p-2">{n.episodio}</td>
              <td className="p-2">{n.angulo}</td>
              <td className="p-2">{n.position_x}</td>
              <td className="p-2">{n.position_y}</td>
              <td className="p-2"><button onClick={() => handleDeleteNode(n.id)} className="text-red-500">Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-display text-2xl font-bold mb-2">Episodios</h2>
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={handleAddEpisode}>
        <input type="text" placeholder="Título" value={epTitle} onChange={e => setEpTitle(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
        <input type="text" placeholder="Descripción" value={epDesc} onChange={e => setEpDesc(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
        <input type="text" placeholder="Duración" value={epDuration} onChange={e => setEpDuration(e.target.value)} className="border rounded px-2 py-1 w-24" required />
        <input type="number" min={1} placeholder="Temporada" value={epSeason} onChange={e => setEpSeason(Number(e.target.value))} className="border rounded px-2 py-1 w-20" required />
        <select value={epAxis} onChange={e => setEpAxis(e.target.value)} className="border rounded px-2 py-1" required>
          <option value="">Eje</option>
          {axes.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
        <button type="submit" className="px-4 py-1 rounded bg-primary text-primary-foreground font-semibold">Agregar episodio</button>
      </form>
      <table className="w-full border text-sm mb-12">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Título</th>
            <th className="p-2 text-left">Descripción</th>
            <th className="p-2 text-left">Duración</th>
            <th className="p-2 text-left">Temporada</th>
            <th className="p-2 text-left">Eje</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {episodes.map(ep => (
            <tr key={ep.id}>
              <td className="p-2">{ep.id}</td>
              <td className="p-2">{ep.title}</td>
              <td className="p-2">{ep.description}</td>
              <td className="p-2">{ep.duration}</td>
              <td className="p-2">{ep.season}</td>
              <td className="p-2">{ep.axis}</td>
              <td className="p-2"><button onClick={() => handleDeleteEpisode(ep.id)} className="text-red-500">Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-display text-2xl font-bold mb-2">Ejes (Axes)</h2>
      <form className="mb-4 flex gap-2" onSubmit={handleAddAxis}>
        <input
          type="text"
          placeholder="Nombre del eje"
          value={axisLabel}
          onChange={e => setAxisLabel(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <input
          type="color"
          value={axisColor}
          onChange={e => setAxisColor(e.target.value)}
          className="w-10 h-10 border rounded"
        />
        <button type="submit" className="px-4 py-1 rounded bg-primary text-primary-foreground font-semibold">Agregar eje</button>
      </form>
      <table className="w-full border text-sm mb-12">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Color</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {axes.map(a => (
            <tr key={a.id}>
              <td className="p-2">{a.id}</td>
              <td className="p-2">{a.label}</td>
              <td className="p-2"><span style={{ background: a.color, display: 'inline-block', width: 20, height: 20, borderRadius: 4 }}></span></td>
              <td className="p-2"><button onClick={() => handleDeleteAxis(a.id)} className="text-red-500">Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
