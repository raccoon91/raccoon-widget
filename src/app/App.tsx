export const App = () => {
  const handleClickGetPairedBluetooth = async () => {
    const result = await window.electronAPI.getPairedBluetooth();

    console.log(typeof result);
    console.log(result);
  };

  return (
    <div>
      <h1>💖 Hello World!</h1>

      <p>Welcome to your Electron application.</p>

      <button onClick={handleClickGetPairedBluetooth}>Get Bluetooth</button>

      <div></div>
    </div>
  );
};
