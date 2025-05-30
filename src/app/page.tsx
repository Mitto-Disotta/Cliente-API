"use client";
import { useState } from "react";
import apiClient from "../../lib/apiClient";

type Usuario = {
  id: number;
  usuario: string;
};

type Comentario = {
  id: number;
  comentario: string;
  usuario: string;
};

export default function Home() {
  const [tipoVista, setTipoVista] = useState<"usuarios" | "comentarios" | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [usuarioParaComentario, setUsuarioParaComentario] = useState("");

  const fetchUsuarios = async () => {
    const res = await apiClient.get("/usuarios");
    setUsuarios(res.data);
    setComentarios([]);
  };

  const fetchComentarios = async () => {
    const res = await apiClient.get("/comentarios");
    setComentarios(res.data);
    setUsuarios([]);
  };

  const agregarUsuario = async () => {
    if (!nombreUsuario.trim()) return;
    await apiClient.post("/usuarios", { usuario: nombreUsuario });
    setNombreUsuario("");
    //if (tipoVista === "usuarios") fetchUsuarios();
  };

  const agregarComentario = async () => {
    if (!usuarioParaComentario.trim() || !nuevoComentario.trim()) return;
    await apiClient.post("/comentarios", {
      usuario: usuarioParaComentario,
      comentario: nuevoComentario,
    });
    setUsuarioParaComentario("");
    setNuevoComentario("");
    //if (tipoVista === "comentarios") fetchComentarios();
  };

  const eliminarUsuario = async (id: number) => {
    await apiClient.delete(`/usuarios`, { params: { id } });
    //fetchUsuarios();
  };

  const eliminarComentario = async (id: number) => {
    await apiClient.delete(`/comentarios`, { params: { id } });
    //fetchComentarios();
  };

  const handleSeleccion = async () => {
    if (tipoVista === "usuarios") await fetchUsuarios();
    if (tipoVista === "comentarios") await fetchComentarios();
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Panel Cliente - Consumo API
        </h1>

        {/* Sección agregar usuario */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-indigo-600">Agregar Usuario</h2>
          <div className="flex gap-2">
            <input
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Nombre del usuario"
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-800"
            />
            <button
              onClick={agregarUsuario}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Agregar
            </button>
          </div>
        </section>

        {/* Sección agregar comentario */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-green-600">Agregar Comentario</h2>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={usuarioParaComentario}
              onChange={(e) => setUsuarioParaComentario(e.target.value)}
              placeholder="Usuario"
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-800"
            />
            <input
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Comentario"
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-800"
            />
            <button
              onClick={agregarComentario}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Enviar
            </button>
          </div>
        </section>

        {/* Sección selección de vista */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Visualizar datos</h2>
          <div className="flex gap-2">
            <select
              value={tipoVista || ""}
              onChange={(e) =>
                setTipoVista(e.target.value === "usuarios" ? "usuarios" : "comentarios")
              }
              className="border border-gray-300 px-4 py-2 rounded text-gray-800"
            >
              <option value="" disabled>Seleccionar tipo</option>
              <option value="usuarios">Usuarios</option>
              <option value="comentarios">Comentarios</option>
            </select>
            <button
              onClick={handleSeleccion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ver
            </button>
          </div>

          {/* Resultado */}
          {tipoVista === "usuarios" && (
            <div className="bg-indigo-50 rounded-xl p-4 mt-4">
              <h3 className="font-medium text-indigo-700 mb-2">Usuarios:</h3>
              <ul className="space-y-2">
                {usuarios.map((u) => (
                  <li
                    key={u.id}
                    className="flex justify-between items-center bg-white p-2 rounded shadow text-gray-800"
                  >
                    <span>👤 {u.usuario}</span>
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tipoVista === "comentarios" && (
            <div className="bg-green-50 rounded-xl p-4 mt-4">
              <h3 className="font-medium text-green-700 mb-2">Comentarios:</h3>
              <ul className="space-y-2">
                {comentarios.map((c) => (
                  <li
                    key={c.id}
                    className="flex justify-between items-center bg-white p-2 rounded shadow text-gray-800"
                  >
                    <span>💬 <strong>{c.usuario}</strong>: {c.comentario}</span>
                    <button
                      onClick={() => eliminarComentario(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
