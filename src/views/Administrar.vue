<template>

    <h1>Administrar Cuentas de Usuarios</h1>

    <div>
    <ul>
        <template  v-for="item of userStore.minusMe" :key="item.uid">

            <AdministrarItem
            :uid="item.uid"
            :displayName="item.displayName"
            :isAdmin="item.isAdmin"
            :email="item.email"
            @actualizaRefresca="actualizarRefrescar"
            ></AdministrarItem>
        </template>
    </ul>
    </div>

    <div>
        <ImagenDefault></ImagenDefault>

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