export interface Link {
  id: string;
  title: string;
  url: string;
  categoryId: string | null;
  isSpecial?: boolean;
}

export interface Category {
  id: string;
  name: string;
}
