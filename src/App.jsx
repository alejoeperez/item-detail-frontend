import { useEffect, useState } from "react";
import { getProductById } from "./services/ProductService";
import axios from "axios";

function App() {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const fetchProduct = () => {
    getProductById("converse-1")
      .then((data) => {
        setProduct(data);
        const firstVariant = data.variants[0];
        setSelectedVariant(firstVariant);
        setSelectedSize(null);
        if (firstVariant.images.length > 0) {
          setMainImage(
            `${import.meta.env.VITE_API_URL}/images/` + firstVariant.images[0]
          );
        }
        return axios.get(`${import.meta.env.VITE_API_URL}/api/sellers/seller-1`);
      })
      .then((res) => {
        setSellerInfo(res.data.data);
        return axios.get(`${import.meta.env.VITE_API_URL}/api/payment-methods`);
      })
      .then((res) => {
        setPaymentMethods(res.data.data.filter(pm => pm.type === "screen"));
      })
      .catch((error) => {
        console.error("Error al cargar el producto o vendedor", error);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product || !selectedVariant)
    return <p className="p-6">Cargando producto...</p>;

  const backendImageUrl = `${import.meta.env.VITE_API_URL}/images/`;
  const images = selectedVariant.images.map((img) => backendImageUrl + img);
  const availableStock =
    selectedSize && selectedVariant.sizeStock[selectedSize]
      ? selectedVariant.sizeStock[selectedSize]
      : 0;

  const handleBuyNow = () => {
    if (!selectedSize || !quantity) return;

    setLoading(true);
    setTimeout(() => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/orders`, {
          productId: product.id,
          variantId: selectedVariant.id,
          size: selectedSize,
          quantity: quantity,
        })
        .then((res) => {
          if (res.data.success) {
            setSuccessModal(true);
            fetchProduct();
          } else {
            setErrorModal(res.data.error?.message || "Ocurrió un error inesperado");
          }
        })
        .catch((err) => {
          setErrorModal(err.response?.data?.error?.message || "Error al procesar la orden");
        })
        .finally(() => setLoading(false));
    }, 1000);
  };

  return (
    <div>
      <div className="w-full h-12 bg-yellow-400"></div>

    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3 flex flex-col gap-8">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 md:overflow-y-auto">
              {images.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Vista ${idx + 1}`}
                  onClick={() => setMainImage(imgUrl)}
                  className={`w-16 h-16 object-cover border-2 cursor-pointer rounded-md ${
                    mainImage === imgUrl ? "border-blue-600" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                src={mainImage}
                alt="Producto principal"
                className="w-full object-contain rounded-md shadow max-h-[400px]"
              />
            </div>
          </div>

          {/* Características del producto */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-6">Características del producto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {product.features.map((char, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                    {char.icon}
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="font-medium">{char.label}:</span> <span className="font-normal">{char.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 border border-gray-200 rounded-md p-4">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

          {selectedVariant.discountPercentage > 0 && (
            <p className="text-sm line-through text-gray-500">
              ${selectedVariant.originalPrice.toLocaleString("es-CO")}
            </p>
          )}

          <p className="text-3xl text-black font-normal">
            ${selectedVariant.finalPrice.toLocaleString("es-CO")}
            {selectedVariant.discountPercentage > 0 && (
              <span className="text-base text-green-600 font-normal ml-2">
                {selectedVariant.discountPercentage}% OFF
              </span>
            )}
          </p>

          <p className="text-sm font-medium mt-4 mb-1">
            Color: <span className="font-semibold">{selectedVariant.color}</span>
          </p>

          <div className="flex gap-2 mb-4">
            {product.variants.map((variant, idx) => (
              <img
                key={idx}
                src={backendImageUrl + variant.images[0]}
                alt={`Color ${variant.color}`}
                onClick={() => {
                  setSelectedVariant(variant);
                  setMainImage(backendImageUrl + variant.images[0]);
                  setSelectedSize(null);
                }}
                className={`w-10 h-10 object-cover border-2 cursor-pointer rounded-md ${
                  selectedVariant.color === variant.color
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Talla:</p>
            <select
              value={selectedSize || ""}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="" disabled>
                Selecciona una talla
              </option>
              {Object.entries(selectedVariant.sizeStock).map(([size, stock]) => (
                <option key={size} value={size} disabled={stock === 0}>
                  {stock === 0 ? `${size} (Agotado)` : size}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-1">Stock disponible</p>
            <div className="flex items-center text-sm text-gray-700">
              <label htmlFor="quantity" className="mr-2">
                Cantidad:
              </label>

              <select
                id="quantity"
                value={quantity}
                disabled={!selectedSize}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={`border rounded px-2 py-1 ${
                  !selectedSize ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {!selectedSize ? (
                  <option>Selecciona una talla</option>
                ) : (
                  Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} unidad{num > 1 ? "es" : ""}
                    </option>
                  ))
                )}
              </select>

              {selectedSize && (
                <span className="ml-2 text-gray-400">
                  {availableStock <= 10
                    ? `${availableStock} disponibles`
                    : availableStock <= 20
                    ? "+10 disponibles"
                    : availableStock <= 50
                    ? "+20 disponibles"
                    : availableStock <= 100
                    ? "+50 disponibles"
                    : "+100 disponibles"}
                </span>
              )}
            </div>
          </div>

          <button
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded font-semibold"
            disabled={!selectedSize || loading}
            onClick={handleBuyNow}
          >
            Comprar ahora
          </button>

          <button
            className="mt-2 w-full bg-gray-100 text-blue-400 py-3 rounded cursor-not-allowed"
            disabled
          >
            Agregar al carrito
          </button>

          {sellerInfo && (
            <div className="mt-6 border rounded p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{sellerInfo.name}</p>
                <button className="text-blue-500 text-sm">Seguir</button>
              </div>
              <p className="text-green-600 text-sm font-medium">🥇 MercadoLíder</p>
              <p className="text-xs text-gray-600 mb-2">{sellerInfo.leaderComment}</p>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div className="bg-green-500 h-2 rounded" style={{ width: `${sellerInfo.progress}%` }}></div>
              </div>
              <div className="flex justify-around mt-2 text-xs text-gray-600">
                <span>+{sellerInfo.sales} Ventas concretadas</span>
                <span>💬 Buena atención</span>
                <span>🚚 Entrega a tiempo</span>
              </div>
              <button className="mt-3 w-full bg-blue-100 text-blue-700 py-2 rounded text-sm">
                Ir a la página del vendedor
              </button>
            </div>
          )}

          {paymentMethods.length > 0 && (
            <div className="mt-6 border rounded p-4 bg-white shadow-md">
              <h2 className="text-lg font-semibold mb-4">Medios de pago</h2>
              <div className="bg-green-600 text-white text-sm font-medium p-3 rounded mb-4">
                ¡Paga en hasta 12 cuotas con 0% interés!
              </div>
              {paymentMethods.map((method) => (
                <div key={method.id} className="mb-4">
                  <h3 className="font-semibold text-sm mb-2">{method.title}</h3>
                  <div className="flex gap-4 flex-wrap items-center">
                    {method.options.map((option, index) => (
                      <div key={index} className="w-12 h-12 flex items-center justify-center">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${option.logoUrl}`}
                          alt=""
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-sm text-blue-600 mt-4 cursor-pointer hover:underline">
                Conoce otros medios de pago
              </p>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow text-center">
            <p className="text-lg font-semibold mb-2">Realizando compra...</p>
          </div>
        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow text-center relative">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl"
              onClick={() => setSuccessModal(false)}
            >
              ×
            </button>
            <p className="text-lg font-semibold mb-2">¡Compra realizada con éxito!</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSuccessModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {errorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow text-center relative">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl"
              onClick={() => setErrorModal(null)}
            >
              ×
            </button>
            <p className="text-lg font-semibold mb-2 text-red-600">{errorModal}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setErrorModal(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
