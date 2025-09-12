import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/AppIcon";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] grid place-items-center p-8 text-center">
      <div className="max-w-lg grid gap-4">
        <Icon name="AlertTriangle" size={48} />
        <h1 className="text-2xl font-semibold">Página no encontrada</h1>
        <p className="text-muted-foreground">
          La ruta que intentas visitar no existe o fue movida.
        </p>

        <div className="flex items-center justify-center gap-3 mt-2">
          <Button
            variant="outline"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>

          <Button
            variant="default"
            iconName="Home"
            iconPosition="left"
            onClick={() => navigate("/")}
          >
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
