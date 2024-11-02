const WORLD_HEIGHT = 22; //In cells
const WORLD_WIDTH = 22;
let CW = 64; //This is for calculating hitboxes but not view

let view_width; //In pixels
let view_height;

let view_center_x; //coordinates of the center of the view n the world
let view_center_y;
let background_scale = 1;

let world = undefined;
let player;
let buttons = [];
let trails = [];

let key_w = false;
let key_a = false;
let key_s = false;
let key_d = false;
let key_f = false;
let key_x = false;
let key_q = false;
let key_p = false;
let key_space = false;
let key_dash = false;
let key_equals = false;
let key_1 = false;
let key_2 = false;
let key_3 = false;
let mouse_x = 0;
let mouse_y = 0;
let real_mouse_x = 0;
let real_mouse_y = 0;
let mouse_angle = 0;
let left_mousedown = false;
let right_mousedown = false;

let background_tiles;
let jet_tiles;

let game_mode;
let debug_mode = false;
let total_pause_time = 0;

let map1 = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 3, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 4, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 7, 14, 8, 1, 1, 1, 1, 7, 14, 8, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 12, 2, 11, 1, 1, 1, 1, 12, 2, 11, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 9, 13, 10, 1, 1, 1, 1, 9, 13, 10, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 7, 14, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 12, 2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 9, 13, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 14, 8, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2, 11, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 13, 10, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 2],
    [2, 5, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 6, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    intersects(circle) {
        return distance(this.x, circle.x, this.y, circle.y) < this.radius + circle.radius;
    }
}

class World {
    constructor(wx, wy) {
        this.width = wx;
        this.height = wy;
        this.d = [];
        for (var y = 0; y < wy; y++) {
            this.d[y] = new Array(wx);
            this.d[y].fill(0);
        }
    }
    get(x, y) {
        if (x >= 0 && x < this.width &&
            y >= 0 && y < this.height) {
                return(this.d[y][x]);

        }   
        return 0;
    }
    set(x, y, tile) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
          }
          this.d[y][x] = tile;
    }
}

class Tile {
    constructor(image, src_x, src_y, src_size_x, src_size_y, size_x, size_y, x_off, y_off) {
        this.image = image;
        this.src_x = src_x;
        this.src_y = src_y;
        this.src_size_x = src_size_x;
        this.src_size_y = src_size_y;
        this.size_x = size_x;
        this.size_y = size_y;
        this.x_off = x_off;
        this.y_off = y_off;
        this.rotation = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
}

class Player {
    constructor(x, y, direction, size, speed, maneuverability, max_speed, min_speed, health) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.size = size;
        this.speed = speed;
        this.maneuverability = maneuverability;
        this.max_speed = max_speed;
        this.min_speed = min_speed;
        this.tile = 0;
        this.health = health;
    } 
    update(now, interval) {
        

        let turn_angle = this.maneuverability / this.speed * interval;

        let diff = Math.abs(this.direction - mouse_angle);
       
        let dir;
        if (this.direction > mouse_angle) {
            if (diff > Math.PI) {
                dir = 1;
            } else {
                dir = -1;
            }
        } else {
            if (diff > Math.PI) {
                dir = -1;
            } else {
                dir = 1;
            }
        }

        if (diff < turn_angle) {
            turn_angle = diff;
        }
        if (this.direction == mouse_angle) {
            turn_angle = 0;
        }

        this.direction += turn_angle * dir;
        if (this.direction > Math.PI * 2) {
            this.direction = 0;
        } else if (this.direction < 0) {
            this.direction = Math.PI * 2;
        }
        
        

        let dx = Math.cos(this.direction) * this.speed * interval;
        let dy = -Math.sin(this.direction) * this.speed * interval; 


        this.x = this.x + dx;
        this.y = this.y + dy;
        
        if (key_w) {
            if (this.speed < this.max_speed) {
                this.speed += interval/20;
            }
        }
        if (key_s) {
            if (this.speed > this.min_speed) {
                this.speed -= interval/20;
            }
        }
        for (let i = 0; i < this.speed * 2; i++) {
            trails.push(new Trail(this.x + (Math.random() / 10 - 0.05) * this.speed/3, this.y + (Math.random() / 10 - 0.05) * this.speed/3, Math.random() * this.speed / 2 + 1, now, Math.random() * 5000));
        }
    }
}

class Jet {

}

class Trail {
    constructor(x, y, size, time_created, timer,) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.time_created = time_created;
        this.timer = timer;
        this.alive = true;
        this.transparency = 1;
    }
    update(now, interval) {
        if(now - this.time_created > this.timer) {
            this.alive = false; 
        }

        this.transparency = 1 - (now - this.time_created) / this.timer;
        if (this.transparency < 0) {
            this.transparency = 0;
        }
    }
}

class Button {
    constructor(x, y, width, height, type, text) {
        //x and y are according to the center of the screen
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.text = text;
        this.enlarge = 0;
        this.alive = true;
    }
    isTouching(x, y) {
        if (x >= view_width/2 + this.x - this.width/2 && x <= view_width/2 + this.x + this.width/2 && y >= view_height/2 + this.y - this.height/2 && y <= view_height/2 + this.y + this.height/2) {
            return true;
        }
        return false;
    }
}

function createMap(world, w, h) {
    let tmh = map1.length;
    let tmw = map1[0].length;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            let r = map1[y % tmh];
            r = r.concat(new Array(tmw).fill(0));
            world.d[y][x] = r[x % tmw];
        }
    }
}

function distance(x1, x2, y1, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function gameSetUp() {
    setUpTiles(); //makes images
    world = new World(WORLD_WIDTH,WORLD_HEIGHT);
    createMap(world, world.width, world.height);

    player = new Player(5, 5, Math.PI/2, 1, 1, 0.5, 10, 1, 1);

    document.body.addEventListener('keydown', keydownHandler);
    document.body.addEventListener('keyup', keyupHandler);
    document.body.addEventListener("mousemove", mousemoveHandler)
    document.body.addEventListener("mousedown", mousedownHandler);
    document.body.addEventListener("mouseup", mouseupHandler);

    changeGameMode(-1);
}

function setUpTiles() {
    let background_images = getImage("background_tiles.png");
    let jet_images = getImage("jet_tiles.png");

    background_tiles = [];
    for (let i = 0; i < 15; i++) {
        background_tiles[i] = new Tile(background_images, i * 64, 0, 64, 64, 64, 64, 0, 0);
    }

    jet_tiles = [];
    for (let i = 0; i < 3; i++) {
        jet_tiles[i] = new Tile(jet_images, i * 39, 0, 39, 64, 39, 64, -39/2, -64/2);
    }
}

function resize() {
    view_width = canvas.width & ~1;
    view_height = canvas.height & ~1;
    //map_editor_view_width = view_width;
    //map_editor_view_height = view_height;
}

function changeVisibility() {
    if (document.hidden && game_mode == 0) {
        //game_mode = 1;
    }
}

function keydownHandler(e) {
    if (e.key == "w") {
        key_w = true;
    } else if (e.key == "a") {
        key_a = true;
    } else if (e.key == "s") {
        key_s = true;
    } else if (e.key == "d") {
        key_d = true;
    } else if (e.key == "f") {
        key_f = true;
    } else if (e.key == "x") {
        key_x = true;
    } else if (e.key == "q") {
        key_q = true;
    } else if (e.key == "p") {
        key_p = true;
    } else if (e.key == " ") {
        key_space = true;
    } else if (e.key == "-") {
        key_dash = true;
    } else if (e.key == "=") {
        key_equals = true;
    } else if (e.key == "1") {
        key_1 = true;
    } else if (e.key == "2") {
        key_2 = true;
    } else if (e.key == "3") {
        key_3 = true;
    } else {
        return true;
    }
    e.preventDefault();
    return false;
}

function keyupHandler(e) {
    if (e.key == "w") {
        key_w = false;
    } else if (e.key == "a") {
        key_a = false;
    } else if (e.key == "s") {
        key_s = false;
    } else if (e.key == "d") {
        key_d = false;
    } else if (e.key == "f") {
        key_f = false;
    } else if (e.key == "x") {
        key_x = false;
    } else if (e.key == "q") {
        key_q = false;
    } else if (e.key == "p") {
        key_p = false;
    } else if (e.key == " ") {
        key_space = false;
    } else if (e.key == "-") {
        key_dash = false;
    } else if (e.key == "=") {
        key_equals = false;
    } else if (e.key == "1") {
        key_1 = false;
    } else if (e.key == "2") {
        key_2 = false;
    } else if (e.key == "3") {
        key_3 = false;
    } else {
        return true;
    }
    e.preventDefault();
    return false;
}

function mousemoveHandler(e) {
    real_mouse_x = e.offsetX;
    real_mouse_y = e.offsetY;
    mouse_x = e.offsetX - view_width/2;
    mouse_y = e.offsetY - view_height/2;
    if (mouse_x == 0) {
        mouse_x = 0.001;
    }
    if (mouse_y == 0) {
        mouse_y = 0.001;
    }
}

function mousedownHandler(e) {
    if (e.button == 0) {
        left_mousedown = true;
    }
    if (e.button == 2) {
        right_mousedown = true;
    }
}

function mouseupHandler(e) {
    if (e.button == 0) {
        left_mousedown = false;
    }
    if (e.button == 2) {
        right_mousedown = false;
    }
}

function calculateAngle(x, y) {
    angle = Math.atan(y / x); 
    if (mouse_x < 0) {
        angle += Math.PI;
    } else if (mouse_y > 0) {
        angle += Math.PI * 2;
    }
    return angle;
}

function worldToScreenX(x) {
    return Math.floor((x - view_center_x)*64 + view_width/2 / background_scale);
}

function worldToScreenY(y) {
    return Math.floor((y - view_center_y)*64 + view_height/2 / background_scale);
}

function drawCrosshair(ctx, tile, x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    ctx.drawImage(tile.image, 
        tile.src_x, tile.src_y, tile.size, tile.size, 
        (x + tile.x_off), (y + tile.y_off), tile.size, tile.size); //changes to pixels
}

function drawTile(ctx, tile, x_coord_in_world, y_coord_in_world, individual_tile_rotation) {
    let x_pos_on_view = worldToScreenX(x_coord_in_world); //Changes from cell coordinates in the world to pixel coordinates on view
    let y_pos_on_view = worldToScreenY(y_coord_in_world);  
    
    ctx.save();
    ctx.translate(x_pos_on_view,y_pos_on_view); 
    ctx.rotate(individual_tile_rotation);
    ctx.scale(tile.scale_x, tile.scale_y);
    ctx.translate(-x_pos_on_view,-y_pos_on_view)
    
    ctx.drawImage(tile.image, 
        tile.src_x, tile.src_y, tile.src_size_x, tile.src_size_y, 
        x_pos_on_view + tile.x_off, y_pos_on_view + tile.y_off, tile.size_x, tile.size_y); //changes to pixels
    ctx.restore();


}

function drawDebug(ctx, now, interval) {
    ctx.fillStyle = "purple";
    ctx.font = "bold 20px serif";

    ctx.textAlign = "left";
    /*
    ctx.fillText(`Direction: ${player.direction}`, 20, 20);
    ctx.fillText(`Mouse XY: ${mouse_x}, ${mouse_y}`, 20, 60);
    ctx.fillText(`Mouse angle: ${mouse_angle}`, 20, 100);
    ctx.fillText(`Cos angle: ${Math.cos(mouse_angle)}`, 20, 130);
    ctx.fillText(`Player XY: ${player.x}, ${player.y}`, 20, 160);
    ctx.fillText(`Player maneuverability: ${player.maneuverability}`, 20, 190);
    ctx.fillText(`Background scale: ${background_scale}`, 20, 220);
    ctx.fillText(`View cell W, H: ${view_width/CW}, ${view_height/CW}`, 20, 280);
    */
    
}

function changeGameMode(mode) {
    game_mode = mode;
    buttons = [];
    if (mode == -1) {
        //x and y are 0,0 bc view_width and view_height are not defined yet
        buttons.push(new Button(0, 0, 200, 100, "start", "START"));
    } else if (mode == 0) {

    } else if (mode == 1) {
        buttons.push(new Button(view_width/2, view_height/2, 200, 200, "resume", "RESUME"));
    }
}

function updateGame(now, interval) {
    let simulation_now = now - total_pause_time;
    if (game_mode == -1) {
        updateGameStart(simulation_now, interval);
    } else if (game_mode == 0) {
        updateGameWorld(simulation_now, interval);
    } else if (game_mode == 1) {
        updateGamePause(simulation_now, interval)
    }

    
}

function updateGameStart(now, interval) {
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].isTouching(real_mouse_x, real_mouse_y)) {
            buttons[i].enlarge = 20;
            if (left_mousedown && buttons[i].type == "start") {
                changeGameMode(0);
                break;
            }
        } else {
            buttons[i].enlarge = 0;
        }    
    }
    
    drawGameStart(now, interval);
}

function updateGameWorld(now, interval) {
    player.update(now, interval);
    mouse_angle = calculateAngle(mouse_x, -mouse_y);
    
    if (key_equals) {
        if (player.maneuverability < 1) {
            player.maneuverability += 0.01;
        }
        key_equals = false;
    }
    if (key_dash) {
        if (player.maneuverability > 0.1) {
            player.maneuverability -= 0.01;
        }
        key_dash = false;
    }
    
    if (key_1) {
        debug_mode = !debug_mode;
        key_1 = false;
    }

    
    
    background_scale = 1/(player.speed + 0.3);

    if (background_scale < 0.4) {
        background_scale = 0.4;
    }

    CW = 64 * background_scale;
    
    view_center_x = player.x + mouse_x/CW*2/3;
    view_center_y = player.y + mouse_y/CW*2/3;

    trails.map(t => t.update(now,interval));

    drawGameWorld(now, interval);
}

function updateGamePause(now, interval) {

}

function drawGameStart(now, interval) {

    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, view_width, view_height);
    for (let i = 0; i < buttons.length; i++) {
        
        ctx.fillStyle = "white";
        let x = view_width/2 + buttons[i].x
        let y = view_height/2 + buttons[i].y
        let width = buttons[i].width + buttons[i].enlarge;
        let height = buttons[i].height + buttons[i].enlarge;
        ctx.fillRect(x - width/2, y - height/2, width, height);
        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.font = "bold 48px serif";
        ctx.fillText(buttons[i].text, x, y);
    }
}

function drawGameWorld(now, interval) {

    let cell_x = Math.floor(view_center_x - view_width/2/ CW); 
    let cell_y = Math.floor(view_center_y - view_height/2/ CW);

    let background_canvas = document.createElement("canvas");
    background_canvas.width = view_width / background_scale;
    background_canvas.height = view_height / background_scale;
    let background_ctx = background_canvas.getContext("2d");

    /*
    for (let y = 0; y < (view_height / CW) + 1; y++) {
        for (let x = 0; x < (view_width / CW) + 1; x++) {
            let t = world.get(x + cell_x, y + cell_y);
            drawTile(background_ctx, background_tiles[t], x + cell_x, y + cell_y, 0); 
            if (debug_mode) {
                background_ctx.strokeStyle = "blue";
                background_ctx.beginPath();
                background_ctx.moveTo(worldToScreenX(x + cell_x), worldToScreenY(y + cell_y));
                background_ctx.lineTo(worldToScreenX(x + cell_x + 1), worldToScreenY(y + cell_y));
                background_ctx.lineTo(worldToScreenX(x + cell_x + 1), worldToScreenY(y + cell_y + 1));
                background_ctx.lineTo(worldToScreenX(x + cell_x), worldToScreenY(y + cell_y + 1));
                background_ctx.lineTo(worldToScreenX(x + cell_x), worldToScreenY(y + cell_y));
                background_ctx.stroke();
            }
        }
    }*/


    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, view_width, view_height);
    ctx.save();
    ctx.translate(view_width/2, view_height/2);
    ctx.scale(background_scale, background_scale);
    ctx.translate(-view_width/2 / background_scale, -view_height/2 / background_scale);


    ctx.drawImage(background_canvas, 0,0);


    for (let i = 0; i < trails.length; i++) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.globalAlpha = trails[i].transparency;
        ctx.beginPath();
        ctx.arc(worldToScreenX(trails[i].x), worldToScreenY(trails[i].y), trails[i].size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
    }

    ctx.beginPath();
    drawTile(ctx, jet_tiles[player.tile], player.x, player.y, -player.direction + Math.PI/2);

    //ctx.arc(worldToScreenX(player.x), worldToScreenY(player.y), player.size * 10, 0, 2 * Math.PI);
    //ctx.moveTo(worldToScreenX(player.x), worldToScreenY(player.y));
    //ctx.lineTo(worldToScreenX(player.x + Math.cos(player.direction) * player.speed), worldToScreenY(player.y - Math.sin(player.direction) * player.speed));
    //ctx.stroke();

    ctx.restore();

    ctx.save();
    ctx.scale(0.1,0.1);

    ctx.drawImage(background_canvas, 60, 600);
    ctx.restore();

    drawDebug(ctx, now, interval);

    updateGameWorldPost(now, interval);
}

function drawGamePause(now, interval) {

}

function updateGameWorldPost(now, interval) {
    trails = trails.filter(x => x.alive == true);
}

startGame({setUp: gameSetUp, resize: resize, updateGame: updateGame, visibilityChange: visibilityChange});