import docsData from "../.velite/docs.json";

export type Doc = {
  title: string;
  description?: string;
  slug: string;
  body: string;
};

export const docs = docsData as Doc[];
