import { collection, doc, DocumentReference, getDoc, type Timestamp } from 'firebase/firestore';
import { db } from './Database';
import { Platform, platformConverter } from './Platform';
import { User, userConverter } from './User';

export class AuthenticationRequest {
	id: string;
	date: Timestamp;
	inquirer: Platform;
	user: User;
	status: string;
	message: string;
	inquirerId: string;
	userId: string;

	constructor(
		id: string,
		date: Timestamp,
		inquirer: any,
		user: any,
		status: string,
		message: string
	) {
		this.id = id;
		this.date = date;
		this.status = status;
		this.message = message;
		if (inquirer instanceof Platform) {
			this.inquirer = inquirer;
		} else if (inquirer instanceof DocumentReference) {
			this.inquirerId = inquirer.id;
			getDoc(inquirer.withConverter(platformConverter)).then((doc) => {
				this.inquirer = doc.data();
			});
		}
		if (user instanceof User) {
			this.user = user;
		} else if (user instanceof DocumentReference) {
			this.userId = user.id;
			getDoc(user.withConverter(userConverter)).then((doc) => {
				this.user = doc.data();
			});
		}
	}

	async getReference(): Promise<DocumentReference<AuthenticationRequest>> {
		return doc(collection(db, 'authentication-request'), this.id).withConverter(
			authenticationRequestConverter
		);
	}

	json() {
		return {
			id: this.id,
			date: this.date.toString(),
			inquirerRef: this.inquirer?.name || '/platform/' + this.inquirerId,
			userRef: this.user?.name || '/user/' + this.userId,
			status: this.status,
			message: this.message
		};
	}
}

export const authenticationRequestConverter = {
	toFirestore: (request: AuthenticationRequest) => {
		return {
			date: request.date,
			inquirerRef: request.inquirer.name,
			userRef: request.user.name,
			status: request.status,
			message: request.message
		};
	},
	fromFirestore: (snapshot: any, options: any) => {
		const data = snapshot.data(options);
		return new AuthenticationRequest(
			snapshot.id,
			data.date,
			data.inquirerRef,
			data.userRef,
			data.status,
			data.message
		);
	}
};
