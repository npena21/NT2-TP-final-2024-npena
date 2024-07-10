<template>
<div class="bg-green-200 h-54">

    <h1 class="pt-3 text-4xl text-center font-bold mb-10 underline ">Administrar Cuentas de Usuarios</h1>

    <div>
    <ul>
        <template  v-for="item of userStore.minusMe" :key="item.uid">

            <div class="text-gray-600 ml-5 mb-2">
            <AdministrarItem
            :uid="item.uid"
            :displayName="item.displayName"
            :isAdmin="item.isAdmin"
            :email="item.email"
            @actualizaRefresca="actualizarRefrescar"
            ></AdministrarItem>
        </div>
        </template>
    </ul>
    </div>

    <div class="mt-7 ml-5">
        <ImagenDefault></ImagenDefault>

    </div>

</div>
  
</template>


<script setup>
import { useUserStore } from "../stores/user";
import { onMounted } from "vue";
import AdministrarItem from "../components/AdministrarItem.vue"
import ImagenDefault from "../components/ImagenDefault.vue"


const userStore = useUserStore();
const {cambiarAdmin} = userStore

onMounted( async () => {
    await userStore.getAllUsers();
});

const actualizarRefrescar = async (uid) => {

 await cambiarAdmin(uid)
 await userStore.getAllUsers()
}



</script>