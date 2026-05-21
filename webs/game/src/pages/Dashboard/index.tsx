export default function GameLobbyPage() {
  const games = [
    {
      id: "taixiu",
      name: "Tài Xỉu",
      description: "Classic dice betting game",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
      path: "/taixiu",
    },
    {
      id: "fish",
      name: "Bắn Cá",
      description: "Realtime fish shooting game",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      path: "/fish",
    },
    {
      id: "slot",
      name: "Nổ Hũ",
      description: "Slot machine jackpot game",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
      path: "/slot",
    },
    {
      id: "crash",
      name: "Crash",
      description: "Multiplier airplane betting game",
      image:
        "https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=1200&auto=format&fit=crop",
      path: "/crash",
    },
  ];

  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-2">
                Tera Game Platform
              </div>

              <h1 className="text-5xl font-black leading-tight">
                GAME LOBBY
              </h1>
            </div>

            <button className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-black">
              Wallet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(game.path)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-white/5 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-[360px] overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider">
                    HOT
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="text-3xl font-black mb-2">
                      {game.name}
                    </div>

                    <div className="text-sm text-gray-300 mb-5">
                      {game.description}
                    </div>

                    <button className="w-full rounded-2xl bg-cyan-500 text-black font-bold py-3 hover:bg-cyan-400 transition">
                      PLAY NOW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-black text-cyan-400 mb-2">
                  1M+
                </div>
                <div className="text-gray-400">
                  Online Players
                </div>
              </div>

              <div>
                <div className="text-4xl font-black text-cyan-400 mb-2">
                  24/7
                </div>
                <div className="text-gray-400">
                  Live Gaming
                </div>
              </div>

              <div>
                <div className="text-4xl font-black text-cyan-400 mb-2">
                  100+
                </div>
                <div className="text-gray-400">
                  Events & Rewards
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
