import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { TableHeader } from "../../components/ui/TableHeader";
import { FormLabel } from "../../components/form/FormLabel";
import { FormInputControl, SelectInput, FileInput } from "../../components/form/FormInput";
import { FormTextareaControl } from "../../components/form/FormTextarea";
import { FormSubmitButton, FormCancelButton } from "../../components/form/FormAction";
import { useAuth } from "../../hooks/useAuth";
import { ProductDTO } from "./product.contract";
import productService from "../../services/product.service";
import brandService from "../../services/brand.service";
import categoryService from "../../services/category.service";
import { toast } from "sonner";
import { TbDeviceMobile, TbCash, TbTag, TbCategory, TbCheck } from "react-icons/tb";

export default function ProductCreatePage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      discount: 0,
      description: "",
      brand: "",
      category: [],
      stock: 1,
      sku: "",
      status: "active",
      images: [],
    },
    resolver: zodResolver(ProductDTO),
  });

  useEffect(() => {
    // Load categories
    categoryService
      .listAll()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.warn("Category load error:", err.message));

    // Load active brands
    brandService
      .listAll({ status: "active", limit: 100 })
      .then((res) => setBrands(res.data || []))
      .catch((err) => console.warn("Brand load error:", err.message));
  }, []);

  const toggleCategory = (catId) => {
    const updated = selectedCategories.includes(catId)
      ? selectedCategories.filter((id) => id !== catId)
      : [...selectedCategories, catId];
    setSelectedCategories(updated);
    setValue("category", updated, { shouldValidate: true });
  };

  const watchPrice = watch("price");
  const watchDiscount = watch("discount");
  const priceNum = Number(watchPrice) || 0;
  const discountNum = Number(watchDiscount) || 0;
  const afterDiscount = priceNum > 0 ? (priceNum - (priceNum * discountNum) / 100).toFixed(2) : "0.00";

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        category: selectedCategories,
      };
      await productService.create(payload);
      toast.success(`Product "${data.name}" created successfully!`);
      navigate(`/${role}/products`);
    } catch (err) {
      toast.error(err.message || "Failed to create product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Add New Mobile Product"
        showSearch={false}
        btnTxt="Back to Products"
        btnUrl={`/${role}/products`}
      />

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TbDeviceMobile className="w-5 h-5 text-indigo-600" />
            <span>1. Product Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormLabel htmlFor="name" required>
                Product Title & Model
              </FormLabel>
              <FormInputControl
                name="name"
                placeholder="e.g. Apple iPhone 16 Pro Max 256GB Natural Titanium"
                control={control}
                errMsg={errors.name?.message}
              />
            </div>

            <div>
              <FormLabel htmlFor="brand">Brand Manufacturer</FormLabel>
              <SelectInput
                name="brand"
                control={control}
                placeholder="-- Select Brand --"
                options={brands.map((b) => ({ label: b.name, value: b._id }))}
                errMsg={errors.brand?.message}
              />
            </div>

            <div>
              <FormLabel htmlFor="status" required>
                Publishing Status
              </FormLabel>
              <SelectInput
                name="status"
                control={control}
                placeholder="-- Select Status --"
                options={[
                  { label: "Published (Active)", value: "active" },
                  { label: "Un-Published (Inactive)", value: "inactive" },
                ]}
                errMsg={errors.status?.message}
              />
            </div>

            <div className="sm:col-span-2">
              <FormLabel required>Select Categories</FormLabel>
              {categories.length > 0 ? (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {categories.map((c) => {
                    const isSelected = selectedCategories.includes(c._id);
                    return (
                      <button
                        type="button"
                        key={c._id}
                        onClick={() => toggleCategory(c._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <TbCheck className="w-3.5 h-3.5" />}
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Loading categories...</p>
              )}
              {errors.category?.message && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">
                  {errors.category?.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <FormLabel htmlFor="description" required>
                Description & Specifications
              </FormLabel>
              <FormTextareaControl
                name="description"
                rows={4}
                placeholder="Detailed hardware specifications, condition, inclusions (charger, box), and warranty information..."
                control={control}
                errMsg={errors.description?.message}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TbCash className="w-5 h-5 text-indigo-600" />
            <span>2. Pricing & Stock Inventory</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="price" required>
                Base Price (Rs.)
              </FormLabel>
              <FormInputControl
                name="price"
                type="number"
                placeholder="e.g. 999"
                control={control}
                errMsg={errors.price?.message}
              />
            </div>

            <div>
              <FormLabel htmlFor="discount">Discount Percentage (%)</FormLabel>
              <FormInputControl
                name="discount"
                type="number"
                placeholder="e.g. 10"
                control={control}
                errMsg={errors.discount?.message}
              />
            </div>

            <div>
              <FormLabel>Final Price After Discount</FormLabel>
              <div className="py-2.5 px-3.5 text-sm bg-slate-100 text-slate-900 font-bold rounded-xl border border-slate-200">
                Rs. {afterDiscount}
              </div>
            </div>

            <div>
              <FormLabel htmlFor="stock">Stock Quantity</FormLabel>
              <FormInputControl
                name="stock"
                type="number"
                placeholder="e.g. 10"
                control={control}
                errMsg={errors.stock?.message}
              />
            </div>

            <div className="sm:col-span-2">
              <FormLabel htmlFor="sku">SKU / Model Number (Optional)</FormLabel>
              <FormInputControl
                name="sku"
                placeholder="e.g. MOBI-IPH16PM-256-BLK"
                control={control}
                errMsg={errors.sku?.message}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Product Photos */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TbTag className="w-5 h-5 text-indigo-600" />
            <span>3. Product Photos</span>
          </h3>

          <div>
            <FormLabel htmlFor="images" required>
              Upload Device Photos (Select Multiple)
            </FormLabel>
            <FileInput
              name="images"
              control={control}
              isMultiple={true}
              errMsg={errors.images?.message}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <FormCancelButton
            label="Reset Form"
            disabled={isSubmitting}
            onClick={() => {
              reset();
              setSelectedCategories([]);
            }}
          />
          <FormSubmitButton label="Publish Product" loading={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
