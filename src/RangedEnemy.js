
class RangedEnemy{
    constructor(scene, path, texture, x=0, y=0, start_At = 0){
        // super(scene, 0, 0, texture);

        // scene.add.existing(this);

        // this.path = path;
        // this.t = start_At;
        // this.speed = 0.002;
        // this.setScale(0.2);
        this.lastShot = 0;
        this.fireRate = 2000;

        this.sprite = scene.add.follower(path, x, y, texture)

        this.sprite.setScale(0.2);

        this.sprite.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 6000,
            ease: 'Linear', //'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: false,
            rotationOffset: -90,
            startAt: start_At
        });
    }
    
    shoot(scene){
        let bullet = scene.add.sprite(
            this.sprite.x,
            this.sprite.y + 20,
            "enemy_missile"
        );

        bullet.setScale(0.4);
        bullet.setAngle(180)
        scene.enemy_projectiles.push(bullet);
    }
}