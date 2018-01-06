/**
 *  FireplaceDeviceType
 *
 *  Author: Victor Santana
 *   based on work by XXX
 *  
 *  Date: 2017-03-26
 */


metadata {
    // Automatically generated. Make future change here.
    definition (name: "Fireplace Switch", namespace: "Fireplace", author: "victor@hepoca.com") {
        capability "Switch"
        command "command"
    }

        // UI tile definitions
    tiles {
        multiAttributeTile(name:"switch", type:"lighting", width: 3, height: 2, canChangeIcon: false, canChangeBackground: false) {
            tileAttribute ("device.switch", key: "PRIMARY_CONTROL") {
                attributeState "off", label: 'OFF', action: "on", icon: "st.Home.home29", backgroundColor: "#ffffff", nextState: "turningOn"
                attributeState "on", label: 'ON', action: "off", icon: "st.Home.home29", backgroundColor: "#79b821", nextState: "turningOff"
                attributeState "turningOn", label:'TURNING ON', icon:"st.Home.home29", backgroundColor:"#2179b8", nextState:"turningOff"
                attributeState "turningOff", label:'TURNING OFF', icon:"st.Home.home29", backgroundColor:"#2179b8", nextState:"turningOn"
            }
        }
        main(["switch"])
        details(["switch"])
    }  
}


def Fireplaceparse(String description) {
    def msg = description
    parent.writeLog("FireplaceSmartApp Device Type - Processing command: $msg")
    
    if(msg == "ON"){
        sendEvent(name: "switch", value: "on")
    } else if(msg == "OFF"){
        sendEvent(name: "switch", value: "off")
    }
}

// Implement "switch"
def on() {
    Fireplace()
}

def off() {
    Fireplace()
}

// Commands sent to the device
def Fireplace() {
    parent.writeLog("FireplaceSmartApp Device Type - Sending command")
    sendRaspberryCommand("Fireplace")
}

def sendRaspberryCommand(String command) {
	def path = "/api/$command"
    parent.sendCommand(path);
}