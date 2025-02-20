const getPairedBluetooth = async () => {
  const result = await window.electronAPI.getPairedBluetooth();

  console.log(typeof result);
  console.log(result);
};

document.getElementById("get-paired-bluetooth").addEventListener("click", getPairedBluetooth);
