import React from "react";


// Utilidades internas solo para el input (sin símbolo $)
const groupCLP = (n) => new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(Math.round(n));
const onlyDigits = (s) => String(s || "").replace(/[^0-9]/g, "");
const digitsToDecimalString = (digits) => (digits ? `${BigInt(digits).toString()}.00` : "");


const PriceInput = ({
value, // DECIMAL string ("11990.00")
onChange, // devuelve DECIMAL string
id,
name,
label = "Precio",
placeholder = "0",
disabled,
error,
}) => {
const [display, setDisplay] = React.useState("");


// Sincroniza el input visible desde el valor controlado (DECIMAL "xxxxx.00")
React.useEffect(() => {
if (!value) {
setDisplay("");
return;
}
const whole = String(value).split(".")[0] || "0";
const n = Number(whole);
setDisplay(n ? groupCLP(n) : "");
}, [value]);


const handleChange = (e) => {
const digits = onlyDigits(e.target.value);
setDisplay(digits); // mientras escribe, sin formateo
onChange(digitsToDecimalString(digits)); // notifica al padre como DECIMAL
};


const handleFocus = () => {
setDisplay((prev) => onlyDigits(prev)); // quita puntos para editar
};


const handleBlur = () => {
const digits = onlyDigits(display);
const n = Number(digits || "0");
setDisplay(n ? groupCLP(n) : ""); // vuelve a formatear
onChange(digitsToDecimalString(digits));
};


return (
<div className="flex flex-col gap-1">
{label && (
<label htmlFor={id} className="text-sm text-gray-700">
{label}
</label>
)}
<div className={`flex items-center rounded-lg border px-3 py-2 ${error ? "border-red-500" : "border-gray-300"}`}>
<span className="mr-2 select-none">$</span>
<input
id={id}
name={name}
inputMode="numeric"
className="w-full outline-none bg-transparent"
placeholder={placeholder}
value={display}
onChange={handleChange}
onFocus={handleFocus}
onBlur={handleBlur}
disabled={disabled}
/>
</div>
{error && <span className="text-xs text-red-600">{error}</span>}
</div>
);
};


export default PriceInput;