import { wormgptProducts } from "~/component/site/links"

/** WormGPT's other apps' English copy, by app. */
export const appsSource = Object.fromEntries(
  wormgptProducts.map((app) => [app.id, { category: app.category, body: app.body }]),
) as Record<(typeof wormgptProducts)[number]["id"], { category: string; body: string }>
