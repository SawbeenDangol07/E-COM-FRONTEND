import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { TableHeader } from "../../components/ui/TableHeader";
import { FormLabel } from "../../components/form/FormLabel";
import { FormInputControl, SelectInput, FileInput } from "../../components/form/FormInput";
import { FormSubmitButton, FormCancelButton } from "../../components/form/FormAction";
import { useAuth } from "../../hooks/useAuth";
import { BannerEditDTO } from "./banner.contract";
import bannerService from "../../services/banner.service";
import { toast } from "sonner";
import { TbLink, TbLoader2 } from "react-icons/tb";

export default function BannerEditPage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [existingImage, setExistingImage] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      url: "",
      status: "active",
      image: null,
    },
    resolver: zodResolver(BannerEditDTO),
  });

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await bannerService.getDetail(id);
      if (res.data) {
        setValue("title", res.data.title || "");
        setValue("url", res.data.url || "");
        setValue("status", res.data.status || "active");
        if (res.data.image?.url) {
          setExistingImage(res.data.image.url);
        } else if (typeof res.data.image === "string") {
          setExistingImage(res.data.image);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch banner details");
      navigate(`/${role}/banners`);
    } finally {
      setLoading(false);
    }
  }, [id, role, setValue, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (data) => {
    try {
      await bannerService.update(id, data);
      toast.success("Banner updated successfully!");
      navigate(`/${role}/banners`);
    } catch (err) {
      toast.error(err.message || "Failed to update banner");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Edit Promotional Banner"
        showSearch={false}
        btnTxt="Back to Banners"
        btnUrl={`/${role}/banners`}
      />

      {/* Main Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <TbLoader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium">Loading banner details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel htmlFor="title" required className="sm:w-1/4">
                Banner Title:
              </FormLabel>
              <div className="sm:w-3/4">
                <FormInputControl
                  name="title"
                  placeholder="e.g. Summer Mega Deals 2026"
                  control={control}
                  errMsg={errors.title?.message}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel htmlFor="url" required className="sm:w-1/4">
                Destination URL:
              </FormLabel>
              <div className="sm:w-3/4">
                <FormInputControl
                  name="url"
                  type="url"
                  placeholder="https://example.com/products/deals"
                  control={control}
                  errMsg={errors.url?.message}
                  icon={<TbLink className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel htmlFor="status" required className="sm:w-1/4">
                Status:
              </FormLabel>
              <div className="sm:w-3/4">
                <SelectInput
                  name="status"
                  control={control}
                  options={[
                    { label: "Published (Active)", value: "active" },
                    { label: "Un-Published (Inactive)", value: "inactive" },
                  ]}
                  errMsg={errors.status?.message}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <FormLabel htmlFor="image" className="sm:w-1/4 pt-2">
                Banner Image:
              </FormLabel>
              <div className="sm:w-3/4">
                <FileInput
                  name="image"
                  control={control}
                  previewUrl={existingImage}
                  errMsg={errors.image?.message}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
              <FormCancelButton
                label="Reset"
                disabled={isSubmitting}
                onClick={() => loadData()}
              />
              <FormSubmitButton label="Update Banner" loading={isSubmitting} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
