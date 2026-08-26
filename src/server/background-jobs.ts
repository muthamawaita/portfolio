export type BackgroundJobType =
  | "image_processing"
  | "email"
  | "analytics_aggregation"
  | "subscription_renewal"
  | "cleanup"
  | "report";

export type BackgroundJobStatus = "queued" | "processing" | "completed" | "failed";

export type BackgroundJob = {
  id: string;
  type: BackgroundJobType;
  payload: Record<string, unknown>;
  status: BackgroundJobStatus;
  createdAt: string;
  updatedAt: string;
  workerResult?: Record<string, unknown>;
};

const backgroundJobStore = new Map<string, BackgroundJob>();

export function enqueueBackgroundJob(input: {
  id?: string;
  type: BackgroundJobType;
  payload?: Record<string, unknown>;
  status?: BackgroundJobStatus;
}) {
  const id = input.id ?? `job_${Math.random().toString(36).slice(2, 10)}`;
  const now = new Date().toISOString();
  const job: BackgroundJob = {
    id,
    type: input.type,
    payload: input.payload ?? {},
    status: input.status ?? "queued",
    createdAt: now,
    updatedAt: now,
  };

  backgroundJobStore.set(id, job);

  return {
    ok: true,
    job,
  };
}

export function getBackgroundJobs() {
  return Array.from(backgroundJobStore.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function runBackgroundJob(jobId: string) {
  const job = backgroundJobStore.get(jobId);
  if (!job) {
    return { ok: false, error: `Background job ${jobId} not found.` };
  }

  const processingJob: BackgroundJob = {
    ...job,
    status: "processing",
    updatedAt: new Date().toISOString(),
  };
  backgroundJobStore.set(jobId, processingJob);

  const workerResult = {
    type: job.type,
    processedAt: new Date().toISOString(),
    input: job.payload,
    summary: `Background job ${job.type} completed successfully.`,
  };

  const completedJob: BackgroundJob = {
    ...processingJob,
    status: "completed",
    updatedAt: new Date().toISOString(),
    workerResult,
  };

  backgroundJobStore.set(jobId, completedJob);

  return {
    ok: true,
    jobId,
    jobStatus: completedJob.status,
    result: workerResult,
  };
}
