import { collection, doc, type DocumentReference } from "firebase/firestore";
import { db } from "./Database";

export class Platform {
    id: string;
    name: string;
    image: string;

    constructor(id: string, name: string, image: string){
        this.id = id;
        this.name = name;
        this.image = image;
    }

    async getReference():Promise<DocumentReference<Platform>>{
        return doc(collection(db, "platform"), this.id).withConverter(platformConverter);
    }

    json() {
        return {
            id: this.id,
            name: this.name,
            image: this.image
        };
    }
}

export const platformConverter = {
    toFirestore: (platform: Platform) => {
        return {
            name: platform.name,
            image: platform.image
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return new Platform(snapshot.id, data.name, data.image);
    }
}