import { _decorator, Component, Button, sys } from 'cc';
import { Global } from './DeviceTypeGlobal';

const { ccclass, property } = _decorator;

@ccclass('ButtonHandler')
export default class ButtonHandler extends Component {
    @property(Button)
    myButton: Button = null;

    start() {
        this.myButton.node.on('click', this.onButtonClick, this);
    }

    onButtonClick() {
        let url = '';

        switch (Global.deviceType) {
            case "iOS":
                url = "https://apps.apple.com/us/app/ride-master-car-builder-game/id6449224139"; 
                break;
            case "Android":
                url = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en"; 
                break;
            case "Web":
                url = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en"; 
                break;
            default:
                url = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en"; 
                break;
        }

        window.open(url, '_blank');
    }
}

