import { _decorator, Component, Node, Vec3 } from 'cc';
import { MachineCrashController } from './MachineCrashController'; // Импортируем класс MachineCrashController
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    public targetNode: Node = null; // Публичная переменная для хранения целевой ноды

    @property(Node)
    public machineNode: Node = null; // Нода машины, передаваемая извне

    @property
    public offsetX: number = -10; // Фиксированное смещение по оси X

    @property
    public offsetY: number = 15; // Фиксированное смещение по оси Y

    @property
    public offsetZ: number = 30; // Фиксированное смещение по оси Z

    private isCameraFixed: boolean = false; // Флаг для отслеживания состояния камеры
    private machineCrashController: MachineCrashController = null; // Ссылка на контроллер аварии машины

    start() {
        // Получаем ссылку на MachineCrashController из ноды машины
        if (this.machineNode) {
            this.machineCrashController = this.machineNode.getComponent(MachineCrashController);
        }
    }

    private updateCameraPosition(): void {
        if (this.machineCrashController && this.machineCrashController.isBroken) {
            if (!this.isCameraFixed) {
                // Если камера еще не зафиксирована, фиксируем ее положение
                this.isCameraFixed = true;
                // Устанавливаем фиксированную позицию камеры
                this.node.setWorldPosition(this.node.worldPosition); // Сохраняем текущее положение камеры
            }
        } else {
            // Если машина не сломана, продолжаем следовать за целевой нодой
            if (this.targetNode) {
                // Получаем мировую позицию целевого объекта
                let targetPos = new Vec3();
                this.targetNode.getWorldPosition(targetPos);

                // Определяем желаемую позицию камеры с фиксированными смещениями
                let desiredPosition = new Vec3(
                    targetPos.x + this.offsetX,
                    targetPos.y + this.offsetY,
                    targetPos.z + this.offsetZ
                );

                // Устанавливаем новую позицию камеры
                this.node.setWorldPosition(desiredPosition);
                this.isCameraFixed = false; // Сбрасываем флаг, так как камера не зафиксирована
            }
        }
    }

    update(deltaTime: number) {
        this.updateCameraPosition();
    }
}