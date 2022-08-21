import { ToadScheduler } from 'toad-scheduler';

/**
 * Locally cached scheduler
 */
let scheduler: ToadScheduler | null = null;

/**
 * Ensures the ToadScheduler exists & returns it.
 *
 * @returns - Returns the global toad scheduler
 */
export function getScheduler(): ToadScheduler {
  if (scheduler === null) {
    scheduler = new ToadScheduler();
  }
  return scheduler;
}

/**
 * Ensures clean shutdown of the scheduler on application shutdown.
 */
export function stopScheduler(): void {
  if (scheduler !== null) {
    scheduler.stop();
  }
}