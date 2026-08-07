import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import MemberPageLayout from "@/components/member/MemberPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/useAuth";
import { useAdmin } from "@/context/useAdmin";

function CategoryManagementPage() {
  const { isLoggedIn } = useAuth();
  const { categories, articles, addCategory, updateCategory, deleteCategory } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const articleCounts = useMemo(() => {
    const counts = {};
    articles.forEach((art) => {
      counts[art.category] = (counts[art.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setCategoryNameInput("");
    setInputError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setCategoryNameInput(cat);
    setInputError("");
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const trimmed = categoryNameInput.trim();
    if (!trimmed) {
      setInputError("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory, trimmed);
        toast.success("Category updated", {
          description: `Renamed "${editingCategory}" to "${trimmed}".`,
        });
      } else {
        await addCategory(trimmed);
        toast.success("Category created", {
          description: `Category "${trimmed}" has been created.`,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      setInputError(err.message || "Failed to save category");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    const target = categoryToDelete;
    setCategoryToDelete(null);
    try {
      await deleteCategory(target);
      toast.success("Category deleted", {
        description: `Category "${target}" has been deleted.`,
      });
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  const actionButton = (
    <Button
      type="button"
      className="h-11 rounded-full bg-brown-600 px-6 text-sm font-medium text-white hover:bg-brown-600/90"
      onClick={handleOpenCreateModal}
    >
      <Plus className="mr-2 size-4" />
      Create category
    </Button>
  );

  return (
    <MemberPageLayout title="Category management" action={actionButton}>
      <div className="flex flex-col gap-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-9 rounded-lg border-border bg-white"
          />
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-brown-400 uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Total Articles</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-brown-600">{cat}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {articleCounts[cat] || 0} articles
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-brown-400 hover:text-brown-600"
                          onClick={() => handleOpenEditModal(cat)}
                          aria-label="Edit category"
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive/80 hover:text-destructive"
                          onClick={() => setCategoryToDelete(cat)}
                          aria-label="Delete category"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Category Modal */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="max-w-md">
          <form onSubmit={handleSaveCategory}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {editingCategory ? "Edit Category" : "Create Category"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {editingCategory
                  ? "Update the category name below."
                  : "Enter a name for the new category."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 flex flex-col gap-2">
              <label htmlFor="catNameInput" className="text-sm font-medium text-brown-600">
                Category Name
              </label>
              <Input
                id="catNameInput"
                placeholder="e.g. Technology"
                value={categoryNameInput}
                onChange={(e) => {
                  setCategoryNameInput(e.target.value);
                  setInputError("");
                }}
                className={`h-11 rounded-lg border-border ${inputError ? "border-destructive" : ""}`}
                autoFocus
              />
              {inputError && <p className="text-xs text-destructive">{inputError}</p>}
            </div>
            <AlertDialogFooter className="mt-4 flex-row gap-3 justify-end">
              <AlertDialogCancel
                type="button"
                className="static rounded-full border border-border px-5 py-2 text-sm font-medium"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                className="rounded-full bg-brown-600 px-6 py-2 text-sm font-medium text-white hover:bg-brown-600/90"
              >
                Save
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent className="max-w-sm text-center">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{categoryToDelete}&quot;? Articles under this category may need reassigning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-row gap-3 sm:justify-center">
            <AlertDialogCancel className="static flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="h-auto flex-1 rounded-full px-4 py-2.5"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MemberPageLayout>
  );
}

export default CategoryManagementPage;
