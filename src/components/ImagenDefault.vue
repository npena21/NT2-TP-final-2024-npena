<template>

    <div class="mb-5">
<h1 class="text-2xl mb-3 underline">Cargar imagen Default</h1>

            <a-form
                name="imagenDefault"
                autocomplete="off"
                layout="vertical"
                :model="userStore.userData"
                @finish="onFinish"
            >   <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                >
                    <a-button class="block bg-green-500 text-white hover:bg-green-400 rounded-full"
                    
                    :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                        >
                        Subir img default</a-button>
                    </a-upload>

                <a-form-item class="mt-2 mb-5">
                    <a-button
                    class="rounded-full "
                        type="primary"
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                        >Actualizar imagen</a-button
                    >
                </a-form-item>
            </a-form>  

        </div>
</template>

<script setup>
import { ref} from "vue";
import { useUserStore } from "../stores/user";
import { message } from "ant-design-vue";

const userStore = useUserStore();
const fileList = ref([]);

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

const onFinish = async (value) => {

    console.log("subiendo imagen")
    const error = await userStore.fotoDefault(
       fileList.value[0]
    );

    fileList.value = []

   

    if (!error) {
        
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