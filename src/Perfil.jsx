function Perfil({ perfil, nombre, tag, parche }) {
  const urlFoto = `https://ddragon.leagueoflegends.com/cdn/${parche}/img/profileicon/${perfil.userPic}.png`;

  const getUrlRango = (tier) => {
    if (!tier || tier === "UNRANKED") return "https://opgg-static.akamaized.net/images/medals_new/unranked.png";
    return `https://opgg-static.akamaized.net/images/medals_new/${tier.toLowerCase()}.png`;
  };
  
  const urlMedalla = getUrlRango(perfil.userTier);

  const totalPartidas = perfil.userWins + perfil.userLosses;
  const winrate = totalPartidas > 0 
    ? Math.round((perfil.userWins / totalPartidas) * 100) 
    : 0;

  const colorWinrate = winrate >= 50 ? "text-green-400" : "text-red-400";
  const barraWinrate = winrate >= 50 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 relative overflow-hidden">
        
        <div className="relative mt-2 md:mt-0">
             <img src={urlFoto} alt="Perfil" className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-blue-500 shadow-md object-cover" />
             <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-600 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 shadow-lg whitespace-nowrap">
                 Lvl {perfil.userLevel}
             </span>
        </div>

        <div className="flex-1 text-center md:text-left mt-4 md:mt-0 w-full">
             <h2 className="text-3xl font-bold text-white mb-1">
                 {nombre} <span className="text-gray-500 text-lg font-normal">#{tag}</span>
             </h2>
             
             {perfil.userTier !== 'UNRANKED' ? (
                 <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-6 mt-5 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                     
                     <div className="flex items-center gap-4">
                         <img src={urlMedalla} alt={perfil.userTier} className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg" />
                         <div className="text-left">
                             <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Ranked Solo/Dúo</p>
                             <p className="text-2xl font-bold text-blue-400">{perfil.userTier} {perfil.userRank}</p>
                             <p className="text-gray-300 text-sm">{perfil.userLps} LP</p>
                         </div>
                     </div>

                     <div className="hidden md:block w-px h-16 bg-gray-700 mx-2"></div>

                     <div className="w-full md:w-auto flex flex-col items-center md:items-start">
                         <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Winrate Global</p>
                         <p className={`text-xl font-bold ${colorWinrate}`}>
                             {winrate}% <span className="text-sm text-gray-400 font-normal">({perfil.userWins}W - {perfil.userLosses}L)</span>
                         </p>
                         <div className="w-48 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden flex shadow-inner">
                             <div className={`h-full ${barraWinrate}`} style={{ width: `${winrate}%` }}></div>
                             <div className="h-full bg-red-500/80" style={{ width: `${100 - winrate}%` }}></div>
                         </div>
                     </div>

                 </div>
             ) : (
                 <div className="mt-4 inline-block bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700/50">
                     <p className="text-gray-400 font-semibold">Unranked en Solo/Dúo</p>
                 </div>
             )}
        </div>
    </div>
  );
}

export default Perfil;