import fs from "fs";
import path from "path";

const FILE_PATH = path.join(__dirname, "../data/quota.json");

type Quota = {
  date: string;
  used: number;
  limit: number;
};

export function loadQuota(): Quota {
  if (!fs.existsSync(FILE_PATH)) {
    return { date: "", used: 0, limit: 2 };
  }

  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveQuota(data: Quota) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

export function resetIfNewDay(quota: Quota) {
  const today = new Date().toDateString();

  if (quota.date !== today) {
    quota.date = today;
    quota.used = 0;
    saveQuota(quota);
  }

  return quota;
}
