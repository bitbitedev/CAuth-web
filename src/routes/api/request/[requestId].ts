import { authenticationRequestConverter } from "$lib/models/AuthenticationRequest";
import { db } from "$lib/models/Database";
import { collection, getDoc, doc } from "firebase/firestore";


export async function get({params}){
    const requestRef = await getDoc(doc(collection(db, "authentication-request"), params.requestId).withConverter(authenticationRequestConverter));
    return {
        body: requestRef.data().json()
    };
}