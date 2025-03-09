export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}
export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}
