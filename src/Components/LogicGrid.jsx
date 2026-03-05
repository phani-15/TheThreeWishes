import React, { useState } from "react";

export default function LogicGrid() {

  const houses = [1, 2, 3, 4];

  const categories = {
    chamber: ["Crimson", "Ivory", "Sapphire", "Jade"],
    guardian: ["Desert Nomad", "Palace Scholar", "Royal Guard", "Street Magician"],
    drink: ["Oasis Water", "Mint Tea", "Pomegranate Juice", "Spiced Coffee"],
    companion: ["Desert Hawk", "White Tiger", "Silver Fox", "Golden Camel"],
  };

  const [grid, setGrid] = useState({});

  const handleSelect = (house, category, value) => {
    setGrid({
      ...grid,
      [house]: {
        ...grid[house],
        [category]: value
      }
    });
  };

  return (
    <div className="overflow-x-auto bg-white/10 p-6 rounded-2xl border border-yellow-500/30 mb-8">
      <h2 className="text-2xl text-yellow-400 font-semibold mb-4">
        Logic Grid
      </h2>

      <table className="w-full text-center border border-yellow-500">
        <thead>
          <tr>
            <th className="border border-yellow-500 p-2">Position</th>
            {Object.keys(categories).map((cat) => (
              <th key={cat} className="border border-yellow-500 p-2 capitalize">
                {cat}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {houses.map((house) => (
            <tr key={house}>
              <td className="border border-yellow-500 p-2 font-bold">
                {house}
              </td>

              {Object.keys(categories).map((cat) => (
                <td key={cat} className="border border-yellow-500 p-2">
                  <select
                    className="bg-black/50 p-2 rounded w-full"
                    onChange={(e) =>
                      handleSelect(house, cat, e.target.value)
                    }
                  >
                    <option>Select</option>
                    {categories[cat].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}