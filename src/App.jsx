import { useState } from "react";
import { Star } from "lucide-react";
import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";
import banco1 from "./assets/bancolombia.png";
import banco2 from "./assets/davivienda.png";
import banco3 from "./assets/popular.png";
import efectyLogo from "./assets/efecty.png";
import pseLogo from "./assets/pse.png";

const product = {
  title: "Converse Chuck Taylor Clásicos Bota Estándar",
  price: "$151.137",
  originalPrice: "$239.900",
  discount: "37% OFF",
  installments: "12 cuotas de $12.595 con 0% interés",
  color: "Negro",
  images: [img1, img2, img3],
  description:
    "Zapatillas clásicas Converse, resistentes, cómodas y perfectas para cualquier ocasión.",
  seller: {
    name: "Converse Oficial",
    rating: 5.0,
    reviews: 6,
    sales: 25,
  },
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Columna izquierda */}
      <div className="flex gap-6">
        <div className="flex flex-col gap-3">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Vista ${idx + 1}`}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 object-cover cursor-pointer border-2 rounded-md ${
                selectedImage === img ? "border-blue-600" : "border-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex-1">
          <img
            src={selectedImage}
            alt="Producto"
            className="w-full max-h-[500px] object-contain rounded-md shadow"
          />
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight mb-1">
            {product.title}
          </h1>

          <div className="flex gap-2 mb-2">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              MÁS VENDIDO
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              Nuevo | +{product.seller.sales} vendidos
            </span>
          </div>

          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-blue-500 fill-blue-400" />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.seller.rating} ({product.seller.reviews} opiniones)
            </span>
          </div>

          <div className="mb-2">
            <p className="text-sm line-through text-gray-500">
              {product.originalPrice}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {product.price}{" "}
              <span className="text-lg font-semibold text-green-500">
                {product.discount}
              </span>
            </p>
            <p className="text-sm text-blue-600 mt-1">{product.installments}</p>
            <p
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={() => setShowModal(true)}
            >
              Ver medios de pago
            </p>
          </div>

          <div className="mb-2 text-sm text-gray-700 leading-relaxed">
            <p>
              Envío <span className="text-green-600 font-medium">gratis</span> a
              todo el país
            </p>
            <p>
              Devolución{" "}
              <span className="text-green-600 font-medium">gratis</span> por 30
              días
            </p>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-700">
              Color: <strong>{product.color}</strong>
            </p>
            <div className="flex gap-2 mt-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Color ${idx + 1}`}
                  className="w-10 h-10 object-cover border border-gray-300 rounded-md"
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700">
              Talla: <strong>Elige</strong>
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["36", "37", "38", "39", "40", "41"].map((size) => (
                <button
                  key={size}
                  className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="bg-blue-500 text-white py-3 text-lg rounded w-full hover:bg-blue-600">
          Comprar ahora
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-md max-w-lg w-full shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Medios de pago para este producto
            </h2>

            <p className="text-sm mb-4">
              Pagar con <strong>Mercado Pago</strong> es elegir cualquiera de estos
              medios. Es rápido, seguro y no tiene costo adicional.
            </p>

            <div className="border p-4 rounded-md bg-gray-50 mb-4">
  <p className="font-semibold mb-1 text-green-700">
    ¡Aprovecha estas promociones!
  </p>

  <div className="flex items-start gap-3">
    <img
      src={banco3}
      alt="Banco Popular"
      className="h-6 mt-1"
    />
    <div>
      <p className="text-sm font-medium">15% OFF Banco Popular</p>
      <p className="text-sm">En productos seleccionados</p>
      <p className="text-sm">Tarjeta de Crédito</p>
      <p className="text-sm">Pago mínimo: $250.000. Tope de $45.000</p>
      <p className="text-sm text-gray-600">Válido hasta el 27/06/2025</p>
      <a
        href="#"
        className="text-blue-600 text-sm underline mt-1 inline-block"
      >
        Ver términos y condiciones
      </a>
    </div>
  </div>
</div>


            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Tarjetas de crédito</h3>
              <p className="text-sm text-gray-600 mb-2">
                Acreditación instantánea. Hasta 12 cuotas con 0% interés.
              </p>
              <div className="flex gap-6">
                <img src={banco1} alt="Banco 1" className="h-8" />
                <img src={banco2} alt="Banco 2" className="h-8" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Otros medios de pago</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img src={efectyLogo} alt="Efecty" className="h-6" />
                  <div>
                    <p className="text-sm font-medium">Efectivo en puntos de pago</p>
                    <p className="text-xs text-gray-600">Acreditación instantánea.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src={pseLogo} alt="PSE" className="h-6" />
                  <div>
                    <p className="text-sm font-medium">Transferencia desde tu banco</p>
                    <p className="text-xs text-gray-600">Acreditación instantánea.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
