import { eventBus } from "../core/eventBus";
import { EVENTS } from "../core/events";
import { logInfo } from "../core/logger";

type ServiceName = "Blood Test" | "ECG" | "X-Ray";

const PRICES: Record<ServiceName, number> = {
  "Blood Test": 600,
  "ECG": 500,
  "X-Ray": 800
};

eventBus.on(EVENTS.BOOKING_REQUESTED, (data) => {
  logInfo(
    data.requestId,
    "PricingService",
    "PRICE_CALCULATION_STARTED",
    "Calculating base price"
  );

  const basePrice = data.services.reduce(
    (sum: number, s: ServiceName) => sum + PRICES[s],
    0
  );

  logInfo(
    data.requestId,
    "PricingService",
    "PRICE_CALCULATED",
    "Base price calculated",
    { basePrice }
  );

  eventBus.emit(EVENTS.PRICE_CALCULATED, {
    ...data,
    basePrice
  });
});
