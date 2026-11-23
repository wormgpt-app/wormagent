import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.WORMAGENT_PASSWORD
  const previousLegacyPassword = process.env.WORMAGENT_SERVER_PASSWORD
  const previousValue = process.env.WORMAGENT_SESSION_ENV_TEST
  process.env.WORMAGENT_PASSWORD = "password"
  process.env.WORMAGENT_SERVER_PASSWORD = "legacy"
  process.env.WORMAGENT_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.WORMAGENT_PASSWORD
  else process.env.WORMAGENT_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.WORMAGENT_SERVER_PASSWORD
  else process.env.WORMAGENT_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.WORMAGENT_SESSION_ENV_TEST
  else process.env.WORMAGENT_SESSION_ENV_TEST = previousValue

  expect(environment.WORMAGENT_PASSWORD).toBeUndefined()
  expect(environment.WORMAGENT_SERVER_PASSWORD).toBeUndefined()
  expect(environment.WORMAGENT_SESSION_ENV_TEST).toBe("included")
})
