<template>
    <div>
        <h2>La Montañita</h2>
        <p>{{ userStore.userData?.email }}</p>
        <p>{{ userStore.userData?.isAdmin }}</p>
        <p>{{ userStore.userData?.displayName }}</p>

        
        <div class="div-1">
           <h1 style="text-align: center;">Total: {{totalProd}}</h1>
        </div>
      
        
        <!-- <add-form></add-form> -->

        <p v-if="productStore.loadingProduct"> Cargando Productos ...</p>

        <a-space
            direction="vertical"
            v-if="!productStore.loadingProduct"
            style="width: 100%"
        >
            <a-card
                v-for="item of productStore.productos"
                :key="item.id"
                :title="item.productName"
              
            >
                <div class="text-center mb-5">
                 <a-avatar :src="item.photoURL" :size="150"></a-avatar>
                </div>

                <template #extra>
                    <a-space>
                        <a-popconfirm
                            title="¿Estás seguro que deseas eliminar?"
                            ok-text="Sí"
                            cancel-text="No"
                            @confirm="confirm(item.id)"
                            @cancel="cancel"
                        >
                            <a-button
                                danger
                                :loading="productStore.loading"
                                :disabled="productStore.loading"
                                >Eliminar</a-button
                            >
                        </a-popconfirm>
                        <a-button
                            type="primary"
                            @click="router.push(`/editar/${item.id}`)"
                            >Editar</a-button
                        >
                        <!-- <a-button @click="copiarPortapapeles(item.id)"
                            >Copiar</a-button
                        > -->
                    </a-space>
                </template>
                <p>Detalles: {{ item.productDetails }}</p>
                <p>Stock: {{ item.productStock }}</p>
                <p>Precio: {{ item.productPrice }}</p>
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
