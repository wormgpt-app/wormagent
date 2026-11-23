import { HttpApiMiddleware } from "effect/http-api"
import { InvalidRequestError } from "../errors.js"

export class SchemaErrorMiddleware extends HttpApiMiddleware.Service<SchemaErrorMiddleware>()(
  "@wormagent/HttpApiSchemaError",
  { error: InvalidRequestError },
) {}
