let arr=["akhil","nikhil"];
arr=JSON.stringify(arr);
arr=JSON.parse(arr);
let len=arr.length;
for(let i=0;i<len;i++){
    console.log(arr[i]);
}
console.log(len);
