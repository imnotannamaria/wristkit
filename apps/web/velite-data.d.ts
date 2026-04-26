declare module "velite-data" {
  export type Doc = {
    title: string;
    description?: string;
    slug: string;
    permalink: string;
    weight: number;
    body: string;
  };

  export const docs: Doc[];
}
