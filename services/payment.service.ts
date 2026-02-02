import { eventBus } from "../core/eventBus";
import { EVENTS } from "../core/events";
import { loadQuota, saveQuota } from "../core/quotaStore";
import { logInfo, logError } from "../core/logger";

eventBus.on(EVENTS.DISCOUNT_CHECKED, (data) => {
  logInfo(
    data.requestId,
    "PaymentService",
    "PAYMENT_STARTED",
    "Processing payment"
  );

  // 🔴 Simulated payment failure
  if (data.name.toLowerCase() === "fail") {
    logError(
      data.requestId,
      "PaymentService",
      "PAYMENT_FAILED",
      "Payment failed"
    );

    // 🔁 COMPENSATION: restore quota
    if (data.discount > 0) {
      const quota = loadQuota();
      quota.used = Math.max(0, quota.used - 1);
      saveQuota(quota);

      logInfo(
        data.requestId,
        "PaymentService",
        "ROLLBACK",
        "Discount quota restored after payment failure",
        { quotaUsed: quota.used }
      );
    }

    return eventBus.emit(EVENTS.BOOKING_CANCELLED, {
      reason: "Payment failed"
    });
  }

  // ✅ Payment successful
  eventBus.emit(EVENTS.PAYMENT_STARTED, data);
});
