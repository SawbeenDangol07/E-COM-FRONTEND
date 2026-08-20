import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { TableHeader } from "../../components/ui/TableHeader";
import { FormLabel } from "../../components/form/FormLabel";
import { FormInputControl, SelectInput, FileInput } from "../../components/form/FormInput";
import { FormSubmitButton, FormCancelButton } from "../../components/form/FormAction";
import { useAuth } from "../../hooks/useAuth";
import { BrandDTO } from "./brand.contract";
import brandService from "../../services/brand.service";
import { toast } from "sonner";
import { TbTag } from "react-icons/tb";

export default function BrandCreatePage() {
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
      name: "",
      status: "active",
      logo: null,
    },
    resolver: zodResolver(BrandDTO),
  });

  const onSubmit = async (data) => {
    try {
      await brandService.create(data);
      toast.success(`Brand "${data.name}" created successfully!`);
      navigate(`/${role}/brands`);
    } catch (err) {
      toast.error(err.message || "Failed to create brand");
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Add New Brand"
        showSearch={false}
        btnTxt="Back to Brands"
        btnUrl={`/${role}/brands`}
      />

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-2xl">
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
            <FormLabel htmlFor="logo" required>
              Brand Logo
            </FormLabel>
            <FileInput
              name="logo"
              control={control}
              errMsg={errors.logo?.message}
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <FormCancelButton
              label="Reset"
              disabled={isSubmitting}
              onClick={() => reset()}
            />
            <FormSubmitButton
              label="Save Brand"
              loading={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
