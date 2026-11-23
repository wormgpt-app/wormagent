export * as WormAgentWorkerd from "./workerd"

import { Layer } from "effect"
import type { Config, Scope } from "effect"
import { WorkerdProfile } from "../internal/workerd"
import { WormAgent } from "./wormagent"

export type Configuration = WorkerdProfile.Configuration

export interface CreateOptions<R = never> extends WorkerdProfile.Options {
  readonly log?: WormAgent.CreateOptions["log"]
  readonly plugins?: WormAgent.CreateOptions["plugins"]
  readonly workspaceProviders?: WormAgent.CreateOptions["workspaceProviders"]
  readonly instances?: WormAgent.CreateOptions<R>["instances"]
}

export const create = <R = never>({ log, plugins, workspaceProviders, instances, ...options }: CreateOptions<R>) => {
  const profile = WorkerdProfile.make(options)
  return WormAgent.create(
    { ...profile.options, log, plugins, workspaceProviders, instances },
    { overrides: profile.replacements },
  )
}

export const layer = <R = never>(
  options: CreateOptions<R>,
): Layer.Layer<WormAgent.Service, Config.ConfigError | Error, Exclude<R, Scope.Scope>> =>
  Layer.effect(WormAgent.Service, create(options))

export type Interface = WormAgent.Interface
export type Requirements = Scope.Scope
