
// tslint:disable

/**
 * 显示加载圆圈
 */
export function ShowLoader() {
    const loader = document.getElementById("loader");
    loader && (loader.style.display = "block")
}

/**
 * 隐藏加载圆圈
 */
export function HideLoader() {
    const loader = document.getElementById("loader");
    loader && (loader.style.display = "none")
}
