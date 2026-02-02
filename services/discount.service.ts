import { eventBus } from "../core/eventBus";
import { EVENTS } from "../core/events";
import { loadQuota, saveQuota, resetIfNewDay } from "../core/quotaStore";
import { logInfo, logError } from "../core/logger";

eventBus.on(EVENTS.PRICE_CALCULATED, (data) => {
  let quota = loadQuota();
  quota = resetIfNewDay(quota);

  logInfo(
    data.requestId,
    "DiscountService",
    "DISCOUNT_CHECK_STARTED",
    "Checking discount eligibility"
  );

  const today = new Date();
  const dob = new Date(data.dob);

  const isBirthday =
    today.getDate() === dob.getDate() &&
    today.getMonth() === dob.getMonth();

  const eligible =
    (data.gender === "F" && isBirthday) ||
    data.basePrice > 1000;

  if (!eligible) {
    return eventBus.emit(EVENTS.DISCOUNT_CHECKED, {
      ...data,
      discount: 0
    });
  }

  if (quota.used >= quota.limit) {
    logError(
      data.requestId,
      "DiscountService",
      "QUOTA_EXCEEDED",
      "Daily discount quota exhausted"
    );

    return eventBus.emit(EVENTS.BOOKING_CANCELLED, {
      reason: "Daily discount quota reached"
    });
  }

  quota.used += 1;
  saveQuota(quota);

  const discount = data.basePrice * 0.12;

  logInfo(
    data.requestId,
    "DiscountService",
    "DISCOUNT_APPLIED",
    "Discount applied successfully",
    { discount }
  );

  eventBus.emit(EVENTS.DISCOUNT_CHECKED, {
    ...data,
    discount
  });
});
