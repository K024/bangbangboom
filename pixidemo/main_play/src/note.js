//有效时间
//level 登记分数
//type 音符类型
function note(time,level,type){
    this.time=time;
    this.level = level;
    this.type=type;
    this.func=function(){
        alert("aaa");
    }
}
export default note;