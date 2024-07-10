<template>


<div>
    <li class="flex "> 

        <div  @click="actualizaEstado(uid)" 
            class="bg-veggiesgreen w-62 cursor-pointer hover:bg-ecogreen py-2 px-2 items-center border-l-8 rounded-xl flex mr-2"
            >

            <span :class="`text-xl font-bold text-green-100 mr-4 h-8 w-18 ${isAdmin?'bg-green-600':'bg-green-100'} flex items-center justify-center rounded-lg p-3 `">Admin</span>
            
            <p class="text-gray-600 font-bold bg-green-300 rounded-xl p-2 ">{{uid}} </p>

            <p class="bg-green-400 rounded-xl ml-1 pl-2 font-bold text-xl text-dark-gray-blue">{{ email }}
            <span class="ml-1 pl-2 pr-2 bg-green-500 border-radius-2 rounded-xl text-dark-gray-blue/70">{{ displayName }}</span>
            </p>   

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