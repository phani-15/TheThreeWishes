import React from "react";

export default function Dashboard() {

  const teams = [
    {
      rank: 1,
      team: "Giri & Bhavya",

      level1Status: "Completed",
      level2Status: "Completed",
      level3Status: "Pending",

      level1Points: 121,
      level2Solved: 4,
      level3FastestTime: "02:14",
    },
    {
      rank: 2,
      team: "Techtonic",

      level1Status: "Completed",
      level2Status: "Completed",
      level3Status: "Completed",

      level1Points: 117,
      level2Solved: 3,
      level3FastestTime: "02:45",
    },
    {
      rank: 3,
      team: "Team JK",

      level1Status: "Completed",
      level2Status: "In Progress",
      level3Status: "Locked",

      level1Points: 113,
      level2Solved: 2,
      level3FastestTime: "--",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Completed") return "text-green-400";
    if (status === "In Progress") return "text-yellow-400";
    if (status === "Pending") return "text-yellow-300";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 relative overflow-hidden">

      {/* Golden Glow Background */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-500 opacity-10 blur-3xl rounded-full top-[-200px] left-[-200px]"></div>

      {/* Title */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-cinzel tracking-widest text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.7)]">
          ROYAL COMPETITION DASHBOARD
        </h1>
        <div className="w-72 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-4"></div>
      </div>

      {/* Table */}
      <div className="relative z-10 max-w-7xl mx-auto bg-gradient-to-b from-[#111] to-[#1a1a1a] 
                      border border-yellow-600 rounded-2xl 
                      shadow-[0_0_40px_rgba(255,215,0,0.25)] 
                      backdrop-blur-md overflow-hidden">

        <table className="w-full text-center font-cinzel tracking-wide text-sm md:text-base">
          
          <thead className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
            <tr>
              <th className="py-4">Rank</th>
              <th>Team</th>

              <th>Level 1</th>
              <th>L1 Points</th>

              <th>Level 2</th>
              <th>L2 Puzzles (4)</th>

              <th>Level 3</th>
              <th>L3 Fastest Time</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => (
              <tr
                key={index}
                className="border-t border-yellow-700 hover:bg-yellow-900/20 transition duration-300"
              >
                <td className="py-4 text-yellow-400 font-bold text-lg">
                  {team.rank}
                </td>

                <td className="text-yellow-200">
                  {team.team}
                </td>

                {/* Level 1 Status */}
                <td className={getStatusColor(team.level1Status)}>
                  {team.level1Status}
                </td>

                {/* Level 1 Points */}
                <td className="text-green-400 font-semibold">
                  {team.level1Points} pts
                </td>

                {/* Level 2 Status */}
                <td className={getStatusColor(team.level2Status)}>
                  {team.level2Status}
                </td>

                {/* Level 2 Puzzles */}
                <td>
                  <span className="text-yellow-300 font-semibold">
                    {team.level2Solved}
                  </span>
                  <span className="text-gray-400"> / 4</span>
                </td>

                {/* Level 3 Status */}
                <td className={getStatusColor(team.level3Status)}>
                  {team.level3Status}
                </td>

                {/* Level 3 Time */}
                <td className="text-purple-400 font-semibold">
                  {team.level3FastestTime}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-yellow-600 opacity-10 blur-3xl rounded-full"></div>

    </div>
  );
}