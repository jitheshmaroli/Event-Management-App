import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import ServiceForm from "@/components/admin/ServiceForm";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { ServiceFormData } from "@/types/service";
import { Button } from "@/components/ui/Button";
import {
  fetchServiceById,
  updateService,
} from "@/features/services/servicesThunks";

export default function ServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentService, loading } = useAppSelector((state) => state.services);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id)).finally(() => {
        setHasAttemptedFetch(true);
      });
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!id || !hasAttemptedFetch) return;
    if (!loading && currentService === null) {
      navigate("/admin/services", { replace: true });
    }
  }, [id, hasAttemptedFetch, loading, currentService, navigate]);

  if (loading || !currentService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <div className="text-red-500 text-7xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Service Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The service you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/admin/services">
          <Button size="lg">Back to Services</Button>
        </Link>
      </div>
    );
  }

  const initialFormData: ServiceFormData = {
    title: currentService.title,
    category: currentService.category,
    description: currentService.description,
    pricePerDay: currentService.pricePerDay,
    location: currentService.location,
    phone: currentService.phone,
    availability: currentService.availability,
    existingImages: currentService.signedImages,
    images: [],
  };

  const handleSubmit = async (changedData: Partial<ServiceFormData>) => {
    if (!id) return;

    try {
      await dispatch(updateService({ id, data: changedData })).unwrap();
      navigate("/admin/services");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="mt-2 text-gray-600">{currentService.title}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <ServiceForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
