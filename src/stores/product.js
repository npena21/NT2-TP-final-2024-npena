import { defineStore } from "pinia";
import { auth, db, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
} from "firebase/firestore/lite";
import { nanoid } from "nanoid";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    productos: [],
    loadingProduct: false,
    photoURL: "",
  }),
  getters: {
    totalProd: (state) => {
      return state.productos.length;
    },
  },

  actions: {
    async registerProduct(
      productName,
      productDetails,
      productStock,
      productPrice,
      imagen
    ) {
      this.loadingProduct = true;

      try {
        if (imagen) {
          const storageRef = ref(storage, `imageProductos/${nanoid(8)}`);
          await uploadBytes(storageRef, imagen.originFileObj);
          const photoURL = await getDownloadURL(storageRef);
          await updateProfile(auth.currentUser, {
            photoURL,
          });

          this.photoURL = photoURL;
        }

        const prodObjet = {
          productName,
          productDetails,
          productStock,
          productPrice,
          photoURL: this.photoURL,
        };

        const docRef = await addDoc(collection(db, "products"), prodObjet);

        this.productos.push({ id: docRef.id, ...prodObjet });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingProduct = false;
        this.photoURL = "";
      }
    },

    async updateProducto(id, prod) {
      this.loadingProduct = true;

      console.log(prod);

      try {
        const docRef = doc(db, "products", id);

        const docSpan = await getDoc(docRef);
        if (!docSpan.exists()) {
          throw new Error("no existe el producto");
        }

        await updateDoc(docRef, {
          productDetails: prod.Detalle,
          productPrice: prod.Precio,
          productStock: prod.Stock,
        });

        this.productos = this.productos.map((item) =>
          item.id === id
            ? {
                ...item,
                productDetails: prod.Detalle,
                productPrice: prod.Precio,
                productStock: prod.Stock,
              }
            : item
        );
      } catch (error) {
        console.log(error.message);
        return error.message;
      } finally {
        this.loadingProduct = false;
      }
    },

    async getProductos() {
      if (this.productos.length !== 0) {
        return;
      }
      this.loadingProduct = true;

      try {
        const q = query(collection(db, "products"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((prod) => {
          // console.log(doc.id, doc.data());
          this.productos.push({
            id: prod.id,
            ...prod.data(),
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingProduct = false;
      }
    },

    async leerDatosProd(id) {
      console.log(id);

      try {
        const docRef = doc(db, "products", id);
        const docSpan = await getDoc(docRef);

        if (!docSpan.exists()) {
          throw new Error("no existe el producto");
        }

        const prod = {
          Precio: docSpan.data().productPrice,
          Stock: docSpan.data().productStock,
          Detalle: docSpan.data().productDetails,
          NombreProd: docSpan.data().productName,
        };

        return prod;
      } catch (error) {
        console.log(error.message);
      } finally {
      }
    },

    async deleteProduct(id) {
      this.loadingProduct = true;
      try {
        const prodRef = doc(db, "products", id);

        const docSpan = await getDoc(prodRef);

        if (!docSpan.exists()) {
          throw new Error("no existe el doc");
        }

        await deleteDoc(doc(db, "products", id));
        this.productos = this.productos.filter((item) => item.id !== id);
      } catch (error) {
        console.log(error);
        return error.message;
      } finally {
        this.loadingProduct = false;
      }
    },
  },
});
