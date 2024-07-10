<template>

<div class="bg-green-200 ">
    <h1 class="text-gray-600 text-5xl text-center mb-5">Perfil de Usuario</h1>
  
    <div class="text-center mb-5">
        <a-avatar :src="userStore.userData.photoURL" :size="200"></a-avatar>
    </div>
    <a-row >
        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
            <a-form class=""
                name="basicPerfil"
                autocomplete="off"
                layout="vertical"
                :model="userStore.userData"
                @finish="onFinish"
            >
                <a-form-item class="text-2xl"
                    name="email"
                    label="Tu correo (no modificable)"
                    
                >
                    <a-input
                        disabled
                        v-model:value="userStore.userData.email"
                    ></a-input>
                </a-form-item>

                <div v-if="userStore.esAdmin">
                    <a-divider />
                    <a-checkbox
                        v-model:checked="checked"  
                     > isAdmin </a-checkbox>
                     <a-divider />
                  
                </div>
                
                
                <a-form-item
                    name="displayName"
                    label="Ingrese su nickName"
                    :rules="[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Ingresa un nick válido',
                        },
                    ]"
                >
                    <a-input
                        v-model:value="userStore.userData.displayName"
                    ></a-input>
                </a-form-item>

                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                >
                    <a-button>Subir foto perfil</a-button>
                </a-upload>

                <a-form-item class="mt-5">
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                        >Actualizar información</a-button
                    >
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>

    </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { message } from "ant-design-vue";
import { ref} from "vue";

const userStore = useUserStore();
const fileList = ref([]);

let checked = ref(userStore.esAdmin);


const beforeUpload = (file) => {
    return false;
};

const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
};

const handleChange = (info) => {
    // validar los tipos de imágenes
    if (info.file.status !== "uploading") {
        // console.log(info.file);
        const isJpgOrPng =
            info.file.type === "image/jpeg" || info.file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("Solo imagenes png o jpg");
            handleRemove(info.file);
            return;
        }
        const isLt2M = info.file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Máximo 2MB!");
            handleRemove(info.file);
            return;
        }
    }

    // valida que sea solo una imagen
    // si el user sube otra, se reemplazará
    let resFileList = [...info.fileList];
    resFileList = resFileList.slice(-1);
    resFileList = resFileList.map((file) => {
        if (file.response) {
            file.url = file.response.url;
        }
        return file;
    });
    fileList.value = resFileList;
};

const onFinish = async (values) => {
    const error = await userStore.updateUser(
        userStore.userData.displayName,
        checked.value,
        fileList.value[0]
    );

    if (!error) {
        fileList.value = []
        beforeUpload()
        return message.success("Se actualizó tu información");
    }
    message.error("Ocurrió un error al actualizar el perfil");
};
</script>

<style>
.mb-5 {
    margin-bottom: 2rem;
}
.mt-5 {
    margin-top: 2rem;
}
</style>
