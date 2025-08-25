import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  const getDefaultBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [
      { label: 'Inicio', path: '/book-inventory-dashboard', icon: 'Home' }
    ];

    const routeMap = {
      'book-inventory-dashboard': { label: 'Inventario', icon: 'Grid3X3' },
      'add-new-book-form': { label: 'Agregar Libro', icon: 'Plus' },
      'search-results-page': { label: 'Resultados de Búsqueda', icon: 'Search' },
      'book-details-view': { label: 'Detalles del Libro', icon: 'BookOpen' }
    };

    pathSegments?.forEach((segment, index) => {
      if (routeMap?.[segment]) {
        const path = '/' + pathSegments?.slice(0, index + 1)?.join('/');
        breadcrumbs?.push({
          ...routeMap?.[segment],
          path: path
        });
      }
    });

    // Remove duplicate home/inicio entries
    if (breadcrumbs?.length > 1 && breadcrumbs?.[1]?.path === '/book-inventory-dashboard') {
      breadcrumbs?.shift();
    }

    return breadcrumbs;
  };

  const breadcrumbs = customItems || getDefaultBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((item, index) => (
          <li key={item?.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-muted-foreground" 
              />
            )}
            
            {index === breadcrumbs?.length - 1 ? (
              // Current page - not clickable
              (<span className="flex items-center space-x-1 text-foreground font-medium">
                {item?.icon && <Icon name={item?.icon} size={16} />}
                <span className="truncate max-w-xs sm:max-w-sm md:max-w-md">
                  {item?.label}
                </span>
              </span>)
            ) : (
              // Clickable breadcrumb
              (<Link
                to={item?.path}
                className="flex items-center space-x-1 hover:text-foreground transition-micro"
              >
                {item?.icon && <Icon name={item?.icon} size={16} />}
                <span className="truncate max-w-xs sm:max-w-sm">
                  {item?.label}
                </span>
              </Link>)
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;