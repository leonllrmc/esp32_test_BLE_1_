const ledBtn = document.getElementById("led-toggle-btn");
const btnValue = document.getElementById("btn-value");
let ledCharacteristic = null;
let buttonCharacteristic = null;

ledBtn.disabled = true;

let blink = false;

function connect()
{
    ledBtn.disabled = true;

    navigator.bluetooth.requestDevice({
        filters: [{
            services: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"]
        }]
    })
    .then(device => device.gatt.connect())
    .then(server => {
        // Getting Battery Service…
        return server.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
    })
    .then(async service => {
        // Getting Battery Level Characteristic…
        ledCharacteristic = (await service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8"));  // in case we add more
        buttonCharacteristic = (await service.getCharacteristic("517fa073-930b-4d3f-b25f-566f3ff8d316"));  // in case we add more

        //buttonCharacteristic.addEventListener('characteristicvaluechanged', handleButtonValue);

        setInterval(async () => await handleButtonValue(await buttonCharacteristic.readValue()), 200)

        ledBtn.disabled = false;
    })
    .catch(error => { console.error(error); });
}

async function toggleLed()
{
    blink = !blink;
    await ledCharacteristic.writeValueWithoutResponse(new Uint8Array([(blink + 0)]));
}



async function handleButtonValue(e)
{
    const buttonValue = await e.getUint8(0);//e.target.value.getUint8(0);

    btnValue.innerText = buttonValue ? "pressed" : "not pressed";
}
