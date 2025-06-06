// src/components/ProductManager.tsx
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://api-fullstack-ple2.onrender.com/api";

console.log("API_BASE:", API_URL);


console.log("API_BASE:", API_URL+'/products');

console.log("Todas las variables de entorno:", import.meta.env);
console.log("API_URL:", import.meta.env.VITE_API_URL);

interface Product {
  id?: number;
  name: string;
  price: number;
  disponibily: boolean;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({ name: "", price: 0, disponibily: true });
  console.log("API:", API_URL);


useEffect(() => {
  fetch(`${API_URL}/products`)
    .then(res => res.json())
    .then(data => setProducts(data.data))
    .catch(err => console.error("Error al cargar productos", err));
}, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : name === "disponibily" ? value === "true" : value,
    }));
  };

// POST nuevo producto
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (res.ok) {
    const newProduct = await res.json();
    setProducts(prev => [...prev, newProduct]);
    setForm({ name: "", price: 0, disponibily: true });
  } else {
    console.error("Error al crear producto");
  }
};


  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Productos</h2>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          className="border p-2 w-full"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 w-full"
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          required
        />
        <select
          className="border p-2 w-full"
          name="disponibily"
          value={String(form.disponibily)}
          onChange={handleChange}
        >
          <option value="true">Disponible</option>
          <option value="false">No Disponible</option>
        </select>
        <button className="bg-blue-600 text-white p-2 rounded" type="submit">
          Agregar Producto
        </button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p.id} className="border-b py-2">
            {p.name} - ${p.price} - {p.disponibily ? "✅ Disponible" : "❌ No disponible"}
          </li>
        ))}
      </ul>
    </div>
  );
}
