import { router } from "./trpc";
import { listingsRouter } from "./routers/listings";
import { toursRouter } from "./routers/tours";

export const appRouter = router({
  listings: listingsRouter,
  tours: toursRouter,
});

export type AppRouter = typeof appRouter;
