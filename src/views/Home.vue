<template>

<div class="flex flex-col">
    <div class="bg-green-100 p-3 rounded-lg shadow-lg flex justify-center">
        <img class="w-64" src="https://firebasestorage.googleapis.com/v0/b/vue-3-nt2-2024-tp.appspot.com/o/publicDefault%2Flogo_verde2.jpg?alt=media&token=52fe4745-07df-43f3-9450-002e4197063d" alt="">
    </div>

    <div class="bg-green-200 w-64 rounded-xl mt-3 ">
        <h1 class="text-2xl font-bold ml-3"> Bienvenido: {{ userStore.userData?.displayName }}</h1>

        <h1 class="text-1xl ml-3">Email: {{ userStore.userData?.email }}</h1>
    </div>

    <div class="bg-green-100 text-2xl rounded-xl mt-3 mb-3 w-24">
        <h1 style="text-align: center;">Total: {{totalProd}}</h1>
    </div>
</div>  
    
    <div class="bg-green-400 flex flex-col"> 

        <p v-if="productStore.loadingProduct"> Cargando Productos ...</p>

        <a-space class="h-100 ml-3"
            direction="vertical"
            v-if="!productStore.loadingProduct"
            
        >
            <a-card class="bg-green-200 text-gray-800 text-3xl m-5 font-bold"
                v-for="item of productStore.productos"
                :key="item.id"
                :title="item.productName"
              
            >
                <div class="flex justify-center">
                 <img :src="item.photoURL" alt="" class="w-64 rounded-s-3xl">
               </div>

                <template #extra>
                    <a-space v-if="userStore.esAdmin">
                        <a-popconfirm
                            title="¿Estás seguro que deseas eliminar?"
                            ok-text="Sí"
                            cancel-text="No"
                            @confirm="confirm(item.id)"
                            @cancel="cancel"
                        >
                            <a-button class="bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:outline-none rounded-s-full"
                                
                                :loading="productStore.loading"
                                :disabled="productStore.loading"
                                >Eliminar</a-button
                            >
                        </a-popconfirm>
                        <a-button class="rounded-r-full focus:outline-none"
                            type="primary"
                            @click="router.push(`/editar/${item.id}`)"
                            >Editar</a-button
                        >
                        <!-- <a-button @click="copiarPortapapeles(item.id)"
                            >Copiar</a-button
                        > -->
                    </a-space>
                </template>
                <p>Detalles: {{ String(item.productDetails).toLocaleUpperCase() }}</p> <br>
                <p>Stock: {{ item.productStock }}</p> <br>
                <p>Precio: ${{ item.productPrice }}</p>
            </a-card>
        </a-space>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from "../stores/user";
import {useProductStore} from "../stores/product";

import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { onBeforeMount } from "vue";

const userStore = useUserStore();
const productStore = useProductStore();
const router = useRouter();
const { totalProd } = storeToRefs(productStore)



onBeforeMount( async () => {
    await productStore.getProductos();
});





const confirm = async (id) => {
    const error = await productStore.deleteProduct(id);
    if (!error) return message.success("Se eliminó con éxito");
    return message.error(error);
};

const cancel = () => {
    message.error("no se eliminó");
};

/* const copiarPortapapeles = async (id) => {
   // console.log(id);
    //console.log(window.location.origin);

    if (!navigator.clipboard) {
        return message.error("No se pudo copiar al portapapeles");
    }

    const path = `${window.location.origin}/${id}`;
    //console.log(path);

    const err = await navigator.clipboard.writeText(path);
    // console.log(err);
    if (err) {
        message.error("No se pudo copiar al portapapeles");
    } else {
        message.success("Se copió con éxito");
    }

}; */
</script>

<style>

.div-1 {
background-color: bisque;
padding: 20pk;
width: 135px;
float: right;
}



</style>
