import api from "./api";

// Get all invoices
export const getInvoices = async (params?: any) => {
  const response = await api.get("/billing/invoices", { params });
  return response.data;
};

// Get invoice by id
export const getInvoice = async (id: string) => {
  const response = await api.get(`/billing/invoices/${id}`);
  return response.data;
};

// Create invoice
export const createInvoice = async (data: any) => {
  const response = await api.post("/billing/invoices", data);
  return response.data;
};

// Manual payment
export const recordManualPayment = async (
  id: string,
  data: any
) => {
  const response = await api.post(
    `/billing/invoices/${id}/manual-payment`,
    data
  );

  return response.data;
};

// Insurance update
export const updateInsurance = async (
  id: string,
  data: any
) => {
  const response = await api.put(
    `/billing/invoices/${id}/insurance`,
    data
  );

  return response.data;
};

// Razorpay
export const createRazorpayOrder = async (id: string) => {
  const response = await api.post(
    `/billing/invoices/${id}/razorpay-order`,
    {}
  );

  return response.data;
};

// Verify payment
export const verifyPayment = async (
  id: string,
  data: any
) => {
  const response = await api.post(
    `/billing/invoices/${id}/verify-payment`,
    data
  );

  return response.data;
};