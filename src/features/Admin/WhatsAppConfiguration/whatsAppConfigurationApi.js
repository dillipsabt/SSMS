import API from "../../../services/api";

export const saveWhatsAppConfiguration = (data) =>
  API.post("/whatsapp/configuration", data, { skipErrorToast: true });
