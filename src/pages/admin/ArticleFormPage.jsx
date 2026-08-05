import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import MemberPageLayout from "@/components/member/MemberPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";
import { useAdmin } from "@/context/useAdmin";

function ArticleFormPage() {
  const { isLoggedIn } = useAuth();
  const { articles, categories, addArticle, updateArticle } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    category: categories[0] || "General",
    description: "",
    content: "",
    thumbnail: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && id) {
      const existing = articles.find((item) => item.id === id);
      if (existing) {
        setForm({
          title: existing.title || "",
          category: existing.category || categories[0] || "General",
          description: existing.description || "",
          content: existing.content || "",
          thumbnail: existing.thumbnail || "",
        });
      } else {
        toast.error("Article not found");
        navigate("/admin/articles");
      }
    } else if (categories.length > 0) {
      setForm((prev) => ({
        ...prev,
        category: prev.category || categories[0],
      }));
    }
  }, [id, isEditMode, articles, categories, navigate]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        thumbnail: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) {
      nextErrors.title = "Article title is required";
    }
    if (!form.category) {
      nextErrors.category = "Category is required";
    }
    if (!form.description.trim()) {
      nextErrors.description = "Short description is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (status) => {
    if (!validate()) return;

    if (isEditMode && id) {
      updateArticle(id, { ...form, status });
      toast.success(
        status === "published" ? "Article published successfully" : "Draft saved successfully",
        {
          description: `Article "${form.title}" has been updated.`,
        }
      );
    } else {
      addArticle({ ...form, status });
      toast.success(
        status === "published" ? "Article published successfully" : "Draft created successfully",
        {
          description: `Article "${form.title}" has been created as ${status}.`,
        }
      );
    }

    navigate("/admin/articles");
  };

  return (
    <MemberPageLayout
      title={isEditMode ? "Edit article" : "Create article"}
      action={
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full border-border bg-white text-brown-600 hover:bg-muted"
        >
          <Link to="/admin/articles">
            <ArrowLeft className="mr-2 size-4" />
            Back to articles
          </Link>
        </Button>
      }
    >
      <form className="flex flex-col gap-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-brown-600">
            Article Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            placeholder="Enter title..."
            value={form.title}
            onChange={handleChange("title")}
            className={`h-11 rounded-lg border-border bg-white ${
              errors.title ? "border-destructive" : ""
            }`}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-brown-600">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            id="category"
            value={form.category}
            onChange={handleChange("category")}
            className={`h-11 rounded-lg border border-border bg-white px-3 text-sm text-brown-600 outline-none ${
              errors.category ? "border-destructive" : ""
            }`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-brown-600">
            Short Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Brief overview of the article..."
            value={form.description}
            onChange={handleChange("description")}
            className={`w-full rounded-lg border border-border bg-white p-3 text-sm text-brown-600 outline-none focus:ring-2 focus:ring-ring ${
              errors.description ? "border-destructive" : ""
            }`}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-medium text-brown-600">
            Content
          </label>
          <textarea
            id="content"
            rows={8}
            placeholder="Write full article body text here..."
            value={form.content}
            onChange={handleChange("content")}
            className="w-full rounded-lg border border-border bg-white p-3 text-sm text-brown-600 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Thumbnail Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brown-600">Thumbnail Image</label>
          <div className="flex items-center gap-4">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted">
              {form.thumbnail ? (
                <img src={form.thumbnail} alt="Thumbnail preview" className="size-full object-cover" />
              ) : (
                <ImageIcon className="size-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full border-brown-600 bg-white px-5 text-sm font-medium text-brown-600 hover:bg-background"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload thumbnail
              </Button>
              {form.thumbnail && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 text-xs text-destructive hover:text-destructive"
                  onClick={() => setForm((curr) => ({ ...curr, thumbnail: "" }))}
                >
                  Remove image
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border mt-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-border px-6 text-sm font-medium text-brown-600"
            onClick={() => handleSave("draft")}
          >
            Save as draft
          </Button>

          <Button
            type="button"
            className="h-11 rounded-full bg-brown-600 px-8 text-sm font-medium text-white hover:bg-brown-600/90"
            onClick={() => handleSave("published")}
          >
            {isEditMode ? "Save changes" : "Save and publish"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-full px-6 text-sm font-medium text-muted-foreground"
            onClick={() => navigate("/admin/articles")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </MemberPageLayout>
  );
}

export default ArticleFormPage;
