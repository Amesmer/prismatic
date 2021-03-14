
// 回调函数里面会去执行一些需要在空闲时间执行的方法
requestIdleCallback(myNonEssentialWork, { timeout: 2000 });

// 任务队列
const tasks = [
 () => {
   console.log("第一个任务");
 },
 () => {
   console.log("第二个任务");
 },
 () => {
   console.log("第三个任务");
 },
];

// 在浏览器的空闲时间执行这3个任务

function myNonEssentialWork (deadline) {
 // 如果帧内有富余的时间，或者超时
 while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
   work(); // 执行任务
 }

 if (tasks.length > 0)
   requestIdleCallback(myNonEssentialWork);
 }

function work () {
 tasks.shift()();
 console.log('执行任务');
}