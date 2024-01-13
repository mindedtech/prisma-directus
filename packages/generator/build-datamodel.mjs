import { writeFile } from "node:fs/promises";

import { Prisma } from "@prisma/client";

await writeFile(
  `./datamodel.local.json`,
  JSON.stringify(Prisma.dmmf, null, 2),
  { encoding: `utf-8` },
);
