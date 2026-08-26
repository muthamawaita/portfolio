export type PortfolioPublishingContext = {
  plan?: string | null;
  subscriptionStatus?: string | null;
};

export function isPortfolioPublishingAllowed({
  plan,
  subscriptionStatus,
}: PortfolioPublishingContext) {
  const normalizedPlan = (plan ?? "FREE").toUpperCase();
  const normalizedStatus = (subscriptionStatus ?? "INACTIVE").toUpperCase();

  if (normalizedStatus === "ACTIVE" || normalizedStatus === "TRIAL") {
    return true;
  }

  if (normalizedPlan === "FREE" && normalizedStatus === "INACTIVE") {
    return false;
  }

  return normalizedStatus === "ACTIVE";
}

export function getPortfolioPublishingMessage({
  plan,
  subscriptionStatus,
}: PortfolioPublishingContext) {
  const active = isPortfolioPublishingAllowed({ plan, subscriptionStatus });
  if (active) {
    return "Your portfolio is ready to publish.";
  }

  return "Publishing is locked until your subscription is active. Choose a plan and complete checkout to unlock your public portfolio.";
}
