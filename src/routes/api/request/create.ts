import { collection, where, query, getDocs, addDoc, Timestamp, QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import { db } from "$lib/models/Database";

export async function post({request}){
    const data = await request.json();
    const inquirerQuery = query(collection(db, "platform"), where("name", "==", data.inquirer));
    const inquirerSnapshot = await getDocs(inquirerQuery);
    let inquirerRef: QueryDocumentSnapshot<DocumentData>;
    inquirerSnapshot.forEach((doc) => {
        if(inquirerRef == null)
            inquirerRef = doc;
    });
    const userQuery = query(collection(db, "user"), where("name", "==", data.username));
    const userSnapshot = await getDocs(userQuery);
    let userRef: QueryDocumentSnapshot<DocumentData>;
    userSnapshot.forEach((doc) => {
        if(userRef == null)
            userRef = doc;
    });
    let ref = await addDoc(collection(db, "authentication-request"), {
        'inquirerRef': inquirerRef.ref,
        'userRef': userRef.ref,
        'message': data.message,
        'status': 'pending',
        'date': Timestamp.fromDate(new Date()),
    });
    return {
        body: { 'requestId': ref.id }
    };
}