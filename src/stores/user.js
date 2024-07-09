import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  collection,
} from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";
import router from "../router";
import { useDatabaseStore } from "./database";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userData: null,
    usuarios: [],
    loadingUser: false,
    loadingSession: false,
    urlPhotoDefault: "",
    storagePath: "publicDefault/photo_perfil_default",

    //"https://static.vecteezy.com/system/resources/previews/011/356/466/non_2x/default-employee-avatar-profile-icon-worker-businessman-photo-vector.jpg",
  }),

  getters: {
    esAdmin: (state) => {
      return state.userData.isAdmin;
    },
    minusMe: (state) => {
      return state?.usuarios.filter((usr) => usr.uid !== state.userData.uid);
    },
  },

  actions: {
    async registerUser(email, password) {
      const databaseStore = useDatabaseStore();
      this.loadingUser = true;
      this.userData = null;
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // this.userData = { email: user.email, uid: user.uid };
        const docRef = doc(db, "users", user.uid);

        console.log("usuario q devuelve el register...");
        console.log(user);

        this.userData = {
          uid: user.uid,
          photoURL: await this.getUrlPhotoDefault(),
          displayName: email,
          isAdmin: false,
          email: user.email,
        };

        console.log(this.userData);

        await setDoc(docRef, this.userData);

        await signOut(auth);

        databaseStore.$reset();
        this.userData = null;

        router.push("/");

        //await sendEmailVerification(auth.currentUser);

        //console.log(auth.currentUser);
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },
    async updateUser(displayName, isAdmin, imagen) {
      this.loadingUser = true;
      try {
        if (imagen) {
          const storageRef = ref(storage, `perfiles/${this.userData.uid}`);
          await uploadBytes(storageRef, imagen.originFileObj);
          const photoURL = await getDownloadURL(storageRef);
          await updateProfile(auth.currentUser, {
            photoURL,
          });

          this.userData.photoURL = photoURL;
        }

        try {
          await updateProfile(auth.currentUser, {
            displayName,
            isAdmin,
          });
        } catch (error) {
          console.log(error.code);
          console.log(error.message);
        }

        this.userData.displayName = displayName;
        this.userData.isAdmin = isAdmin;

        const user = auth.currentUser;

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, this.userData);
      } catch (error) {
        console.log(error);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    async setUserData(id) {
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("no existe el Usuario");
        }

        //console.log(docSnap.data());
        //docSnap.data().name

        this.userData = {
          uid: docSnap.data().uid,
          photoURL: docSnap.data().photoURL,
          displayName: docSnap.data().displayName,
          isAdmin: docSnap.data().isAdmin,
          email: docSnap.data().email,
        };

        //await setDoc(docRef, this.userData);
      } catch (error) {
        console.log(error.code);
        console.log(error);
      }
    },

    async getAllUsers() {
      /*  if (this.usuarios.length !== 0) {
        return;
      } */

      this.usuarios = [];

      this.loadingUser = true;

      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((urs) => {
          //console.log(urs.id, urs.data());
          this.usuarios.push(urs.data());
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },

    async cambiarAdmin(id) {
      try {
        this.loadingUser = true;
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("no existe el Usuario");
        }

        //docSnap.data().name

        const user = {
          uid: docSnap.data().uid,
          photoURL: docSnap.data().photoURL,
          displayName: docSnap.data().displayName,
          isAdmin: !docSnap.data().isAdmin,
          email: docSnap.data().email,
        };

        await setDoc(docRef, user);
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },

    async getUrlPhotoDefault() {
      try {
        this.loadingUser = true;
        const storageRef = ref(storage, `${this.storagePath}`);

        //storage/object-not-found
        const photoURL = await getDownloadURL(storageRef);

        console.log(photoURL);
        return photoURL;
      } catch (error) {
        console.log(error.code);

        if (error.code === "storage/object-not-found") {
          return this.urlPhotoDefault;
        }
        console.log(error);
      } finally {
        this.loadingUser = false;
      }

      //this.userData.urlPhotoDefault = photoURL;
    },

    async fotoDefault(imagen) {
      try {
        this.loadingUser = true;

        if (imagen) {
          const storageRef = ref(storage, `${this.storagePath}`);
          await uploadBytes(storageRef, imagen.originFileObj);
          const photoURL = await getDownloadURL(storageRef);
          await updateProfile(auth.currentUser, {
            photoURL,
          });

          this.userData.urlPhotoDefault = photoURL;
        }
      } catch (error) {
        console.log(error.code);

        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    async loginUser(email, password) {
      this.loadingUser = true;
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        await this.setUserData(user.uid);
        //console.log(user.uid);

        //console.log("aca termina la carga, quedo asi userData");
        //console.log(this.userData);

        await router.push("/");
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },
    async logoutUser() {
      this.loadingUser = true;
      const databaseStore = useDatabaseStore();
      try {
        router.push("/login");

        await signOut(auth);
        databaseStore.$reset();

        this.userData = null;
      } catch (error) {
        console.log(error.code);
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(
          auth,
          async (user) => {
            if (user) {
              await this.setUserData(user.uid);
              /*  this.userData = {
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                isAdmin: user.isAdmin,
              }; */
              console.log("current user ... " + user.uid);
            } else {
              this.userData = null;
              const databaseStore = useDatabaseStore();
              databaseStore.$reset();
            }
            resolve(user);
          },
          (e) => reject(e)
        );
        unsuscribe();
      });
    },
  },
});
