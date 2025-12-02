









let a="mohamed  | ahmed ragab";
console.log(a.lastIndexOf("ahmed"))
console.log(a.slice(0,5))// not inclde the end
console.log(a.repeat(5))
console.log(a.split(" |"))
console.log(a.substring(-10,7))
console.log(a.includes("mohamed"));
console.log(a.includes("m["));
// دايما اللينس يسبق الانديكس بواحد     length =index +1;
// unshift => add element to the first
// push => add element to the end
// shift => remove the first element
// pop=> remove the last element
// ================
// search
// indexOf(  /*search element ,from index[opt]*/ )
// LastIndexOf(  /*search element ,from index[opt]*/ )
// ================
// array.splice(index, هل هحذف او لا, "add","add")
let myFrindes=[1,2,"mohamed" ,"ahmed "]
let only=[];
for(let i=0;i<myFrindes.length;i++){
    if(typeof myFrindes[i] === "string"){
        only.push(myFrindes[i])
    }
}
// ======================
function generate(start,end){
    for(let i=start;i<=end;i++){
        console.log(i);
    }
}
generate(1998,2000)
// ======================
