import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite"
import { db } from "../db/firebase"

export default {
    getUsers: async () => {
        const docs = await getDocs(collection(db, 'users'));
        const result = [];
        docs.docs.forEach((d) => result.push(d.data()));
        return result;
    },

    deleteUser: async (email) => {
        await deleteDoc(doc(db, 'users', email));
    },

    getUserEmail: async (email) => {
        const d = await getDoc(doc(db, 'users', email));
        return d;
    },

    createUser: async (user) => {
        await setDoc(doc(db, 'users', user.email), user);
        const u = await getDoc(doc(db, 'users', user.email));
        return u.data();
    }
}