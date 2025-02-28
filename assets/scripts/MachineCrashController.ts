import { _decorator, Component, Node, RigidBody, BoxCollider, Vec3, ICollisionEvent, Collider, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MachineCrashController')
export class MachineCrashController extends Component {
    isBroken: boolean = false;

    @property(Node)
    public breakableNode: Node | null = null; // Нода, об которую машина будет разбиваться

    onLoad() {
        const collider = this.node.getComponent(BoxCollider);
        if (collider) {
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }
    }

    update(deltaTime: number) {
        // Проверяем, если машина ниже -5 по оси Y
        if (this.node.position.y < -5) {
            this.startFalling();
        }
    }

    private onCollisionEnter(event: ICollisionEvent) {
        const other = event.otherCollider.node;

        //console.log("Collision detected with:", other.name);
        //console.log("isBroken flag value:", this.isBroken);

        if (this.breakableNode && other === this.breakableNode && !this.isBroken) {
            this.startFalling();
        }
    }

    startFalling(): void {
        if (this.isBroken) return;

        this.isBroken = true;

        const machineRigidBody = this.node.getComponent(RigidBody);
        if (machineRigidBody) {
            machineRigidBody.type = RigidBody.Type.DYNAMIC; // Переключаем на Dynamic
        }

        // Отключаем коллайдер материнского объекта
        const parentCollider = this.node.getComponent(Collider);
        if (parentCollider) {
            parentCollider.enabled = false; // Отключаем коллайдер
        }

        // Активируем коллайдеры у дочерних элементов и устанавливаем RigidBody
        this.node.children.forEach((child) => {
            const colliders = child.getComponents(Collider);
            colliders.forEach((collider) => {
                collider.enabled = true; // Включаем коллайдер
            });

            let childRigidBody = child.getComponent(RigidBody);
            if (!childRigidBody) {
                childRigidBody = child.addComponent(RigidBody);
            }
            childRigidBody.isDynamic = true;
            childRigidBody.mass = 100 / this.node.children.length; // Обновляем массу для каждого дочернего элемента
        });

        // Применяем импульс к машине
        if (machineRigidBody) {
            machineRigidBody.applyImpulse(new Vec3(10, -2, 0)); // Измененные значения
        }
    }
}