export const BOARD_OPTIONS = ["SSC", "CBSE"];

export const BOARD_CLASS_LABELS = {
  SSC: [
    "Nursery",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ],
  CBSE: [
    "Nursery",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ],
};

export const getClassKey = (value = "") => String(value)
  .trim()
  .toLowerCase()
  .replace(/(st|nd|rd|th)$/, "");
