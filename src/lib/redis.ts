const memoryStore = new Map<string, unknown>();
const rateLimitStore = new Map<string, number>();
const queueStore = new Map<string, Array<Record<string, unknown>>>();

export function createRedisClient() {
  return {
    set(key: string, value: unknown) {
      memoryStore.set(key, value);
      return true;
    },
    get(key: string) {
      return memoryStore.get(key);
    },
    del(key: string) {
      return memoryStore.delete(key);
    },
    exists(key: string) {
      return memoryStore.has(key);
    },
  };
}

export function getRateLimitKey(key: string) {
  return `ratelimit:${key}`;
}

export function incrementRateLimit(key: string, amount = 1) {
  const next = (rateLimitStore.get(key) ?? 0) + amount;
  rateLimitStore.set(key, next);
  return next;
}

export function queueMessage(queue: string, payload: Record<string, unknown>) {
  const queueItems = queueStore.get(queue) ?? [];
  const message = {
    id: `msg_${Math.random().toString(36).slice(2, 10)}`,
    queue,
    payload,
    queuedAt: new Date().toISOString(),
  };

  queueItems.push(message);
  queueStore.set(queue, queueItems);

  return {
    ok: true,
    queue,
    message,
  };
}

export function getQueuedMessages(queue: string) {
  return queueStore.get(queue) ?? [];
}
