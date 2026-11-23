export const available = true

export async function resolveBinary() {
  return process.env.WORMAGENT_PTY_BIN || "wormagent-pty"
}
