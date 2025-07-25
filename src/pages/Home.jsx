import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

import { Link } from "react-router-dom";

function Home() {
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(data);
    } catch (error) {
      console.error("Error al obtener restaurantes:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#aaa",
      background: "#ffffff",
      color: "#333",
      iconColor: "#e3342f",
      backdrop: `rgba(0,0,0,0.4)`,
      customClass: {
        popup: "rounded-xl shadow-xl backdrop-blur-sm",
        confirmButton: "rounded px-4 py-2 text-white bg-red-600 hover:bg-red-700",
        cancelButton: "rounded px-4 py-2 bg-gray-300 hover:bg-gray-400",
      },
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, "restaurants", id));
        setRestaurants(prev => prev.filter(rest => rest.id !== id));
        Swal.fire({
          title: "Eliminado",
          text: "El restaurante ha sido eliminado",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#ffffff",
          iconColor: "#38c172",
          customClass: {
            popup: "rounded-xl shadow-md backdrop-blur-sm",
          },
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-primario">
        Directorio de Restaurantes
      </h2>

      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500">Cargando restaurantes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img src={rest.image} alt={rest.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-texto mb-2">{rest.name}</h3>
                <p className="text-secundario text-sm mb-1">{rest.description}</p>
                <p className="text-texto text-sm mb-3">{rest.address}</p>
                <div className="flex">
                  <Link
                    to={`/edit/${rest.id}`}
                    className="bg-primario text-white text-sm px-3 py-1 rounded hover:bg-secundario transition mr-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(rest.id)}
                    className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;