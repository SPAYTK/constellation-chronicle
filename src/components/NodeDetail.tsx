export default function NodeDetail({ node }: { node: any }) {
  return (
    <div>
      <h3>Detalle de Nodo</h3>
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
}
