# simple inquiry example
import asyncio
import logging
from bleak import BleakScanner, BleakClient, BleakGATTCharacteristic
from uuid import UUID

FORMAT = f"%(asctime)s:%(levelname)s:%(message)s"
logging.basicConfig(format=FORMAT)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

ADDR = "C8:56:1A:C5:A1:02"
SERVICE_UUID = UUID("00002A2400001000800000805F9B34FB")
ACC_SERVICE_UUID = UUID("E95DCA4B251D470AA062FA1922DFA9A8")
PORT = 1

def notification_handler(characteristic: BleakGATTCharacteristic, data: bytearray):
    logger.info("%s: %r", characteristic.description, data)

async def main():
    # devices = await BleakScanner.discover()
    # for d in devices:
    #     print(d)
    async with BleakClient(ADDR) as client:
        logger.info("Connected")
        model_number = await client.read_gatt_char(SERVICE_UUID)
        logger.info(f"Model {model_number}")

        await client.start_notify(ACC_SERVICE_UUID, notification_handler)
        await asyncio.sleep(5.0)
        await client.stop_notify(ACC_SERVICE_UUID)

if __name__ == "__main__":
    logger.info("Starting...")
    asyncio.run(main())