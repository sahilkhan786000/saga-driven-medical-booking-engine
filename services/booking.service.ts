import { eventBus } from "../core/eventBus";
import { EVENTS } from "../core/events";
import { logInfo } from "../core/logger";

eventBus.on(EVENTS.PAYMENT_STARTED, (data) => {
  logInfo(
    data.requestId,
    "BookingService",
    "BOOKING_CONFIRMED",
    "Booking completed successfully"
  );

  console.log("\n✅ BOOKING CONFIRMED");
  console.log("Reference:", "BK" + Date.now());
  console.log("Final Price:", data.basePrice - data.discount);
});

eventBus.on(EVENTS.BOOKING_CANCELLED, (data) => {
  logInfo(
    data.requestId,
    "BookingService",
    "BOOKING_CANCELLED",
    "Booking cancelled",
    { reason: data.reason }
  );

  console.log("\n❌ BOOKING FAILED");
  console.log("Reason:", data.reason);
});
