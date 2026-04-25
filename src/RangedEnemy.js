
class RangedEnemy{
    constructor(scene, path, texture, x=0, y=0, start_At = 0){
        // super(scene, 0, 0, texture);

        // scene.add.existing(this);

        // this.path = path;
        // this.t = start_At;
        // this.speed = 0.002;
        // this.setScale(0.2);

        this.sprite = scene.add.follower(path, x, y, texture)

        this.sprite.setScale(0.2);

        this.sprite.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 5000,
            ease: 'Linear', //'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            rotateToPath: false,
            rotationOffset: -90,
            startAt: start_At
        });
    }
    // update(delta) {
    //     this.t += this.speed;

    //     if (this.t > 1) this.t = 0;

    //     const point = this.path.getPoint(this.t);

    //     this.x = point.x;
    //     this.y = point.y;
    // }
}