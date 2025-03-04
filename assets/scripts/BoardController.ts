/*import { _decorator, Component, Collider, RigidBody, Vec3, ICollisionEvent, Node, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoardController')
export class BoardController extends Component {
    @property
    public fallDelay: number = 0; // Задержка перед падением доски
    @property
    public gravityStrength: number = 0; // Скорость падения доски
    @property(Node) // Добавляем свойство для ссылки на ноду
    public targetNode: Node = null; // Нода, с которой будет происходить столкновение

    private isFalling: boolean = false;
    private destructionDelay = 1;

    onLoad() {
        const collider = this.getComponent(Collider);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    onCollisionEnter(event: ICollisionEvent) {
        const other = event.otherCollider.node;
        console.log(`Collision with: ${other.name}`);
        // Проверяем, совпадает ли нода с целевой нодой
        if (other === this.targetNode && !this.isFalling) {
            this.isFalling = true;
            this.scheduleOnce(() => {
                this.makeDynamic();
                this.fall();
            }, this.fallDelay);
        }
    }

    makeDynamic() {
        const rigidBody = this.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.type = RigidBody.Type.DYNAMIC;
        }
    }

    fall() {
        const rigidBody = this.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.applyForce(new Vec3(0, this.gravityStrength, 0)); // чем больше, тем быстрее падает
        }
        
        this.scheduleOnce(() => {
            this.node.destroy();
        }, this.destructionDelay);
    }
}*/
////////////////////////////////////////////////////////////////////////////////////////////////////////

import { _decorator, Component, Collider, RigidBody, Vec3, ICollisionEvent, Node } from 'cc';
const { ccclass, property } = _decorator;
    
@ccclass('BoardController')
export class BoardController extends Component {
    @property
    public fallDelay: number = 0; // Задержка перед падением доски
    @property
    public gravityStrength: number = 0; // Скорость падения доски
    @property(Node) // Добавляем свойство для ссылки на ноду
    public targetNode: Node = null; // Нода, с которой будет происходить столкновение
    
    private destructionDelay = 1;
    private isDestroyed = false; // Флаг для отслеживания состояния ноды
    
     onLoad() {
        const collider = this.getComponent(Collider);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }
    
    onCollisionEnter(event: ICollisionEvent) {
        if (this.isDestroyed) return; // Проверка, была ли нода уничтожена
    
        const other = event.otherCollider.node;
        console.log(`Collision with: ${other.name}`);

        setTimeout(() => {
            if (this.isDestroyed) return; // Дополнительная проверка перед вызовом методов
                this.makeDynamic();
                this.fall();
            }, this.fallDelay * 1000);
        }
    
        makeDynamic() {
            const rigidBody = this.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.type = RigidBody.Type.DYNAMIC;
            }
        }
    
        fall() {
            const rigidBody = this.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.applyForce(new Vec3(0, this.gravityStrength, 0)); // чем больше, тем быстрее падает
            }
    
            this.isDestroyed = true; // Устанавливаем флаг перед уничтожением
            
            setTimeout(() => {
                this.node.destroy();
            }, this.destructionDelay * 1000);
        }
    }   