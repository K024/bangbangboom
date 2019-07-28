import Vue from "vue"

/**
 * 创建响应式数据对象
 * @param data 需要响应式的对象
 */
function CreateStore<T extends object>(data: T) {
    const vm = new Vue({
        data: data,
    })
    return data
}

export default CreateStore
