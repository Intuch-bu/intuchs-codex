import { useState, useMemo } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
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

function ArticleManagementPage() {
  const { isLoggedIn } = useAuth();
  const { articles, categories, deleteArticle, isLoading } = useAdmin();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [articleToDelete, setArticleToDelete] = useState(null);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (art.description && art.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const isPub = art.status === "published" || Number(art.status_id) === 1;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && isPub) ||
        (statusFilter === "draft" && !isPub);

      const matchesCategory =
        categoryFilter === "all" || art.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, searchTerm, statusFilter, categoryFilter]);

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    const target = articleToDelete;
    setArticleToDelete(null);
    await deleteArticle(target.id);
    toast.success("Article deleted", {
      description: `"${target.title}" has been deleted.`,
    });
  };

  const actionButton = (
    <Button
      asChild
      className="h-11 rounded-full bg-brown-600 px-6 text-sm font-medium text-white hover:bg-brown-600/90"
    >
      <Link to="/admin/articles/create">
        <Plus className="mr-2 size-4" />
        Create article
      </Link>
    </Button>
  );

  return (
    <MemberPageLayout title="Article management" action={actionButton}>
      <div className="flex flex-col gap-6">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-9 rounded-lg border-border bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="statusFilter" className="text-sm font-medium text-brown-400">
                Status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="h-10 rounded-lg border border-border bg-white px-3 text-sm text-brown-600 outline-none"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="categoryFilter" className="text-sm font-medium text-brown-400">
                Category:
              </label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
                className="h-10 rounded-lg border border-border bg-white px-3 text-sm text-brown-600 outline-none"
              >
                <option value="all">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-brown-400 uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Loading articles...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No articles found.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => {
                  const isPublished = art.status === "published" || Number(art.status_id) === 1;
                  const itemImage = art.image || art.thumbnail;
                  const dateFormatted = new Date(art.date || art.createdAt || Date.now()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={art.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt=""
                              className="size-10 rounded-md object-cover shrink-0"
                            />
                          ) : (
                            <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0 text-xs text-muted-foreground">
                              No Pic
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-brown-600 truncate max-w-xs sm:max-w-md">
                              {art.title}
                            </p>
                            {art.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-md">
                                {art.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-brown-600">{art.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{dateFormatted}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-brown-400 hover:text-brown-600"
                            onClick={() => navigate(`/admin/articles/edit/${art.id}`)}
                            aria-label="Edit article"
                          >
                            <Edit3 className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive/80 hover:text-destructive"
                            onClick={() => setArticleToDelete(art)}
                            aria-label="Delete article"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <AlertDialogContent className="max-w-sm text-center">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{articleToDelete?.title}&quot;? This action cannot be undone.
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

export default ArticleManagementPage;
