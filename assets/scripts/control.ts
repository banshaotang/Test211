const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label) label: cc.Label = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Prefab) box: cc.Prefab = null;

    @property(cc.Node) again: cc.Node = null;

    public clickTime: number = 0;
    public isClick: boolean = false;

    // 随机距离
    public distance: number = 0;

    onLoad () {
        this.label.string = '点击蓄力';
    }

    start () {
        this.node.on('touchstart',this.touch_start,this);
        this.node.on('touchend',this.touch_end,this);
        // 生成第一个
        this.createOne();
    }

    touch_start (event) {
        this.isClick = true;
    }

    touch_end (event) {
        this.node.off('touchstart',this.touch_start,this);
        this.node.off('touchend',this.touch_end,this);
        this.isClick = false;
        this.player.scaleY = 20;
        //cc.tween(this.player).by(2,{position: new cc.Vec3(0,0,-50)}).start();
        console.log('点击时间' + this.clickTime);
        this.player.runAction(cc.rotate3DBy(0.8,0,0,360));
        this.player.runAction(cc.jumpBy(0.8,-400 * this.clickTime,0,100,1));
        // 1秒后
        this.scheduleOnce( () => {
            // 做差
            let d = Math.abs(this.distance - Math.abs(this.player.x));
            console.log('差距：' + d);
            if (d >= 30 && d < 45) {
                this.label.string = '遗憾！';
            } else if (d >= 15 && d < 30) {
                this.label.string = '擦边！';
            } else if (d < 15) {
                this.label.string = '完美！';
            } else {
                this.label.string = '失败！';
            }
        },1);
        // 2秒后
        this.scheduleOnce( () => {
            this.label.string = '1秒后游戏重启';
        },2);
        // 3秒后
        this.scheduleOnce( () => {
            cc.director.loadScene('test');
        },3);
    }

    createOne () {
        let b = cc.instantiate(this.box);
        this.node.addChild(b);
        this.distance = 200 + 400 * Math.random();
        b.x = -this.distance;
        console.log(this.distance);
        b.y = 200;
        b.runAction(cc.moveBy(1.8,0,-200).easing(cc.easeBounceOut()));
        //console.log(b)
    }

    update (dt) {
        if (this.isClick) {
            this.clickTime += dt;
            this.player.scaleY -= 3 * dt;
        }
    }
}
