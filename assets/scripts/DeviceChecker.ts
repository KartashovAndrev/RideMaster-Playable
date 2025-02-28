import { _decorator, Component, sys } from 'cc';
import { Global } from './DeviceTypeGlobal';

const { ccclass, property } = _decorator;

@ccclass('DeviceChecker')
export default class DeviceChecker extends Component {
    onLoad() {
        this.checkDevice();
    }

    checkDevice() {
        if (sys.isNative) {
            switch (sys.os) {
                case sys.OS.IOS:
                    Global.deviceType = "iOS";
                    break;
                case sys.OS.ANDROID:
                    Global.deviceType = "Android";
                    break;
                default:
                    Global.deviceType = "Another native";
                    break;
            }
        } else {
            Global.deviceType = "Web";
        }
      //  console.log("DeviceType:", Global.deviceType);
    }
}

