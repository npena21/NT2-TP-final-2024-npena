<template>


<div>
<li class="flex mb-2"> 
    <div  @click="actualizaEstado(uid)" 
    class="w-62 cursor-pointer p-2 border-l-8 rounder-lg flex mr-2 bg-green-400 rounded-lg"
>

<span :class="`text-2xl text-white mr-4 h-8 w-8 ${isAdmin?'bg-green-600':'bg-green-200'} flex items-center justify-center rounded-lg pb-2`"></span>
    
<p class="text-white text-lg bg-green-300">{{uid}} 
    <span
    class="text-lg bg-green-400 text-gray-400"
    >{{ email }} - {{ displayName }}</span></p>   

     </div>
</li>

    
</div>

</template>

<script setup>
import {toRefs, defineProps, defineEmits} from 'vue'

const emit = defineEmits(["actualizaRefresca"])

const actualizaEstado = async (uid) => {
    emit ("actualizaRefresca", uid)
}


const props = defineProps({

    uid:String,
    displayName: String,
    isAdmin: Boolean,
    email: String

})

const {uid,email,isAdmin,displayName} = toRefs(props)

</script>