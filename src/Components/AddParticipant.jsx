import React,{useState,useEffect} from "react";

export default function AddParticipant(){

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [college,setCollege] = useState("");

    const [participants,setParticipants] = useState([]);

    useEffect(()=>{

        const stored =
        JSON.parse(localStorage.getItem("participants")) || [];

        setParticipants(stored);

    },[])


    const addParticipant = (e)=>{

        e.preventDefault();

        const newParticipant = {

            id:Date.now(),
            name,
            email,
            college

        }

        const updated =
        [...participants,newParticipant];

        setParticipants(updated);

        localStorage.setItem(
            "participants",
            JSON.stringify(updated)
        )

        setName("");
        setEmail("");
        setCollege("");

    }

    return(

        <div className="grid md:grid-cols-2 gap-10">

            <form
            onSubmit={addParticipant}
            className="bg-white p-6 rounded-xl shadow-lg">

                <h2 className="text-xl font-bold mb-4">

                    Add Participant

                </h2>

                <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Name"
                required
                className="w-full mb-3 p-3 border rounded"
                />

                <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full mb-3 p-3 border rounded"
                />

                <input
                value={college}
                onChange={(e)=>setCollege(e.target.value)}
                placeholder="College"
                required
                className="w-full mb-3 p-3 border rounded"
                />

                <button
                className="w-full bg-indigo-600 text-white p-3 rounded">

                    Add Participant

                </button>

            </form>



            <div className="bg-white p-6 rounded-xl shadow-lg">

                <h2 className="text-xl font-bold mb-4">

                    Participants

                </h2>

                {

                    participants.map(p=>(
                        <div
                        key={p.id}
                        className="border-b py-2">

                            <div>{p.name}</div>
                            <div className="text-sm text-gray-500">
                                {p.email}
                            </div>
                            <div className="text-sm">
                                {p.college}
                            </div>

                        </div>
                    ))

                }

            </div>

        </div>

    )
}