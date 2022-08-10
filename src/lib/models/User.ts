import { collection, doc, DocumentReference } from "firebase/firestore";
import { db } from "./Database";

export class User {
    id: string;
    name: string;

    constructor(id: string, name: string){
        this.id = id;
        this.name = name;
    }

    async getReference():Promise<DocumentReference<User>>{
        return doc(collection(db, "user"), this.id).withConverter(userConverter);
    }
}

export const userConverter = {
    toFirestore: (user: User) => {
        return {
            name: user.name
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return new User(snapshot.id, data.name);
    }
}