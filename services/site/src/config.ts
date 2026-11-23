/**
 * Application-wide constants and configuration
 */
export const config = {
  consoleMarketingEnabled: import.meta.env.VITE_CONSOLE_MARKETING_ENABLED === "true",

  // Base URL
  baseUrl: "https://wormagent.net",

  // GitHub
  github: {
    repoUrl: "https://github.com/wormgpt-app/wormagent",
    starsFormatted: {
      compact: "220K",
      full: "220,000",
    },
  },

  // Social links
  social: {
    twitter: "https://x.com/wormagent",
    discord: "https://discord.gg/wormagent",
  },

  // Static stats (used on landing page)
  stats: {
    contributors: "1,000+",
    contributorsCompact: "1K+",
    commits: "20,000",
    monthlyUsers: "22M",
  },
} as const
