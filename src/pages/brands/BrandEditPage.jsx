import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { TableHeader } from "../../components/ui/TableHeader";
import { FormLabel } from "../../components/form/FormLabel";
import { FormInputControl, SelectInput, FileInput } from "../../components/form/FormInput";
import { FormSubmitButton, FormCancelButton } from "../../components/form/FormAction";
import { useAuth } from "../../hooks/useAuth";
import { BrandEditDTO } from "./brand.contract";
import brandService from "../../services/brand.service";
import { toast } from "sonner";
import { TbTag, TbLoader2 } from "react-icons/tb";

export default function BrandEditPage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [existingLogoUrl, setExistingLogoUrl] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      status: "active",
      logo: null,
    },
    resolver: zodResolver(BrandEditDTO),
  });

  const getBrandDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await brandService.getDetail(id);
      if (res.data) {
        setValue("name", res.data.name);
        setValue("status", res.data.status || "active");
        if (res.data.logo?.url) {
          setExistingLogoUrl(res.data.logo.url);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to load brand details");
      navigate(`/${role}/brands`);
    } finally {
      setLoading(false);
    }
  }, [id, role, setValue, navigate]);

  useEffect(() => {
    getBrandDetail();
  }, [getBrandDetail]);

  const onSubmit = async (data) => {
    try {
      await brandService.update(id, data);
      toast.success(`Brand "${data.name}" updated successfully!`);
      navigate(`/${role}/brands`);
    } catch (err) {
      toast.error(err.message || "Failed to update brand");
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Edit Brand"
        showSearch={false}
        btnTxt="Back to Brands"
        btnUrl={`/${role}/brands`}
      />

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-2xl">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <TbLoader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium">Loading brand details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Brand Name */}
            <div>
              <FormLabel htmlFor="name" required>
                Brand Name
              </FormLabel>
              <FormInputControl
                name="name"
                placeholder="e.g. Apple, Samsung, Google, Xiaomi..."
                control={control}
                errMsg={errors.name?.message}
                icon={<TbTag className="w-4 h-4" />}
              />
            </div>

            {/* Status */}
            <div>
              <FormLabel htmlFor="status" required>
                Status
              </FormLabel>
              <SelectInput
                name="status"
                control={control}
                errMsg={errors.status?.message}
                placeholder="-- Select Status --"
                options={[
                  { label: "Published (Active)", value: "active" },
                  { label: "Un-Published (Inactive)", value: "inactive" },
                ]}
              />
            </div>

            {/* Logo File */}
            <div>
              <FormLabel htmlFor="logo">
                Brand Logo (Leave blank to keep existing)
              </FormLabel>
              <FileInput
                name="logo"
                control={control}
                previewUrl={existingLogoUrl}
                errMsg={errors.logo?.message}
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <FormCancelButton
                label="Reset"
                disabled={isSubmitting}
                onClick={() => getBrandDetail()}
              />
              <FormSubmitButton
                label="Update Brand"
                loading={isSubmitting}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
