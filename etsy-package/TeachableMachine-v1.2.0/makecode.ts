// ================= CONNECTION EVENTS =================
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
    serial.writeLine("[BT] Connected")
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
    serial.writeLine("[BT] Disconnected")
})
// ================= UART RECEIVE =================
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let line = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine)).trim()
// ----- VERBOSE RAW -----
    serial.writeLine("[RX RAW] " + line)
    if (line.length == 0) {
        serial.writeLine("[RX] Empty line ignored")
        return
    }
    conf = -1
    // Expected formats:
    // 1) CMD:RED,0.93
    // 2) LEFT
    if (line.indexOf("CMD:") == 0) {
        // "RED,0.93"
        payload = line.substr(4)
        parts = payload.split(",")
        cmd = parts[0]
        if (parts.length > 1) {
            conf = Math.round(parseFloat(parts[1]) * 100)
        }
        serial.writeLine("[PARSE] cmd=" + cmd + " conf=" + conf)
    } else {
        cmd = line
        serial.writeLine("[PARSE] cmd=" + cmd + " (no confidence)")
    }
    // ================= ACTIONS =================
    // basic.showString(cmd)
    if (cmd == "LEFT") {
        basic.showArrow(ArrowNames.West)
    } else if (cmd == "RIGHT") {
        basic.showArrow(ArrowNames.East)
    } else if (cmd == "UP") {
        basic.showArrow(ArrowNames.North)
    } else if (cmd == "DOWN") {
        basic.showArrow(ArrowNames.South)
    } else if (cmd == "STOP") {
        basic.clearScreen()
    } else if (cmd == "TEST") {
        basic.showString("T")
    } else if (cmd == "RED") {
        basic.showIcon(IconNames.Heart)
    } else if (cmd == "GREEN") {
        basic.showIcon(IconNames.Happy)
    } else if (cmd == "BLUE") {
        basic.showIcon(IconNames.Square)
    } else if (cmd == "YELLOW") {
        basic.showIcon(IconNames.Diamond)
    } else if (cmd == "WHITE") {
        basic.showIcon(IconNames.SmallDiamond)
    } else if (cmd == "UNKNOWN") {
        basic.showString("?")
    } else {
    	
    }
    // ================= VERBOSE CONFIDENCE =================
    if (conf >= 0) {
        serial.writeLine("[CONF] " + conf + "%")
    }
    serial.writeLine("[DONE]")
})
let cmd = ""
let parts: string[] = []
let payload = ""
let conf = 0
// ================= SETUP =================
bluetooth.startUartService()
// ✅ USB UART (verbose output)
serial.redirectToUSB()
basic.showString("BT")
serial.writeLine("micro:bit started")
serial.writeLine("Waiting for Bluetooth...")
