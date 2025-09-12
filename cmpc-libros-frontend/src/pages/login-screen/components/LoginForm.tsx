import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Checkbox from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../contexts/AuthContext";

type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

const LoginForm: React.FC = () => {
  const { login } = (useAuth() as any) || {};
  const navigate = useNavigate();
  const location: any = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const newErrors: Errors = {};
    if (!email) newErrors.email = "El correo electrónico es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "El formato del correo electrónico no es válido";

    if (!password) newErrors.password = "La contraseña es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await login?.(email, password, { remember });
      const from = location?.state?.from?.pathname || "/inventory";
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: err?.message || "Error al iniciar sesión",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      {errors?.general && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3">
          <p className="text-sm text-red-700">{errors?.general}</p>
        </div>
      )}

      <Input
        label="Correo Electrónico"
        type="email"
        name="email"
        placeholder="tucorreo@ejemplo.com"
        value={email}
        onChange={(e: any) => setEmail(e?.target?.value)}
        error={errors?.email}
        required
        disabled={loading}
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        placeholder="Tu contraseña"
        value={password}
        onChange={(e: any) => setPassword(e?.target?.value)}
        error={errors?.password}
        required
        disabled={loading}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          label="Recordar sesión"
          checked={remember}
          onChange={(e: any) => setRemember(!!e?.target?.checked)}
          disabled={loading}
        />
        {/* Recuperar contraseña, etc. */}
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={loading}
        iconName="LogIn"
        iconPosition="left"
        disabled={loading}
      >
        Ingresar
      </Button>
      {/* API Credentials Info */}
        <div className="mt-8 p-4 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground text-center mb-2">
            Credenciales de API:
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Email: admin@cmpc.local</div>
            <div>Contraseña: admin1234</div>
          </div>
        </div>
    </form>
  );
};

export default LoginForm;
