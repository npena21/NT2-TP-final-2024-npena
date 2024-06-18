<template>
    <div>
        <h1>Editar Producto id: {{ route.params.id }}</h1>

        <a-input disabled v-model:value="formState.productName"></a-input>

        <a-form
            name="editform"
            autocomplete="off"
            layout="vertical"
            :model="formState"
            @finish="onFinish"
        >

        <a-form-item
            name="Stock"
            label="Ingrese el nuevo Stock"
            
        >
            <a-input v-model:value="formState.Stock"></a-input>
        </a-form-item>
        <a-form-item
            name="Precio"
            label="Ingrese el nuevo Precio"
            
        >
            <a-input v-model:value="formState.Precio"></a-input>
        </a-form-item>
        <a-form-item
            name="Detalle"
            label="Ingrese los detalles del Producto"
            
        >
            <a-input v-model:value="formState.Detalle"></a-input>
        </a-form-item>
          
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    :loading="productStore.loadingProduct"
                    :disabled="productStore.loadingProduct"
                >
                    Editar Producto</a-button
                >
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../stores/product";
import { message } from "ant-design-vue";

const productStore = useProductStore();

const route = useRoute();

const formState = reactive({
    Stock: "usuario",
    Precio: "usuario",
    Detalle: "usuario",
    productName:'el producto',
});

const onFinish = async (values) => {

    const prod = {
        Stock : formState.Stock,
        Precio: formState.Precio,
        Detalle: formState.Detalle,
        

    }

    console.log('onfinish')
    const error = await productStore.updateProducto(route.params.id, prod);
    if (!error) {
        formState.Stock = '';
        formState.Precio='';
        formState.Detalle='';

        return message.success("Prodcuto editado");
    }

    switch (error) {
        // buscar errores de firestore
        default:
            message.error(
                "Ocurrió un error en el servidor  intentelo más tarde..."
            );
            break;
    }
};

onMounted(async () => {

    console.log('empezando onmounted')
    const prodNow = await productStore.leerDatosProd(route.params.id);

        console.log(prodNow.Stock)
        console.log(prodNow)    

        formState.Stock = prodNow.Stock;
        formState.Precio= prodNow.Precio;
        formState.Detalle= prodNow.Detalle;
        formState.productName= prodNow.NombreProd;

});
</script>
