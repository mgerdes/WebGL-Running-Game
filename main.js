var app = app || {};

app.start = function() {
    var canvas = document.getElementById("glcanvas");
    app.gl = app.initWebGL(canvas);
    app.initApp();

    if (app.gl) {
        app.gl.clearColor(1, 1, 1, 1);
        app.gl.clearDepth(1);

        app.gl.enable(app.gl.DEPTH_TEST);
        app.gl.depthFunc(app.gl.LESS);

        setInterval(app.gameLoop, 15);
    }
};

app.initWebGL = function(canvas) {
    var gl = null;

    try {
        gl = canvas.getContext("experimental-webgl");
    }
    catch(e) {
    }

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    gl.viewport(0, 0, canvas.width, canvas.height);

    return gl;
};

app.initShaders = function() {
    app.shaders = {};
    app.shaders["default_shader"] = new app.Shader("shader-fs", "shader-vs");
    app.shaders["bounding_box_shader"] = new app.Shader("bounding-box-shader-fs", "bounding-box-shader-vs");
    app.shaders["shadow_shader"] = new app.Shader("shadow-shader-fs", "shadow-shader-vs");
    app.shaders["plane_shader"] = new app.Shader("plane-shader-fs", "plane-shader-vs");
};

app.initShip = function() {
    app.ship = new app.objects.Ship();
    app.ship.position.z -= 200;
    app.shipZPositionAtStartOfObstacle = app.ship.position.z;
    app.shipDeltaZ = 1.0;
};

app.initCamera = function() {
    var camera_position = new app.math.Vector3(0, 0, 0);
    var camera_center = new app.math.Vector3(0, 0, 0);
    var camera_up = new app.math.Vector3(0, 1, 0);
    var screen_width = window.screen.width;
    var screen_height = window.screen.height;
    app.camera = new app.Camera(camera_position, camera_center, camera_up, screen_width, screen_height);
};

app.initObstacleMap = function() {
    app.obstaclesMap = new app.ObstacleMap();
};

app.initKeyBindings = function() {
    document.onkeydown = function (event) {
        if (event.keyCode == 81) {
            app.shipDeltaZ += 0.1;
            console.log("deltaZ = " + app.shipDeltaZ + 
                        ", camPos.y = " + app.camera.position.y +
                        ", camCenter.y = " + app.camera.center.y);
        }
        if (event.keyCode == 65) {
            app.shipDeltaZ -= 0.1;
            console.log("deltaZ = " + app.shipDeltaZ + 
                        ", camPos.y = " + app.camera.position.y +
                        ", camCenter.y = " + app.camera.center.y);
        }

        if (event.keyCode == 87) {
            app.camera.position.y += 0.1;
            console.log("deltaZ = " + app.shipDeltaZ + 
                        ", camPos.y = " + app.camera.position.y +
                        ", camCenter.y = " + app.camera.center.y);
        }
        if (event.keyCode == 83) {
            app.camera.position.y -= 0.1;
            console.log("deltaZ = " + app.shipDeltaZ + 
                        ", camPos.y = " + app.camera.position.y +
                        ", camCenter.y = " + app.camera.center.y);
        }

        if (event.keyCode == 69) {
            app.camera.center.y += 0.1;
            console.log("deltaZ = " + app.shipDeltaZ + 
                        ", camPos.y = " + app.camera.position.y +
                        ", camCenter.y = " + app.camera.center.y);
        }
        if (event.keyCode == 68) {
            app.camera.center.y -= 0.1;
            console.log("deltaZ = " + app.shipDeltaZ + 
                        ", camPos.y = " + app.camera.position.y +
                        ", camCenter.y = " + app.camera.center.y);
        }

        if (event.keyCode == 37) {
            app.ship.isMovingLeft = true;
        } 
        else if (event.keyCode == 39) {
            app.ship.isMovingRight = true;
        }
    };
    document.onkeyup = function (event) {
        if (event.keyCode == 37) {
            app.ship.isMovingLeft = false;
        } 
        else if (event.keyCode == 39) {
            app.ship.isMovingRight = false;
        }
    };
};

app.initPlane = function() {
    app.plane = new app.objects.Plane(new app.math.Vector3(0, -1, 0));
};

app.initApp = function() {
    app.initShaders();
    app.initShip();
    app.initCamera();
    app.initObstacleMap();
    app.initKeyBindings();
    app.initPlane();

    app.isDoingOpeningAnimation = true;
};

app.gameLoop = function() {
    app.updateScene(0.015);
    app.gl.clear(app.gl.COLOR_BUFFER_BIT | app.gl.DEPTH_BUFFER_BIT);
    app.drawScene();
    app.drawShadows();
};

app.updateScene = function(timeDelta) {
    if (app.ship.position.z > 200 && app.shipZPositionAtStartOfObstacle + 200 < app.ship.position.z) {
        app.shipZPositionAtStartOfObstacle = app.ship.position.z;
        app.obstaclesMap.shiftDown();
    }

    app.handleCollisions();

    if (!app.isDoingOpeningAnimation) {
        app.camera.center.z = app.ship.position.z;
        app.camera.position.z = app.ship.position.z - app.shipDeltaZ;

        app.camera.center.y = app.ship.position.y + 0.4;
        app.camera.position.y = app.ship.position.y + 0.4;

        app.camera.center.x = app.ship.position.x;
        app.camera.position.x = app.ship.position.x;
    }

    for (shaderName in app.shaders) {
        app.shaders[shaderName].setMat4Property("projMat", app.camera.projectionMatrix);
        app.shaders[shaderName].setMat4Property("viewMat", app.camera.viewMatrix);
    }

    app.plane.update(timeDelta);

    if (app.isDoingOpeningAnimation) {
        if (app.ship.position.z > -100) {
            app.isDoingOpeningAnimation = false;
        }

        if (app.ship.position.z < -180) {
            app.camera.position.x = 4;
            app.camera.position.y = -0.5;
            app.camera.position.z = -180;
        } else {
            var xDelta = (app.ship.position.x - app.camera.position.x) * 2;
            var yDelta = (app.ship.position.y + 0.4 - app.camera.position.y) * 2;
            var zDelta = (app.ship.position.z + 18.0 - app.camera.position.z) * 2;

            //console.log("camera.z = " + app.camera.position.z);
            //console.log("ship.z = " + app.ship.position.z);

            app.camera.position.x = app.camera.position.x + xDelta * timeDelta;
            app.camera.position.y = app.camera.position.y + yDelta * timeDelta;
            app.camera.position.z = app.camera.position.z + zDelta * timeDelta;
        }

        app.camera.center.x = app.ship.position.x;
        app.camera.center.y = app.ship.position.y + 0.4;
        app.camera.center.z = app.ship.position.z;
    }

    app.ship.update(timeDelta);
    app.obstaclesMap.updateObstacles(timeDelta);
    app.camera.updateViewMatrix();
};

app.handleCollisions = function() {
    var currentObstacle = app.obstaclesMap.currentObstacle();
    app.ship.isMovingUp = false;
    for (var i = 0; i < currentObstacle.objects.length; i++) {
        if (app.ship.boundingBox1.collidesWith(currentObstacle.objects[i].boundingBox)) {
            if (currentObstacle.objects[i].boundingBox.rotation != 0) {
                app.ship.isMovingUp = true;
            }
        }
    }
};

app.drawShadows = function() {
    var shader = app.shaders["shadow_shader"];
    shader.setVec3Property("lightPosition", 0, 1000, app.ship.position.z + 2000);
    app.ship.draw(shader);
    app.obstaclesMap.drawObstacles(shader);
};

app.drawScene = function() {
    var shader = app.shaders["default_shader"];
    app.ship.draw(shader);
    app.obstaclesMap.drawObstacles(shader);
    app.plane.draw(app.shaders["plane_shader"]);
};
