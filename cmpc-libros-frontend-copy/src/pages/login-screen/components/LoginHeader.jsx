import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoginHeader = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');

  const languages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('selectedLanguage', langCode);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-50">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/login-screen" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="BookOpen" size={24} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">CMPC Books</span>
            <span className="text-xs text-muted-foreground">Sistema de Inventario</span>
          </div>
        </Link>

        {/* Language Selector */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e?.target?.value)}
              className="appearance-none bg-muted border border-border rounded-md px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
            >
              {languages?.map((lang) => (
                <option key={lang?.code} value={lang?.code}>
                  {lang?.flag} {lang?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>

          {/* Help Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="HelpCircle"
            iconPosition="left"
            onClick={() => alert('Soporte técnico: soporte@cmpc.com')}
          >
            <span className="hidden sm:inline">Ayuda</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;