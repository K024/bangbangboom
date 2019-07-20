import axios from 'axios'


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
    let ret = ''
    for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}];

const GetCSRFHeader = async () => {

    try {
        const result = await axios.get<string>('/api/csrf')
        axios.defaults.headers.common['X-CSRF-TOKEN'] = result.data;
    } catch (error) {
        console.log("Get csrf failed, retry after 60s.")
        setTimeout(GetCSRFHeader, 60 * 1000)
    }
}

GetCSRFHeader()
