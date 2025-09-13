import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { uploadService } from '../../services/uploadService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import BookImageUpload from './components/BookImageUpload';
import InventoryDataSection from './components/InventoryDataSection';

const AddNewBookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(isEdit);
  const [error, setError] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,               // 👈 AÑADIDO: necesitamos control para Controller
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      genre: '',
      price: '',
      available: false,    // 👈 booleano por defecto
      imageUrl: ''
    }
  });

  useEffect(() => {
    if (isEdit && id) {
      loadBook(id);
    }
  }, [isEdit, id]);

  const loadBook = async (bookId: any) => {
    try {
      setLoadingBook(true);
      const response = await bookService?.getBook(bookId);
      if (response?.data) {
        const book = response?.data;
        reset({
          title: book?.title || '',
          author: book?.author || '',
          publisher: book?.publisher || '',
          genre: book?.genre || '',
          price: book?.price || '',
          available: !!(book?.available), // 👈 asegura booleano
          imageUrl: book?.imageUrl || ''
        });
        if (book?.imageUrl) {
          // Handle both relative and absolute URLs
          const imageUrl = book.imageUrl.startsWith('http') 
            ? book.imageUrl 
            : `http://localhost:3000${book.imageUrl}`;
          setImagePreview(imageUrl);
        }
      }
    } catch (err) {
      console.error('Error loading book:', err);
      setError('Error al cargar los datos del libro');
    } finally {
      setLoadingBook(false);
    }
  };

  const handleImageChange = (file: any, preview: any) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await uploadService.uploadBookImage(file);
      console.log('Full upload response:', JSON.stringify(response, null, 2));
      console.log('response.data:', response.data);
      
      // Try different access patterns based on actual structure
      let imageUrl = '';
      if ((response.data as any)?.data?.imageUrl) {
        imageUrl = (response.data as any).data.imageUrl;
      } else if (response.data?.imageUrl) {
        imageUrl = response.data.imageUrl;
      }
      
      console.log('Extracted imageUrl:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error al subir la imagen');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      let imageUrl = data?.imageUrl;

      // Upload image first if a new file is selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          throw new Error('Error al subir la imagen. Por favor, inténtelo de nuevo.');
        }
      }

      const bookData = {
        ...data,
        price: String(data?.price) || '0', // "xxxxx.00"
        available: !!data?.available,      // 👈 asegura booleano hacia el backend
        imageUrl: imageUrl || null
      };

      console.log('Book data being sent:', bookData);

      let response;
      if (isEdit) {
        response = await bookService?.updateBook(id, bookData);
      } else {
        response = await bookService?.createBook(bookData);
      }

      if (response?.success !== false) {
        setShowSuccess(true);
        if (!isEdit) {
          reset();
          setImageFile(null);
          setImagePreview('');
        }
        setTimeout(() => navigate('/inventory'), 2000);
      }
    } catch (err: any) {
      console.error('Error saving book:', err);
      setError(
        err?.message ||
        `Error al ${isEdit ? 'actualizar' : 'crear'} el libro. Por favor, inténtelo de nuevo.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/inventory');

  if (loadingBook) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
          <span className="text-muted-foreground">Cargando datos del libro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? 'Editar Libro' : 'Agregar Nuevo Libro'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit 
              ? 'Modifica los datos del libro seleccionado'
              : 'Completa la información para agregar un nuevo libro al inventario'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-700">
              {isEdit ? 'Libro actualizado exitosamente' : 'Libro creado exitosamente'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Título"
                    type="text"
                    {...register('title', { required: 'El título es requerido' })}
                    error={errors?.title?.message}
                  />
                  <Input
                    label="Autor"
                    type="text"
                    {...register('author', { required: 'El autor es requerido' })}
                    error={errors?.author?.message}
                  />
                  <Input
                    label="Editorial"
                    type="text"
                    {...register('publisher', { required: 'La editorial es requerida' })}
                    error={errors?.publisher?.message}
                  />
                  <Input
                    label="Género"
                    type="text"
                    {...register('genre', { required: 'El género es requerido' })}
                    error={errors?.genre?.message}
                  />
                </div>
              </div>

              <InventoryDataSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                control={control}
              />
            </div>

            <div className="lg:col-span-1">
              <BookImageUpload
                currentImage={imagePreview}
                onImageChange={handleImageChange}
                error={errors?.imageUrl?.message}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar Libro' : 'Crear Libro')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewBookForm;
