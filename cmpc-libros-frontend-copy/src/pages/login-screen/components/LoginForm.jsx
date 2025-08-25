import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../../../services/authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }

    if (!formData?.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService?.login({
        email: formData?.email,
        password: formData?.password,
      });

      if (response?.success && response?.data?.access_token) {
        // Store authentication state
        const user = { 
          email: formData?.email 
        };
        
        login(response?.data?.access_token, user);
        
        if (formData?.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Redirect to intended page or default
        const from = location?.state?.from?.pathname || '/inventory';
        navigate(from, { replace: true });
      } else {
        setErrors({
          general: 'Respuesta del servidor no válida'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error?.response?.status === 401 || error?.message?.includes('Unauthorized')) {
        setErrors({
          general: 'Credenciales incorrectas. Verifique su correo electrónico y contraseña.'
        });
      } else if (error?.response?.status >= 500) {
        setErrors({
          general: 'Error del servidor. Por favor, inténtelo de nuevo más tarde.'
        });
      } else {
        setErrors({
          general: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
            <Icon name="BookOpen" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-muted-foreground">
            Accede al sistema de gestión de libros
          </p>
        </div>

        {/* General Error */}
        {errors?.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} className="text-red-500 mr-2" />
              <p className="text-sm text-red-700">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            placeholder="admin@cmpc.local"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="Ingrese su contraseña"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Recordar sesión"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            iconName={isLoading ? undefined : "LogIn"}
            iconPosition="left"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

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
      </div>
    </div>
  );
};

export default LoginForm;