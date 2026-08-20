import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { TableHeader } from "../../components/ui/TableHeader";
import { FormLabel } from "../../components/form/FormLabel";
import { FormInputControl, SelectInput, FileInput } from "../../components/form/FormInput";
import { FormSubmitButton, FormCancelButton } from "../../components/form/FormAction";
import { useAuth } from "../../hooks/useAuth";
import { CategoryEditDTO } from "./category.contract";
import categoryService from "../../services/category.service";
import brandService from "../../services/brand.service";
import { toast } from "sonner";
import { TbCategory, TbCheck, TbLoader2 } from "react-icons/tb";

export default function CategoryEditPage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      status: "active",
      parent: "",
      brands: [],
      image: null,
    },
    resolver: zodResolver(CategoryEditDTO),
  });

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);

      // Load parent categories & brands in parallel
      const [catListRes, brandListRes, detailRes] = await Promise.all([
        categoryService.listAll(),
        brandService.listAll({ status: "active", limit: 100 }),
        categoryService.getDetail(id),
      ]);

      setCategories((catListRes.data || []).filter((c) => c._id !== id)); // Exclude self
      setBrands(brandListRes.data || []);

      if (detailRes.data) {
        const cat = detailRes.data;
        setValue("name", cat.name || "");
        setValue("status", cat.status || "active");
        setValue("parent", cat.parent?._id || cat.parent || "");

        const brandIds = Array.isArray(cat.brands)
          ? cat.brands.map((b) => (typeof b === "object" ? b._id : b))
          : [];
        setSelectedBrands(brandIds);
        setValue("brands", brandIds);

        const imgUrl = cat.image?.secure_url || cat.image?.url || cat.image?.thumbUrl;
        if (imgUrl) {
          setExistingImageUrl(imgUrl);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to load category details");
      navigate(`/${role}/categories`);
    } finally {
      setLoading(false);
    }
  }, [id, role, setValue, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleBrand = (brandId) => {
    const updated = selectedBrands.includes(brandId)
      ? selectedBrands.filter((bId) => bId !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(updated);
    setValue("brands", updated);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        brands: selectedBrands,
      };
      await categoryService.update(id, payload);
      toast.success(`Category "${data.name}" updated successfully!`);
      navigate(`/${role}/categories`);
    } catch (err) {
      toast.error(err.message || "Failed to update category");
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Edit Category"
        showSearch={false}
        btnTxt="Back to Categories"
        btnUrl={`/${role}/categories`}
      />

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-2xl">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <TbLoader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium">Loading category details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Category Name */}
            <div>
              <FormLabel htmlFor="name" required>
                Category Name
              </FormLabel>
              <FormInputControl
                name="name"
                placeholder="e.g. Flagship Smartphones, Budget Mobiles, Foldables..."
                control={control}
                errMsg={errors.name?.message}
                icon={<TbCategory className="w-4 h-4" />}
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

            {/* Parent Category */}
            <div>
              <FormLabel htmlFor="parent">Parent Category (Optional)</FormLabel>
              <SelectInput
                name="parent"
                control={control}
                errMsg={errors.parent?.message}
                placeholder="-- None (Root Category) --"
                options={categories.map((c) => ({
                  label: c.name,
                  value: c._id,
                }))}
              />
            </div>

            {/* Associated Brands */}
            <div>
              <FormLabel>Associated Mobile Brands (Optional)</FormLabel>
              {brands.length > 0 ? (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {brands.map((b) => {
                    const isSelected = selectedBrands.includes(b._id);
                    return (
                      <button
                        type="button"
                        key={b._id}
                        onClick={() => toggleBrand(b._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <TbCheck className="w-3.5 h-3.5" />}
                        <span>{b.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-light">No brands found.</p>
              )}
            </div>

            {/* Category Image */}
            <div>
              <FormLabel htmlFor="image">
                Category Image (Leave blank to keep existing)
              </FormLabel>
              <FileInput
                name="image"
                control={control}
                previewUrl={existingImageUrl}
                errMsg={errors.image?.message}
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <FormCancelButton
                label="Reset"
                disabled={isSubmitting}
                onClick={() => loadData()}
              />
              <FormSubmitButton label="Update Category" loading={isSubmitting} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
