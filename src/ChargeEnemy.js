class ChargeEnemy{
    constructor(scene, path, texture, x=0, y=0, start_At = 0){
        // super(scene, 0, 0, texture);

        // scene.add.existing(this);

        // this.path = path;
        // this.t = start_At;
        // this.speed = 0.002;
        // this.setScale(0.2);

        this.sprite = scene.add.follower(path, x, y, texture)
        this.sprite_shield = scene.add.follower(path, x, y+35, "enemy_shield")
        
        // NOTE TO SELF: REMEMBER TO DESTORY SHIELD IF CHARGER DIES
        this.sprite.setScale(0.3);
        this.sprite_shield.setScale(0.5)

        this.sprite.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 10000,
            ease: 'Linear', //'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: false,
            rotationOffset: -90,
            startAt: start_At
        });

        this.sprite_shield.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 10000,
            ease: 'Linear', //'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: false,
            rotationOffset: -90,
            startAt: start_At
        });
    }
}