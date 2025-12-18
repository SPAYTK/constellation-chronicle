import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEditor?: boolean;
}

export function ProtectedRoute({ children, requireEditor = false }: ProtectedRouteProps) {
  const { user, isLoading, isEditor } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lagrange-dark">
        <Loader2 className="w-8 h-8 text-lagrange-miedo animate-spin" />
      </div>
    );
  }

  const isAuthenticated = !isLoading && user !== null && user !== undefined;

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireEditor && !isEditor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lagrange-dark px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-lagrange-text mb-4">Acceso Denegado</h1>
          <p className="text-lagrange-muted mb-6">
            Se requieren permisos de editor para acceder a esta página.
          </p>
          <a href="/" className="text-lagrange-miedo hover:text-lagrange-miedo/80">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
