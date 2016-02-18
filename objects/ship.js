var app = app || {};
app.objects = app.objects || {};

app.objects.Ship = function() {
    this.position = new app.math.Vector3(0, 0, 0);
    this.velocity = new app.math.Vector3(0, 0, this.MAX_FORWARD_VELOCITY);
    this.acceleration = new app.math.Vector3(0, 0, 0);
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.updateModelMatrix();

    this.mesh = new app.Mesh(app.objects.shipModelData["vertices"], 
                             app.objects.shipModelData["normals"],
                             app.objects.shipModelData["faces"],
                             new app.math.Vector3(-0.5, -0.5, -0.5));
};

app.objects.Ship.prototype.MAX_TURNING_VELOCITY = 60;
app.objects.Ship.prototype.TURNING_ACCELERATION = 60;
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
