import "../services/pricing.service";
import "../services/discount.service";
import "../services/payment.service";
import "../services/booking.service";

import inquirer from "inquirer";
import { eventBus } from "../core/eventBus";
import { EVENTS } from "../core/events";

async function start() {
  const input = await inquirer.prompt([
    { name: "name", message: "Name:" },
    { name: "gender", message: "Gender (M/F):" },
    { name: "dob", message: "DOB (YYYY-MM-DD):" },
    {
      name: "services",
      type: "checkbox",
      choices: ["Blood Test", "ECG", "X-Ray"],
      validate: (v) => v.length > 0 || "Select at least one service"
    }
  ]);

  console.log("\n⏳ Processing...\n");

  eventBus.emit(EVENTS.BOOKING_REQUESTED, input);
}

start();
