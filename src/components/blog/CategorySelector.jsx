import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInput from "@/components/blog/SearchInput";

function CategorySelector({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-col gap-4 md:rounded-2xl md:bg-muted md:px-6 md:py-4 md:flex-row md:items-center md:justify-between">
      <div className="order-2 md:order-1">
        <div className="hidden items-center gap-2 md:flex">
          {categories.map((category) => {
            const isSelected = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                disabled={isSelected}
                onClick={() => onCategoryChange(category)}
                className={
                  isSelected
                    ? "rounded-lg bg-brown-300 px-5 py-3 text-base font-medium text-brown-500"
                    : "cursor-pointer rounded-lg px-5 py-3 text-base font-medium text-brown-400 hover:bg-brown-300/50"
                }
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1 md:hidden">
          <label className="text-base font-medium text-brown-400">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-12 w-full rounded-lg border-border bg-white">
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

      <div className="order-1 w-full md:order-2 md:max-w-[360px]">
        <SearchInput />
      </div>
    </div>
  );
}

export default CategorySelector;
