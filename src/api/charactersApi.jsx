import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { db } from "../db/firebase";
import { v4 as uuidv4 } from 'uuid';

export default {
    getCharacters: async () => {
        const characters = await getDocs(collection(db, 'characters'));
        const data = [];
        characters.forEach((p) => data.push({...p.data()}));
        return data;
    },

    createCharacter: async (character) => {
        const uid = uuidv4();
        character.id = uid;
        console.log(character);
        await setDoc(doc(db, 'characters', `${uid}`), character);
        const d = await getDoc(doc(db, 'characters', `${uid}`));
        return d.data();
    },

    deleteCharacter: async (id) => {
        await deleteDoc(doc(db, 'characters', id));
    },

    updateCharacter: async (character) => {
        await setDoc(doc(db, 'characters', character.id), character, {
            merge: true
        });
        const d = await getDoc(doc(db, 'characters', character.id));
        return d.data();
    }
};
