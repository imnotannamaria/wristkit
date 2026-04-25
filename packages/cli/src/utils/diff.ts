import { createTwoFilesPatch } from "diff";

export function unifiedDiff(params: {
  fromPath: string;
  toPath: string;
  fromContent: string;
  toContent: string;
}): string {
  return createTwoFilesPatch(
    params.fromPath,
    params.toPath,
    params.fromContent,
    params.toContent,
    "",
    "",
    { context: 3 },
  );
}
