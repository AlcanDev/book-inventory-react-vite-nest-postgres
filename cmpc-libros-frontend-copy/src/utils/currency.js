export const formatCLP = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return "";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(num));
};

// Parsea un string de entrada del usuario (con puntos, $, espacios) a DECIMAL string "11990.00"
export const parseCLPToDecimalString = (raw) => {
  if (!raw) return "";
  const digits = String(raw).replace(/[^0-9]/g, "");
  if (!digits) return "";
  const intValue = BigInt(digits);
  return `${intValue.toString()}.00`;
};

// Convierte DECIMAL string ("11990.00") a entero CLP (11990) para UI
export const decimalStringToCLPInt = (decimalStr) => {
  if (!decimalStr) return 0;
  const [whole] = String(decimalStr).split(".");
  const n = Number(whole);
  return Number.isFinite(n) ? n : 0;
};
