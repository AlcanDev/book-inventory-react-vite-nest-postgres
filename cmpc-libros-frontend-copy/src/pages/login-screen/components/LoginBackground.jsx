import React from 'react';

const LoginBackground = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="books-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="none"/>
                <path d="M20 20h60v60H20z" fill="currentColor" opacity="0.1"/>
                <path d="M30 30h40v40H30z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#books-pattern)"/>
          </svg>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/5 rounded-full blur-2xl"></div>
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date()?.getFullYear()} CMPC-libros. Todos los derechos reservados.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-2">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Política de Privacidad
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Términos de Servicio
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Soporte Técnico
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginBackground;