import createClient from "openapi-fetch";
import type { paths } from "./schema.generated";

export const catalogApi = createClient<paths>({ baseUrl: "" });
