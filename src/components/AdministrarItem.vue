<template>

<li @click="actualizaEstado(uid)"  > {{uid}}  --  {{ email }}  --  {{ displayName }}  --  {{ isAdmin }}</li>

</template>

<script setup>
import {toRefs, defineProps, defineEmits} from 'vue'
import {useUserStore} from '../stores/user'

const userStore = useUserStore();

//const {cambiarAdmin} = userStore

const emit = defineEmits(["actualizaRefresca"])


const actualizaEstado = async (uid) => {

    //await cambiarAdmin(uid)

    emit ("actualizaRefresca", uid)

    console.log(uid)
    //await userStore.getAllUsers()


}


const props = defineProps({

    uid:String,
    displayName: String,
    isAdmin: Boolean,
    email: String

})

const {uid,email,isAdmin,displayName} = toRefs(props)

</script>