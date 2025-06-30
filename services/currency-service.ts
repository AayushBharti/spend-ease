import { CURRENCY_CONFIG } from "@/config/currency-exchange-api";
import { CurrencyApiResponse, CurrencyType } from "@/types";

const currencyMap = {
  VND: "Vietnamese Dong",
  USD: "United States Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  KRW: "South Korean Won",
  CNY: "Chinese Yuan",
  SGD: "Singapore Dollar",
  THB: "Thai Baht",
  AUD: "Australian Dollar",
  HKD: "Hong Kong Dollar",
  INR: "Indian Rupee",
  IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit",
  PHP: "Philippine Peso",
  RUB: "Russian Ruble",
  SAR: "Saudi Riyal",
  SEK: "Swedish Krona",
};

export const transformCurrencyData = (
  response: CurrencyApiResponse
): CurrencyType[] => {
  const { data } = response;
  return Object.entries(data).map(([key, currency]) => ({
    code: currency.code,
    value: currency.value,
    name: currencyMap[key as keyof typeof currencyMap],
  }));
};

export const fetchCurrencies = async (
  base_currency: string
): Promise<CurrencyType[]> => {
  try {
    const response = base_currency
      ? await fetch(
          `${CURRENCY_CONFIG.API_URL}apikey=${CURRENCY_CONFIG.API_KEY}&currencies=${CURRENCY_CONFIG.currencies}&base_currency=${base_currency}`
        )
      : await fetch(
          `${CURRENCY_CONFIG.API_URL}apikey=${CURRENCY_CONFIG.API_KEY}&currencies=${CURRENCY_CONFIG.currencies}`
        );
    const data: CurrencyApiResponse = await response.json();
    return transformCurrencyData(data);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw error;
  }
};
