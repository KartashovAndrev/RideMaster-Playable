import { _decorator, Component, Node, Animation } from 'cc';
import { MachineCrashController } from './MachineCrashController'; // Импортируем MachineCrashController
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    overlay: Node = null; // Нода overlay, присоединяемая извне

    @property(Node)
    button_Download: Node = null; // Нода кнопки загрузки

    @property(Node)
    machineNode: Node = null; // Нода Machine, присоединяемая извне

    private machineCrashController: MachineCrashController = null;
    private hasGameEnded: boolean = false; // Новый флаг для отслеживания состояния

    start() {
        // Получаем ссылку на MachineCrashController
        if (this.machineNode) {
            this.machineCrashController = this.machineNode.getComponent(MachineCrashController);
        }
    }

    update() {
        // Проверяем состояние isBroken в каждом кадре
        if (this.machineCrashController && this.machineCrashController.isBroken && !this.hasGameEnded) {
            this.gameEnd(); // Вызываем gameEnd() только если он еще не был вызван
            this.hasGameEnded = true; // Устанавливаем флаг, чтобы предотвратить повторный вызов
        }
    }

    gameEnd() {
        if (this.overlay) {
            this.overlay.active = true; // Активируем ноду overlay
        }

        const btnAnim = this.button_Download.getComponent(Animation); // Нода кнопки загрузки
        btnAnim.play("btnDownloadDissappear"); // Проигрываем анимацию btnDownloadDissappear
    }
}