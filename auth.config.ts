import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirige a usuarios no autenticados a login
      } else if (isLoggedIn) {
        // CORRECCIÓN CLAVE: 
        // 1. Obtenemos la URL base de producción de la variable de entorno.
        // 2. Si la variable no existe (ej: entorno local), usamos nextUrl como fallback.
        const dashboardUrl = process.env.NEXTAUTH_URL 
            ? new URL('/dashboard', process.env.NEXTAUTH_URL) 
            : new URL('/dashboard', nextUrl);
        
        return Response.redirect(dashboardUrl);
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
