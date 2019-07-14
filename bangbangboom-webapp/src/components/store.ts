import Vue from "vue"

function CreateStore<T extends object>(data: T) {
    const vm = new Vue({
        data: data,
    })
    return () => data
}

const testStore = CreateStore({
    count: 0,
})

export default testStore
