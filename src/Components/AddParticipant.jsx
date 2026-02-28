import React, { useState, useEffect } from "react";
import api from "../api";

export default function AddParticipant() {
    const [name, setName] = useState("");
    const [teamName, setTeamName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [college, setCollege] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [participants, setParticipants] = useState([]);

    const fetchParticipants = async () => {
        try {
            const response = await api.get("/users");
            setParticipants(response.data);
        } catch (error) {
            console.error("Error fetching participants:", error);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    const addParticipant = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await api.post("/users/register", {
                name,
                teamName,
                email,
                password,
                college
            });

            if (response.status === 201) {
                // Add the new user to local state to avoid immediate refetch
                setParticipants([...participants, response.data.user]);

                // Clear form
                setName("");
                setTeamName("");
                setEmail("");
                setPassword("");
                setCollege("");
            }
        } catch (error) {
            console.error("Error adding participant:", error);
            setErrorMsg(error.response?.data?.message || "Failed to register participant.");
        }
    }

    return (
        <div className="grid md:grid-cols-2 gap-10 p-6">
            <form onSubmit={addParticipant} className="bg-white p-6 rounded-xl shadow-lg h-fit">
                <h2 className="text-xl font-bold mb-4">Add Participant</h2>

                {errorMsg && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm font-semibold">
                        {errorMsg}
                    </div>
                )}

                <input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Team Name"
                    required
                    className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Player Name"
                    required
                    className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="College"
                    required
                    className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded font-bold transition">
                    Register Participant
                </button>
            </form>

            <div className="bg-white p-6 rounded-xl shadow-lg max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Registered Participants ({participants.length})</h2>

                {participants.length === 0 ? (
                    <p className="text-gray-500 italic">No participants registered yet.</p>
                ) : (
                    <div className="space-y-4">
                        {participants.map((p) => (
                            <div key={p.id} className="border border-gray-100 hover:bg-gray-50 p-4 rounded-lg shadow-sm transition">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-indigo-900">{p.teamName}</h3>
                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-semibold">{p.college}</span>
                                </div>
                                <div className="text-sm text-gray-700 font-medium">{p.name}</div>
                                <div className="text-sm text-gray-500">{p.email}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}