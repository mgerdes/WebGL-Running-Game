var app = app || {};
app.objects = app.objects || {};

app.objects.Ship = function() {
    this.position = new app.math.Vector3(0, -0.4, 0);
    this.velocity = new app.math.Vector3(0, 0, this.MAX_FORWARD_VELOCITY);
    this.acceleration = new app.math.Vector3(0, 0, 0);
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isMovingUp = false;
    this.updateModelMatrix();

    this.boundingBox1 = new app.BoundingBox(this.position, new app.math.Vector3(0.1, 0.1, 0.30));

    this.mesh = new app.Mesh(app.objects.shipModelData["vertices"], 
                             app.objects.shipModelData["normals"],
                             app.objects.shipModelData["faces"],
                             new app.math.Vector3(-0.2, -0.2, -0.2));
};

app.objects.Ship.prototype.MAX_TURNING_VELOCITY = 60;
app.objects.Ship.prototype.TURNING_ACCELERATION = 50;
app.objects.Ship.prototype.MAX_FORWARD_VELOCITY = 40;

app.objects.Ship.prototype.updateModelMatrix = function() {
    var translationMat = app.math.Matrix4.translation(this.position.x, this.position.y, this.position.z);
    var scaleMat = app.math.Matrix4.scale(0.1, 0.1, 0.1);
    var rotation1 = app.math.Matrix4.rotation(new app.math.Vector3(1, 0, 0), -Math.PI / 2);
    var rotation2 = app.math.Matrix4.rotation(new app.math.Vector3(0, 0, 1), (-(1 - this.velocity.x / this.MAX_TURNING_VELOCITY) + 1) * 0.7);

    this.modelMat = translationMat.times(scaleMat.times(rotation2.times(rotation1)));
};

app.objects.Ship.prototype.draw = function(shader) {
    this.mesh.draw(shader, this.modelMat); 
};

app.objects.Ship.prototype.update = function(timeDelta) {
    this.velocity = this.velocity.add(this.acceleration.times(timeDelta));
    this.position = this.position.add(this.velocity.times(timeDelta));
    this.updateModelMatrix();

    this.boundingBox1.position = this.position;

    if (this.isMovingUp) {
        this.acceleration.y = 120;
    } else {
        if (this.position.y > -0.4) {
            this.acceleration.y = -8;
        } else {
            this.position.y = -0.4;
            this.acceleration.y = 0;
            this.velocity.y = 0;
        }
    }

    if (this.isMovingLeft) {
        if (this.velocity.x > this.MAX_TURNING_VELOCITY) {
            this.acceleration.x = 0;
        } else {
            this.acceleration.x = this.TURNING_ACCELERATION;
        }
    } else if (this.isMovingRight) {
        if (this.velocity.x < -this.MAX_TURNING_VELOCITY) {
            this.acceleration.x = 0;
        } else {
            this.acceleration.x = -this.TURNING_ACCELERATION;
        }
    } else {
        if (this.velocity.x < -0.1) {
            this.acceleration.x = this.TURNING_ACCELERATION / 3;
        } else if (this.velocity.x > 0.1) {
            this.acceleration.x = -this.TURNING_ACCELERATION / 3;
        } else {
            this.acceleration.x = 0;
            this.velocity.x = 0;
        }
    }
};
