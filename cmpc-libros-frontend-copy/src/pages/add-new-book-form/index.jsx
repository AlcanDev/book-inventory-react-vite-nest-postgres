import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { bookService } from '../../services/bookService';
import BasicInformationSection from './components/BasicInformationSection';
import PublicationDetailsSection from './components/PublicationDetailsSection';
import InventoryDataSection from './components/InventoryDataSection';
import BookImageUpload from './components/BookImageUpload';
import FormActions from './components/FormActions';
import SuccessNotification from './components/SuccessNotification';

const AddNewBookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(isEdit);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      genre: '',
      price: '',
      available: true,
      imageUrl: ''
    }
  });

  // Load book data for editing
  useEffect(() => {
    if (isEdit && id) {
      loadBook(id);
    }
  }, [isEdit, id]);

  const loadBook = async (bookId) => {
    try {
      setLoadingBook(true);
      let response = await bookService?.getBook(bookId);
      
      if (response?.data) {
        const book = response?.data;
        reset({
          title: book?.title || '',
          author: book?.author || '',
          publisher: book?.publisher || '',
          genre: book?.genre || '',
          price: book?.price || '',
          available: book?.available ?? true,
          imageUrl: book?.imageUrl || ''
        });
        
        if (book?.imageUrl) {
          setImagePreview(book?.imageUrl);
        }
      }
    } catch (err) {
      console.error('Error loading book:', err);
      setError('Error al cargar los datos del libro');
    } finally {
      setLoadingBook(false);
    }
  };

  const handleImageChange = (file, preview) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const uploadImage = async (file) => {
    // This would normally upload to your storage service
    // For now, return a placeholder URL
    return `https://via.placeholder.com/400x600?text=${encodeURIComponent(file?.name)}`;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      let imageUrl = data?.imageUrl;

      // Upload image if a new one was selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const bookData = {
        ...data,
        price: String(data?.price) || '0',
        imageUrl
      };

      let response;
      if (isEdit) {
        response = await bookService?.updateBook(id, bookData);
      } else {
        response = await bookService?.createBook(bookData);
      }

      if (response?.success !== false) {
        setShowSuccess(true);
        
        // Reset form if creating new book
        if (!isEdit) {
          reset();
          setImageFile(null);
          setImagePreview('');
        }
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/inventory');
        }, 2000);
      }
    } catch (err) {
      console.error('Error saving book:', err);
      setError(
        err?.message || 
        `Error al ${isEdit ? 'actualizar' : 'crear'} el libro. Por favor, inténtelo de nuevo.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? 'Editar Libro' : 'Agregar Nuevo Libro'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit 
              ? 'Modifica los datos del libro seleccionado'
              : 'Completa la información para agregar un nuevo libro al inventario'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Notification */}
        {showSuccess && (
          <SuccessNotification
            isEdit={isEdit}
            onClose={() => setShowSuccess(false)}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              <BasicInformationSection
                register={register}
                errors={errors}
                watch={watch}
              />

              <PublicationDetailsSection
                register={register}
                errors={errors}
                watch={watch}
              />

              <InventoryDataSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            </div>

            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1">
              <BookImageUpload
                currentImage={imagePreview}
                onImageChange={handleImageChange}
                error={errors?.imageUrl?.message}
              />
            </div>
          </div>

          {/* Form Actions */}
          <FormActions
            isEdit={isEdit}
            loading={loading}
            onCancel={handleCancel}
          />
        </form>
      </div>
    </div>
  );
};

export default AddNewBookForm;