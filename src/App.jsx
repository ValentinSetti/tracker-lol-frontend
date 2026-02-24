import { useState, useEffect } from 'react';
import Tarjeta from './Tarjeta';
import Perfil from './Perfil';

function App() {
  const [busqueda, setBusqueda] = useState(''); 
  const [partidas, setPartidas] = useState([]);
  const [inicio, setInicio] = useState(0); 
  const [parcheActual, setParcheActual] = useState('14.4.1');
  const [perfil, setPerfil] = useState(null);
  
  const [cargando, setCargando] = useState(false);
  const [jugadorActual, setJugadorActual] = useState({ nombre: '', tag: '' });

  useEffect(() => {
    const buscarParche = async () => {
      try {
        const respuesta = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const listaParches = await respuesta.json();
        setParcheActual(listaParches[0]); 
      } catch (error) {
        console.error("No pude traer el parche", error);
      }
    };
    buscarParche();
  }, []);

  const manejarBusqueda = async () => {
    const partes = busqueda.split('#');
    if (partes.length !== 2) {
      alert('Por favor, usá el formato "Nombre #TAG"');
      return; 
    }

    const nombre = partes[0].trim();
    const tag = partes[1].trim();

    try {
      setCargando(true); 
      setInicio(0); 
      setPartidas([]); 
      setPerfil(null); 
      
      setJugadorActual({ nombre: nombre, tag: tag });

      const resPerfil = await fetch(`http://localhost:3000/api/jugador/${nombre}/${tag}`);
      const dataPerfil = await resPerfil.json();
      
      if (dataPerfil.error) {
          alert("Jugador no encontrado.");
          setCargando(false);
          return;
      }
      setPerfil(dataPerfil); 

      const resHistorial = await fetch(`http://localhost:3000/api/historial/${nombre}/${tag}?inicio=0&cantidad=10`);
      const dataHistorial = await resHistorial.json();
      
      setPartidas(dataHistorial); 

    } catch(error) {
      console.error("Hubo un error con el servidor:", error);
      alert("No me pude conectar al servidor.");
    } finally {
      setCargando(false);
    }
  };

  const cargarMasPartidas = async () => {
    const { nombre, tag } = jugadorActual; 
    const nuevoInicio = inicio + 10;
    
    try {
      const respuesta = await fetch(`http://localhost:3000/api/historial/${nombre}/${tag}?inicio=${nuevoInicio}&cantidad=10`);
      const datosNuevos = await respuesta.json();
      setInicio(nuevoInicio);
      setPartidas((partidasViejas) => [...partidasViejas, ...datosNuevos]);
    } catch(error) {
      console.error("Error al cargar más partidas:", error);
    }
  };

  const hayResultados = perfil || partidas.length > 0 || cargando;

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-200 min-h-screen">
      
      {!hayResultados ? (
         <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 tracking-tight">
              LoL Tracker
            </h1>
            <span className="text-sm bg-gray-800 text-gray-300 px-4 py-1 rounded-full font-mono border border-gray-700 mb-10 shadow-sm">
              Parche actual: {parcheActual}
            </span>
            
            <div className="flex w-full max-w-2xl bg-gray-800/80 p-2 rounded-2xl shadow-2xl border border-gray-700/50">
              <input 
                type="text" 
                placeholder="Ej: Faker #KR1" 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && manejarBusqueda()} 
                className="flex-1 bg-transparent text-white px-6 py-4 focus:outline-none text-xl placeholder-gray-500"
              />
              <button 
                onClick={manejarBusqueda}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg text-lg"
              >
                Buscar
              </button>
            </div>
         </div>
      ) : (

         <>
           <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800/80 p-4 rounded-2xl shadow-md border border-gray-700/50 mb-8 gap-4">
              
              <div className="flex items-center gap-3">
                  <h1 
                    className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => {setPerfil(null); setPartidas([]); setBusqueda('');}} 
                  >
                    LoL Tracker
                  </h1>
                  <span className="hidden md:inline-block text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded-md font-mono border border-gray-700">
                    {parcheActual}
                  </span>
              </div>

              <div className="flex w-full md:w-auto bg-gray-900 p-1 rounded-xl border border-gray-700">
                  <input 
                    type="text" 
                    placeholder="Buscar otro..." 
                    value={busqueda} 
                    onChange={(e) => setBusqueda(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && manejarBusqueda()}
                    className="w-full md:w-64 bg-transparent text-white px-4 py-2 focus:outline-none text-sm"
                  />
                  <button 
                    onClick={manejarBusqueda}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm"
                  >
                    🔍
                  </button>
              </div>
           </div>

           {cargando && (
               <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                   <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-blue-400 font-bold text-xl">Buscando en la Grieta...</p>
               </div>
           )}

           {!cargando && perfil && <Perfil perfil={perfil} nombre={jugadorActual.nombre} tag={jugadorActual.tag} parche={parcheActual} />}
           
           {!cargando && (
             <div id="resultados" className="flex flex-col gap-4">
                {partidas.map((partidaActual, index) => (
                  <Tarjeta key={index} partida={partidaActual} parche={parcheActual} />
                ))}
                
                {partidas.length > 0 && (
                    <button 
                        onClick={cargarMasPartidas}
                        className="w-full mt-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                    >
                        Mostrar mas <span>👇</span>
                    </button>
                )}
             </div>
           )}
         </>
      )}

    </div>
  );
}

export default App;