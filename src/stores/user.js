import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";
import router from "../router";
import { useDatabaseStore } from "./database";
import { useProductStore } from "./product";
import { colSize } from "ant-design-vue/lib/grid/Col";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
    urlPhotoDefault: "",
    urlTemp:
      "https://st4.depositphotos.com/3864435/27060/i/450/depositphotos_270605520-stock-photo-default-avatar-profile-icon-grey.jpg",
  }),
  actions: {
    async registerUser(email, password) {
      this.loadingUser = true;

      try {
        await createUserWithEmailAndPassword(auth, email, password);

        // this.userData = { email: user.email, uid: user.uid };
        await sendEmailVerification(auth.currentUser);

        console.log(auth.currentUser);
        router.push("/login");
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },
    async updateUser(displayName, emailVerified, imagen) {
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
          const err = await updateProfile(auth.currentUser, {
            displayName,
            emailVerified,
          });
        } catch (error) {
          console.log(error.message);
        }

        this.userData.displayName = displayName;
        this.userData.emailVerified = emailVerified;

        const user = auth.currentUser;

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, this.userData);

        //await setUser(user);
      } catch (error) {
        console.log(error);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },
    async setUser(user) {
      try {
        const docRef = doc(db, "users", user.uid);

        this.userData = {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: this.fotoDefault(),
          emailVerified: false,
        };

        await setDoc(docRef, this.userData);
      } catch (error) {
        console.log(error);
      }
    },

    async fotoDefault() {
      try {
        return (this.urlPhotoDefault = this.urlTemp);
      } catch (error) {
        console.log(error.code);

        return error.code;
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
        await this.setUser(user);

        console.log("el usuario login");
        console.log(user);

        await router.push("/");

        const productStore = useProductStore();
        await productStore.getProductos();
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
              // await this.setUser(user);
              this.userData = {
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
              };
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
