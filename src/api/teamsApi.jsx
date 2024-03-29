import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite"
import { db } from "../db/firebase"
import { v4 as uuidv4 } from 'uuid';

export default {
    getTeams: async () => {
        const teams = await getDocs(collection(db, 'teams'));
        const docs = [];
        teams.forEach((t) => docs.push(t.data()));
        return docs;
    },

    createTeam: async (team) => {
        team.id = uuidv4();
        await setDoc(doc(db, 'teams', team.id), team);
        const t = await getDoc(doc(db, 'teams', team.id));
        return t.data();
    },

    updateTeam: async (team) => {
        await setDoc(doc(db, 'teams', team.id), team, {
            merge: true
        });
        const t = await getDoc(doc(db, 'teams', team.id));
        return t.data();
    },

    deleteTeam: async (id) => {
        await deleteDoc(doc(db, 'teams', id));
    }
}