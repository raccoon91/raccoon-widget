// import shell from "../main/lib/shell";

// const className = {
//   system: "System",
//   bluetooth: "Bluetooth",
// };

(async () => {
  console.time("shell");

  // const stdout = await shell.run("Get-CimInstance -Class Win32_Battery ");
  // const stdout = await shell.run(`Get-PnpDevice -Class ${className.bluetooth} | Select-Object InstanceId, FriendlyName`);
  // const stdout = await shell.getDeviceByClass(className.bluetooth);
  // const stdout = await shell.getDevicePropertyById(instanceId.qcy);
  // const stdout = await shell.run(`Get-PnpDevice -InstanceId '${instanceId.qcy}' | Get-PnpDeviceProperty | Select-Object Keyname, Data`);
  // const stdout = await shell.getSystemByContainerId(containerId.qcy);

  // const result = JSON.parse(stdout);

  // console.log(result);

  console.timeEnd("shell");
})();
