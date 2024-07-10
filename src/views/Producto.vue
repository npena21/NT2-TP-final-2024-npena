<template>

<div class="bg-green-200 ">

    <h1 class="text-center text-gray-600 text-4xl mb-5 ">Producto</h1>
    <a-row class="">
        <a-col class="" :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
            <a-form class=""
                name="basicProduct"
                autocomplete="off"
                layout="vertical"
                :model="formState"
               @finish="onFinish"
            >
            
                <a-form-item
                    name="productName"
                    label="Ingrese el nombre del producto"
                    :rules="[
                        {
                            required: true,
                            whitespace: true,
                            message: 'no puede estar vacio',
                        },
                    ]"
                >
                    <a-input v-model:value="formState.productName"></a-input>
                </a-form-item>

                <a-form-item
                    name="productDetails"
                    label="Ingrese info del producto"
                    
                >
                    <a-input v-model:value="formState.productDetails"></a-input>
                </a-form-item>

                <a-form-item
                    name="productStock"
                    label="Ingrese Stock del producto"
                    :rules="[
                        {
                            required: true,
                            whitespace: true,
                            message: 'no puede ser negativo',
                        },
                    ]"
                >
                    <a-input v-model:value="formState.productStock"></a-input>
                </a-form-item>

                <a-form-item
                    name="productPrice"
                    label="Ingrese el precio del producto"
                    :rules="[
                        {
                            required: true,
                            whitespace: true,
                            message: 'no puede estar vacio',
                        },
                    ]"
                >
                    <a-input v-model:value="formState.productPrice"></a-input>
                </a-form-item>

                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                >
                    <a-button>Subir imagen del Producto</a-button>
                </a-upload>
                
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="productStore.loadingProduct"
                        :loading="productStore.loadingProduct"
                        >Crear Producto</a-button
                    >
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>

</div>
</template>

<script setup>
import { reactive,ref } from "vue";
import { useProductStore } from "../stores/product";
import { message } from "ant-design-vue";

const productStore = useProductStore();
const fileList = ref([])



const formState = reactive({
    productName: "Campera Invierno",
    productDetails: "Sin detalles",
    productStock: "10",
    productPrice: "100",
});

const beforeUpload = (file) => {
    return false;}

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
        const isLt1M = info.file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error("Máximo 1MB!");
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

 const onFinish = async () => {

       const error = await productStore.registerProduct(
        
        formState.productName,
        formState.productDetails,
        formState.productStock,
        formState.productPrice,
        fileList.value[0]

    );

  
   if (!error) {

        fileList.value = []
        beforeUpload()

        return message.success("Producto ingresado!! 🗻");


    }

    switch (error) {
         default:
            message.error(
                "Ocurrió un error en el servidor 🗻 intentelo más tarde..."
            );
            break;
    }
}
</script>