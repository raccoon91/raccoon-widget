import './index.css';

async function testIt () {
  const result = await window.electronAPI.getPairedBluetooth();

  console.log(result);
}

document.getElementById('clickme').addEventListener('click', testIt)
