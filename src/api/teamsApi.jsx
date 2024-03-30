import { db } from "../db/firebase"
import { v4 as uuidv4 } from 'uuid';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, onSnapshot } from 'firebase/firestore';

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
    },

    getTeam: async (key) => {
        const docs = await getDocs(query(collection(db, 'teams'), where('key','==',key)));
        let result = null;
        docs.forEach((d) => {
            result = d.data();
        })
        return result;
    },

    onTeamUpdate: (id, callback) => {
        const unsub = onSnapshot(doc(db, 'teams', id), (doc) => {
            callback(doc.data());
        });
        return unsub;
    }
}