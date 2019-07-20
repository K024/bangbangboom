import Vue from "vue"

function CreateStore<T extends object>(data: T) {
    const vm = new Vue({
        data: data,
    })
    return data
}

export default CreateStore
