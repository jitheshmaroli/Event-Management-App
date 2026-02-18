import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { createService } from "@/features/services/servicesThunks";
import ServiceForm from "@/components/admin/ServiceForm";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { ServiceFormData } from "@/types/service";

export default function ServiceCreate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.services);

  const handleSubmit = async (data: ServiceFormData) => {
    try {
      await dispatch(createService(data)).unwrap();
      navigate("/admin/services");
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Service</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details to create a new service listing
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <ServiceForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}
