/*import React, { useState, useEffect } from "react";
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

    const addParticipants = () => {
    }

    return (
        <div className="grid md:grid-cols-2 gap-10 p-6">
            <div className=" flex flex-col gap-10">
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
            <div className="">
                <label htmlFor="bulk">Add multiple participants</label>
                <input type="file" id="bulk" accept=".csv" className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="w-full flex justify-end pr-4 "> <button onClick={addParticipants} className="bg-blue-800 text-slate-50 px-4 py-2 rounded-lg">Submit</button></div>
               
            </div>
            </div>
            
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
}*/
import React, { useState, useEffect } from "react";
import api from "../api";
import * as XLSX from "xlsx";

export default function AddParticipant() {
    const [name, setName] = useState("");
    const [teamName, setTeamName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [college, setCollege] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [participants, setParticipants] = useState([]);
    const [bulkFile, setBulkFile] = useState(null);
    const [loading, setLoading] = useState(false);

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

    // ✅ Single participant registration
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
                setParticipants([...participants, response.data.user]);

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
    };

    // ✅ Bulk upload from Excel
    const addParticipants = async () => {
        if (!bulkFile) {
            alert("Please upload an Excel file.");
            return;
        }

        setLoading(true);

        const reader = new FileReader();

        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            let successCount = 0;
            let failCount = 0;

            for (const row of jsonData) {
                try {
                    // Prevent duplicate emails (frontend check)
                    const alreadyExists = participants.some(
                        (p) => p.email === row.email
                    );

                    if (alreadyExists) {
                        failCount++;
                        continue;
                    }

                    await api.post("/users/register", {
                        name: row.name,
                        teamName: row.teamName,
                        email: row.email,
                        password: row.registrationId, // 🔥 registrationId used as password
                        college: row.college
                    });

                    successCount++;
                } catch (error) {
                    console.error("Error adding:", row.email);
                    failCount++;
                }
            }

            alert(`Bulk Upload Completed ✅ 
Successfully Added: ${successCount}
Failed / Skipped: ${failCount}`);

            setBulkFile(null);
            fetchParticipants();
            setLoading(false);
        };

        reader.readAsArrayBuffer(bulkFile);
    };

    return (
        <div className="grid md:grid-cols-2 gap-10 p-6">
            <div className="flex flex-col gap-10">

                {/* Single Registration */}
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
                        className="w-full mb-3 p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Player Name"
                        required
                        className="w-full mb-3 p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full mb-3 p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full mb-3 p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="College"
                        required
                        className="w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded font-bold transition"
                    >
                        Register Participant
                    </button>
                </form>

                {/* Bulk Upload Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-bold mb-3">Add Multiple Participants</h2>

                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setBulkFile(e.target.files[0])}
                        className="w-full mb-3 p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex justify-end">
                        <button
                            onClick={addParticipants}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-800 hover:bg-blue-900"
                            }`}
                        >
                            {loading ? "Uploading..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Participants List */}
            <div className="bg-white p-6 rounded-xl shadow-lg max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    Registered Participants ({participants.length})
                </h2>

                {participants.length === 0 ? (
                    <p className="text-gray-500 italic">
                        No participants registered yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {participants.map((p) => (
                            <div
                                key={p.id}
                                className="border border-gray-100 hover:bg-gray-50 p-4 rounded-lg shadow-sm transition"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-indigo-900">
                                        {p.teamName}
                                    </h3>
                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-semibold">
                                        {p.college}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700 font-medium">
                                    {p.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {p.email}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}