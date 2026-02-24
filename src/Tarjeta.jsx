import { useState } from 'react';

function Tarjeta({ partida, parche }) {
  const [expandido, setExpandido] = useState(false);

  const esVictoria = partida.estado;
  const resultadoTexto = esVictoria ? "Victoria" : "Derrota";
  
  const colorCardBase = esVictoria 
    ? "bg-blue-900/30 border-blue-800 hover:bg-blue-900/50" 
    : "bg-red-900/30 border-red-800 hover:bg-red-900/50";
    
  const colorTextoResultado = esVictoria ? "text-blue-400" : "text-red-400";
  
  const urlFotoMiCampeon = `https://ddragon.leagueoflegends.com/cdn/${parche}/img/champion/${partida.campeon}.png`;

  const getUrlFoto = (nombreCampeon) => `https://ddragon.leagueoflegends.com/cdn/${parche}/img/champion/${nombreCampeon}.png`;
  const getUrlItem = (itemId) => `https://ddragon.leagueoflegends.com/cdn/${parche}/img/item/${itemId}.png`;

  const equipoAzul = partida.jugadoresPartida.filter(jugador => jugador.equipo === 100);
  const equipoRojo = partida.jugadoresPartida.filter(jugador => jugador.equipo === 200);

  return (
    <div className="mb-4 font-sans">
      
      <div 
        onClick={() => setExpandido(!expandido)}
        className={`border-2 p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all duration-300 ${colorCardBase} ${expandido ? 'rounded-b-none border-b-0' : ''}`}
      >
        <div className="flex gap-4 items-center">
            <img src={urlFotoMiCampeon} alt={partida.campeon} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-700 shadow-md" />
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">
                  {partida.cola} • {partida.duracion}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{partida.campeon}</h2>
              <h3 className={`text-sm md:text-base font-bold mb-1 ${colorTextoResultado}`}>{resultadoTexto}</h3>
              <p className="text-gray-400 m-0 text-sm">KDA: <b className="text-gray-200">{partida.k} / {partida.d} / {partida.a}</b></p>
            </div>
        </div>

        <div className="hidden md:flex gap-6 text-xs text-gray-400">
            <div className="flex flex-col gap-1">
               {equipoAzul.map((jugador, index) => (
                   <div key={index} className="flex items-center gap-2 w-28 hover:text-gray-200 transition-colors">
                       <img src={getUrlFoto(jugador.campeon)} alt={jugador.campeon} className="w-4 h-4 rounded" />
                       <span className="truncate">{jugador.nombre}</span>
                   </div>
               ))}
            </div>
            
            <div className="flex flex-col gap-1">
               {equipoRojo.map((jugador, index) => (
                   <div key={index} className="flex items-center gap-2 w-28 hover:text-gray-200 transition-colors">
                       <img src={getUrlFoto(jugador.campeon)} alt={jugador.campeon} className="w-4 h-4 rounded" />
                       <span className="truncate">{jugador.nombre}</span>
                   </div>
               ))}
            </div>
        </div>
      </div>

      {expandido && (
        <div className={`bg-gray-800/80 border-2 border-t-0 p-5 rounded-b-xl shadow-inner ${esVictoria ? 'border-blue-800' : 'border-red-800'}`}>
            
            <div className="flex flex-col md:flex-row gap-8">
                
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-4 border-b-2 border-blue-900/50 pb-2">
                        <h4 className="text-blue-400 font-bold m-0">Equipo Azul</h4>
                        <span className="text-gray-400 font-bold text-sm tracking-widest">
                            {partida.killsBlue} / {partida.deathsBlue} / {partida.assistsBlue}
                        </span>
                    </div>

                    {equipoAzul.map((jugador, i) => (
                        <div key={i} className="flex items-center gap-3 mb-3 bg-gray-900/30 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <img src={getUrlFoto(jugador.campeon)} alt={jugador.campeon} className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-gray-600" />
                            
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-300 font-semibold truncate w-24 md:w-auto">{jugador.nombre}</span>
                                    <span className="text-sm text-gray-400 font-bold tracking-wider">{jugador.k} / {jugador.d} / {jugador.a}</span>
                                </div>
                                
                                <div className="flex gap-1">
                                    {jugador.items.map((itemId, itemIdx) => (
                                        itemId === 0 ? (
                                            <div key={itemIdx} className="w-5 h-5 md:w-6 md:h-6 bg-gray-800 rounded border border-gray-700/50"></div>
                                        ) : (
                                            <img key={itemIdx} src={getUrlItem(itemId)} alt="item" className="w-5 h-5 md:w-6 md:h-6 rounded border border-gray-900" />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-1">
                     <div className="flex justify-between items-end mb-4 border-b-2 border-red-900/50 pb-2">
                        <h4 className="text-red-400 font-bold m-0">Equipo Rojo</h4>
                        <span className="text-gray-400 font-bold text-sm tracking-widest">
                            {partida.killsRed} / {partida.deathRed} / {partida.assistsRed}
                        </span>
                    </div>

                    {equipoRojo.map((jugador, i) => (
                        <div key={i} className="flex items-center gap-3 mb-3 bg-gray-900/30 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <img src={getUrlFoto(jugador.campeon)} alt={jugador.campeon} className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-gray-600" />
                            
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-300 font-semibold truncate w-24 md:w-auto">{jugador.nombre}</span>
                                    <span className="text-sm text-gray-400 font-bold tracking-wider">{jugador.k} / {jugador.d} / {jugador.a}</span>
                                </div>
                                
                                <div className="flex gap-1">
                                    {jugador.items.map((itemId, itemIdx) => (
                                        itemId === 0 ? (
                                            <div key={itemIdx} className="w-5 h-5 md:w-6 md:h-6 bg-gray-800 rounded border border-gray-700/50"></div>
                                        ) : (
                                            <img key={itemIdx} src={getUrlItem(itemId)} alt="item" className="w-5 h-5 md:w-6 md:h-6 rounded border border-gray-900" />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
      )}

    </div>
  );
}

export default Tarjeta;