import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { TableHeader } from "../../components/ui/TableHeader";
import { FormLabel } from "../../components/form/FormLabel";
import { FormInputControl, SelectInput, FileInput } from "../../components/form/FormInput";
import { FormSubmitButton, FormCancelButton } from "../../components/form/FormAction";
import { useAuth } from "../../hooks/useAuth";
import { BannerDTO } from "./banner.contract";
import bannerService from "../../services/banner.service";
import { toast } from "sonner";
import { TbLayoutBoardSplit, TbLink } from "react-icons/tb";

export default function BannerCreatePage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      url: "",
      status: "active",
      image: null,
    },
    resolver: zodResolver(BannerDTO),
  });

  const onSubmit = async (data) => {
    try {
      await bannerService.create(data);
      toast.success("Banner created successfully!");
      navigate(`/${role}/banners`);
    } catch (err) {
      toast.error(err.message || "Failed to create banner");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Add Promotional Banner"
        showSearch={false}
        btnTxt="Back to Banners"
        btnUrl={`/${role}/banners`}
      />

      {/* Main Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
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
            <FormLabel htmlFor="image" required className="sm:w-1/4 pt-2">
              Banner Image:
            </FormLabel>
            <div className="sm:w-3/4">
              <FileInput
                name="image"
                control={control}
                errMsg={errors.image?.message}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <FormCancelButton
              label="Reset"
              disabled={isSubmitting}
              onClick={() => reset()}
            />
            <FormSubmitButton label="Create Banner" loading={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
