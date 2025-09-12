import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

type Crumb = {
  label: string;
  path?: string;
  icon?: string;
};

type BreadcrumbProps = {
  customItems?: Crumb[] | null;
  className?: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ customItems = null, className }) => {
  const location = useLocation();

  const getDefaultBreadcrumbs = (): Crumb[] => {
    const pathSegments = location?.pathname?.split("/")?.filter(Boolean) ?? [];
    const breadcrumbs: Crumb[] = [
      { label: "Inicio", path: "/book-inventory-dashboard", icon: "Home" },
    ];

    // Mapea segmentos a labels e íconos legibles para la app
    const routeMap: Record<string, { label: string; icon?: string }> = {
      "book-inventory-dashboard": { label: "Inventario", icon: "Grid3X3" },
      "add-new-book-form": { label: "Agregar Libro", icon: "Plus" },
      "search-results-page": { label: "Resultados de Búsqueda", icon: "Search" },
      "book-details-view": { label: "Detalle del Libro", icon: "Book" },
      login: { label: "Ingresar", icon: "LogIn" },
    };

    let accumulatedPath = "";
    pathSegments.forEach((segment) => {
      accumulatedPath += `/${segment}`;
      const route = routeMap[segment] || { label: segment };
      breadcrumbs.push({
        label: route.label,
        path: accumulatedPath,
        icon: route.icon,
      });
    });

    return breadcrumbs;
  };

  const items = (customItems && customItems.length > 0)
    ? customItems
    : getDefaultBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content = (
            <span className="inline-flex items-center gap-2">
              {item.icon && <Icon name={item.icon} size={16} />}
              <span className={isLast ? "text-foreground" : ""}>{item.label}</span>
            </span>
          );

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {item.path && !isLast ? (
                <Link to={item.path} className="hover:underline">
                  {content}
                </Link>
              ) : (
                content
              )}
              {!isLast && <span className="mx-2 opacity-60">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
