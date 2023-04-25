// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    addDoc,
    query,
    where,
    getDoc,
    setDoc,
    updateDoc,
    doc,
    serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';

import {
    getMessaging,
    getToken
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3EobtWgtzNrOL2Qde3nM-JCfsPdAqRGg",
    authDomain: "vikingarena-5fb20.firebaseapp.com",
    projectId: "vikingarena-5fb20",
    storageBucket: "vikingarena-5fb20.appspot.com",
    messagingSenderId: "127848345256",
    appId: "1:127848345256:web:d31f8969ea0806d04a1c9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const messaging = getMessaging(app);

let ConnectedUser = "";
let dotNetAuth;
let dotNetData;

export function SetDotNetReferenceAuth(reference) {
    dotNetAuth = reference;
}
export function SetDotNetReferenceData(reference) {
    dotNetData = reference;
}

/***************AUTH**************************/

onAuthStateChanged(auth, (user) => {
    if (user) {
        ConnectedUser = user.email;
        console.log(ConnectedUser);
    } else {
        ConnectedUser = "";
        console.log("User disconnected");
    }
    dotNetAuth.invokeMethodAsync("UpdatePlayer", ConnectedUser);
});

export function GoogleLogIn() {
    signInWithRedirect(auth, provider)
        .then((result) => {

        }).catch((error) => {
            console.log(error);
        });
}

export function CreateUserPass(email, pass) {
    createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            console.log(userCredential.user);
        })
        .catch((error) => {
            dotNetAuth.invokeMethodAsync("ShowError", error.message);
            console.log(error.message);
        });
}

export function LoginUserPass(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user);
        })
        .catch((error) => {
            console.log(error.message);
        });
}

export function SignOut() {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.log(error);
    });
}




/*****************************   FIRESTORE    *******************************/
export async function GetCharactersFromDB() {
    try {
        const querySnapshot = await getDocs(collection(db, "Characters"));
        const ToReturn = [];
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            ToReturn.push(doc.data());
        });
        return ToReturn;
    } catch (e) {
        console.error("Error retrieving Character: ", e);
    }
}

export async function GetFactionsFromDB() {
    try {
        const querySnapshot = await getDocs(collection(db, "Factions"));
        const ToReturn = [];
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            ToReturn.push(doc.data());
        });
        return ToReturn;
    } catch (e) {
        console.error("Error retrieving Factions: ", e);
    }
}

export async function GetDebtsFromDB() {
    try {
        const querySnapshot = await getDocs(collection(db, "Debts"));
        const ToReturn = [];
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            ToReturn.push(doc.data());
        });
        return ToReturn;
    } catch (e) {
        console.error("Error retrieving Debts: ", e);
    }
}


export async function GetImagesFromDB() {
    try {
        const querySnapshot = await getDocs(collection(db, "Images"));
        const ToReturn = [];
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            ToReturn.push(doc.data());
        });
        return ToReturn;
    } catch (e) {
        console.error("Error retrieving Debts: ", e);
    }
}




export async function GetRumorsFromDB() {
    try {
        const querySnapshot = await getDocs(collection(db, "Rumors"));
        let allrumors;
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            allrumors = doc.data();
        });
        return allrumors;
    } catch (e) {
        console.error("Error retrieving Rumors: ", e);
    }
}

export async function StoreChronicle(chronicle) {
    try {
        await setDoc(doc(db, "Chronicles", chronicle.name), chronicle);
        return true;
    } catch (e) {
        console.error("Error storing debt: ", e);
        return false;
    }
}

export async function CheckIfSheetExists(id) {
    
    try {
        const docRef = doc(db, "CharacterSheets", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return true;
        } else {
            console.log("Sheet with ID " + id + " does not exists");
            return false;
        }
    } catch (e) {
        console.error("Error storing debt: ", e);
        return false;
    }
}

export async function StoreCharacterSheet(sheet) {
    try {
        await setDoc(doc(db, "CharacterSheets", sheet.id), sheet);
        return true;
    } catch (e) {
        console.error("Error storing debt: ", e);
        return false;
    }
}

export async function GetCharacterSheetByID(id) {
    try {
        const col = collection(db, "CharacterSheets")
        const q = query(col, where("id", "==", id));
        const snapshot = await getDocs(q);
        return snapshot.docs[0].data();
    } catch (e) {
        console.error("Error getting CharacterSheet: ", e);
        return false;
    }
}

export async function GetChronicle(chronicle) {
    try {
        const col = collection(db, "Chronicles")
        const q = query(col, where("id", "==", chronicle));
        const snapshot = await getDocs(q);
        return snapshot.docs[0].data();
    } catch (e) {
        console.error("Error getting chronicle: ", e);
        return false;
    }
}

export async function StoreMapPlayerCharacter(map) {
    try {
        const result = await setDoc(doc(db, "Players", map.playerID), map);
        return true;
    } catch (e) {
        console.error("Error storing character: ", e);
        return false;
    }
}

export async function StoreCharacter(characterToSave) {
    try {
        const result = await setDoc(doc(db, "Characters", characterToSave.id), characterToSave);
        return true;
    } catch (e) {
        console.error("Error storing character: ", e);
        return false;
    }
}

export async function StoreFaction(FactionToSave) {
    try {
        const result = await setDoc(doc(db, "Factions", FactionToSave.id), FactionToSave);
        return true;
    } catch (e) {
        console.error("Error storing faction: ", e);
        return false;
    }
}

export async function StoreDebt(Debt) {
    try {
        const result = await setDoc(doc(db, "Debts", Debt.id), Debt);
        return true;
    } catch (e) {
        console.error("Error storing debt: ", e);
        return false;
    }
}

export async function DeleteDebt(Debt) {
    try {
        const result = await deleteDoc(doc(db, "Debts", Debt.id));
        return true;
    } catch (e) {
        console.error("Error storing debt: ", e);
        return false;
    }
}

export async function DeleteCharacter(character) {
    try {
        const result = await deleteDoc(doc(db, "Characters", character.id));
        return true;
    } catch (e) {
        console.error("Error deleting character: ", e);
        return false;
    }
}


export async function StoreRumors(Rumors) {
    try {
        const result = await setDoc(doc(db, "Rumors", "allRumors"), Rumors);
        return true;
    } catch (e) {
        console.error("Error storing all Rumors: ", e);
        return false;
    }
}

export async function StoreImageBase64(DataPack) {
    try {
        const result = await setDoc(doc(db, "Images", DataPack.id), DataPack);
        return ;
    } catch (e) {
        console.error("Error storing image: ", e);
        return {};
    }
}
export async function getImageBase64(characterID, defaultImageID) {
    try {
        const col = collection(db, "Images")
        const q = query(col, where("id", "==", characterID));
        const snapshot = await getDocs(q);
        if (snapshot.docs.length == 0)
        {
            const q2 = query(col, where("id", "==", defaultImageID));
            const snapshot2 = await getDocs(q2);
            return snapshot2.docs[0].data();
        }
        else
        {
            return snapshot.docs[0].data();
        }
    } catch (e) {
        console.error("Error getting image [" + characterID + "]: ", e);
        return "{id: '769a8851-3844-433a-9f13-549e9eff7cc2', data: 'data: image/png;base64,iVBORw0KGgoAAAANSUhEUgA…uT/2/42NQVVdjAADQwXl/JUw6lwAAAABJRU5ErkJggg=='}";
    }
}


/**************************   Firebase Messaging   ****************************************/

export function startComm() {
    getToken(messaging, { vapiKey: 'BMviWQNBnB6cCz_EABNaQZJvXxdNWH_Bmewh8glhkzKOH3Y6CxjlHXHIcx2rh8vhjVPE9P8eIC3nVOcjEE57k8A' })
        .then((currentToken) => {
            if (currentToken) {
                console.log('currentToken: '.currentToken);
            } else {
                console.log('Cannot get token');
            }
        });
}



/**************************   Firestore   ****************************************/

import {
    getStorage,
    ref,
    uploadBytes,
    listAll,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";

const storage = getStorage(app);

export function UploadImageToServer(imageData, path) {
    if (imageData == null) return;

    const imageRef = ref(storage, path);
    uploadBytes(imageRef, imageData).then(() => {
        ShowInfoBubble("image uploaded");
    });
}

/*

export function ListAllImages(path) {

    const imageListRef = ref(storage, path);
    const URLs = [];

    let list = await getList(imageListRef);
    for (const item of list) {
        const asyncResult = await(getUrl(item));
        URLs.push(asyncResult);
    }
    return URLs;
}


function getUrl(itemImage) {
    return new Promise(resolve => {
        getDownloadURL(itemImage).then((url) => {
            URLs.push(url);
            resolve();
        });
    });
}

function getList(imgRef) {
    return new Promise(resolve => {
        listAll(imageListRef)(imgRef).then((response) => {
            resolve(response.items);
        });
    });
}
*/

function ShowInfoBubble(info) {
    dotNetAuth.invokeMethodAsync("ShowInfo", info);
}






/**************************   Other stuff   ****************************************/



export function PromptUser(mensaje) {
    return prompt(mensaje, "escribe aquí");
}