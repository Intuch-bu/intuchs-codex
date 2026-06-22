import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = ["Highlight", "Development", "Inspiration", "Warhammer40k"];

function ArticleSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1366px] px-10 py-8">
        <h2 className="text-xl font-bold">Latest articles</h2>

        <div className="mt-4 rounded-2xl bg-muted px-4 py-4 md:px-6">
          {/* Desktop: category buttons + search */}
          <div className="hidden items-center justify-between gap-4 md:flex">
            <div className="flex items-center gap-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={
                    index === 0
                      ? "rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground"
                      : "rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-background/60"
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="Search"
                className="h-11 rounded-lg border-border bg-background pr-10"
              />
              <Search className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Mobile: search + category select */}
          <div className="flex flex-col gap-4 md:hidden">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search"
                className="h-11 rounded-lg border-border bg-background pr-10"
              />
              <Search className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>
              <Select defaultValue="Highlight">
                <SelectTrigger className="h-11 w-full rounded-lg border-border bg-background">
                  <SelectValue placeholder="Highlight" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArticleSection;
