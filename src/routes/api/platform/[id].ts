import { db } from "$lib/models/Database";
import { platformConverter } from "$lib/models/Platform";
import { collection, getDoc, doc } from "firebase/firestore";


export async function get({params}){
    const platformRef = await getDoc(doc(collection(db, "platform"), params.id).withConverter(platformConverter));
    return {
        body: platformRef.data().json()
    };
}