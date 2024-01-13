import { readFile, writeFile } from "fs/promises";

import {
  authentication,
  createDirectus,
  rest,
  schemaDiff,
} from "@directus/sdk";
import { dump, load } from "js-yaml";

const snapshot = load(
  await readFile(`./prisma/directus-snapshot.yml`, `utf-8`),
);

const client = createDirectus(`http://localhost:11055`)
  .with(authentication())
  .with(rest());

await client.login(`admin@prisma-directus.dev`, `admin@prisma-directus.dev`);

const result = await client.request(schemaDiff(snapshot));

await writeFile(`./prisma/directus-diff.local.yml`, dump(result), `utf-8`);

await client.logout().catch(() => process.exit(1));
