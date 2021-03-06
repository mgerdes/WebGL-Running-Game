var app = app || {};

app.Obstacle1 = function(position) {
    /* 
     * |-----     |
     * |          |
     * |          |
     * |          |
     * |          |
     * |     -----|
     * |          |
     * |          |
     * |          |
     * |          |
     * |-----     |
     * |          |
     * |          |
     * |          |
     * |          |
     * |          |
     * |     -----|
     * |          |
     * |          |
     * |          |
     * |          |
     * |-----     |
     * |          |
     * |          |
     * |          |
     * |          |
     * |     -----|
     */

    var WALL_HEIGHT = 0.7;
    var WALL_DEPTH = 0.04;

    var SIDE_WALL_LENGTH = 120;
    var INNER_WALL_LENGTH = 8;
    var SPACE_BETWEEN_INNER_WALLS = 20;

    var box1Position = new app.math.Vector3(position.x + INNER_WALL_LENGTH,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + SIDE_WALL_LENGTH / 2 + 30);
    var box1Scale = new app.math.Vector3(WALL_DEPTH,
                                        WALL_HEIGHT,
                                        SIDE_WALL_LENGTH / 2);

    var box2Position = new app.math.Vector3(position.x - INNER_WALL_LENGTH,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + SIDE_WALL_LENGTH / 2 + 30);
    var box2Scale = new app.math.Vector3(WALL_DEPTH,
                                        WALL_HEIGHT,
                                        SIDE_WALL_LENGTH / 2);

    var box3Position = new app.math.Vector3(position.x - INNER_WALL_LENGTH / 2,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + 0 * SPACE_BETWEEN_INNER_WALLS + 30);
    var box3Scale = new app.math.Vector3(INNER_WALL_LENGTH / 2,
                                        WALL_HEIGHT,
                                        WALL_DEPTH);

    var box4Position = new app.math.Vector3(position.x + INNER_WALL_LENGTH / 2,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + 1 * SPACE_BETWEEN_INNER_WALLS + 30);
    var box4Scale = new app.math.Vector3(INNER_WALL_LENGTH / 2,
                                        WALL_HEIGHT,
                                        WALL_DEPTH);

    var box5Position = new app.math.Vector3(position.x - INNER_WALL_LENGTH / 2,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + 2 * SPACE_BETWEEN_INNER_WALLS + 30);
    var box5Scale = new app.math.Vector3(INNER_WALL_LENGTH / 2,
                                        WALL_HEIGHT,
                                        WALL_DEPTH);

    var box6Position = new app.math.Vector3(position.x + INNER_WALL_LENGTH / 2,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + 3 * SPACE_BETWEEN_INNER_WALLS + 30);
    var box6Scale = new app.math.Vector3(INNER_WALL_LENGTH / 2,
                                        WALL_HEIGHT,
                                        WALL_DEPTH);

    var box7Position = new app.math.Vector3(position.x - INNER_WALL_LENGTH / 2,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + 4 * SPACE_BETWEEN_INNER_WALLS + 30);
    var box7Scale = new app.math.Vector3(INNER_WALL_LENGTH / 2,
                                        WALL_HEIGHT,
                                        WALL_DEPTH);

    var box8Position = new app.math.Vector3(position.x + INNER_WALL_LENGTH / 2,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + 5 * SPACE_BETWEEN_INNER_WALLS + 30);
    var box8Scale = new app.math.Vector3(INNER_WALL_LENGTH / 2,
                                        WALL_HEIGHT,
                                        WALL_DEPTH);

    var box9Position = new app.math.Vector3(position.x - INNER_WALL_LENGTH / 2,
                                           position.y - (1 - WALL_HEIGHT),
                                           position.z + 6 * SPACE_BETWEEN_INNER_WALLS + 30);
    var box9Scale = new app.math.Vector3(INNER_WALL_LENGTH / 2,
                                        WALL_HEIGHT,
                                        WALL_DEPTH);

    this.objects = [];
    this.objects.push(new app.objects.Box(box1Position, box1Scale));
    this.objects.push(new app.objects.Box(box2Position, box2Scale));
    this.objects.push(new app.objects.Box(box3Position, box3Scale));
    this.objects.push(new app.objects.Box(box4Position, box4Scale));
    this.objects.push(new app.objects.Box(box5Position, box5Scale));
    this.objects.push(new app.objects.Box(box6Position, box6Scale));
    this.objects.push(new app.objects.Box(box7Position, box7Scale));
    this.objects.push(new app.objects.Box(box8Position, box8Scale));
    this.objects.push(new app.objects.Box(box9Position, box9Scale));

    this.addLeftOvers(position);
};

app.Obstacle1.prototype.addLeftOvers = function(position) {
    for (var i = 0; i < 50; i++) {
        var xOffset = Math.random() * 200 - 100; 
        var zOffset = Math.random() * 200;

        if (xOffset >= -16 && xOffset <= 16 && zOffset <= 150 && zOffset >= 30) {
            continue;
        }

        var boxPosition = new app.math.Vector3(position.x + xOffset, position.y + 1.0, position.z + zOffset);
        var boxScale = new app.math.Vector3(2.0, 2.0, 2.0);

        this.objects.push(new app.objects.Box(boxPosition, boxScale));
    }
};

app.Obstacle1.prototype.shiftZUnits = function(unitsToShift) {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].position.z += unitsToShift;
        this.objects[i].updateModelMat();
    }
};

app.Obstacle1.prototype.draw = function(shader) {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw(shader);
    }
};

app.Obstacle1.prototype.update = function(timeDelta) {
};
