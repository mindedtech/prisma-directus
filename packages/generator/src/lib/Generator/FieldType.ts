import { z } from "zod";

import type { Type as FieldType } from "@directus/types";
import type { ZodType } from "zod";

const FieldType: ZodType<FieldType> = z.enum([
  `bigInteger`,
  `boolean`,
  `date`,
  `dateTime`,
  `decimal`,
  `float`,
  `integer`,
  `json`,
  `string`,
  `text`,
  `time`,
  `timestamp`,
  `binary`,
  `uuid`,
  `alias`,
  `hash`,
  `csv`,
  `geometry`,
  `geometry.Point`,
  `geometry.LineString`,
  `geometry.Polygon`,
  `geometry.MultiPoint`,
  `geometry.MultiLineString`,
  `geometry.MultiPolygon`,
  `unknown`,
]);

export { FieldType };
