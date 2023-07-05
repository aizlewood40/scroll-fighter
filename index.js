const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

// Resolution
canvas.width = 1024;
canvas.height = 576;

// movement globals

const keys = {
    // player 1
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    // player 2
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    }
 }

const gravity = 0.2;
const jumpVelocity = -10;
const walkVelocity = 4;





// Character Object
class CharacterSprite {

    // args:
    // position = { x:0, y:0 }
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, 50, 150);
    }

    update() {
        this.draw();

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }
}

const player1 = new CharacterSprite({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    }
 });

const player2 = new CharacterSprite({
    position: {
        x: 400,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    }
 });

 function keyPressedCharacterVelocityChange(keyboard) {
    // player 1 controls
    if ((keyboard.d.pressed && keyboard.a.pressed) || (!keyboard.d.pressed && !keyboard.a.pressed)) {
        player1.velocity.x = 0;
    } else if(keyboard.a.pressed) {
        player1.velocity.x = -walkVelocity;
    } else if (keyboard.d.pressed) {
        player1.velocity.x = walkVelocity;
    }

    if(keys.w.pressed && player1.velocity.y === 0) {
        player1.velocity.y = jumpVelocity;
    }


    // player 2 controls
    if ((keyboard.ArrowRight.pressed && keyboard.ArrowLeft.pressed) || (!keyboard.ArrowRight.pressed && !keyboard.ArrowLeft.pressed)) {
        player2.velocity.x = 0;
    } else if(keyboard.ArrowLeft.pressed) {
        player2.velocity.x = -walkVelocity;
    } else if (keyboard.ArrowRight.pressed) {
        player2.velocity.x = walkVelocity;
    }

    if(keys.ArrowUp.pressed && player2.velocity.y === 0) {
        player2.velocity.y = jumpVelocity;
    }
 }

// infinite loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();
    
    keyPressedCharacterVelocityChange(keys);

}

animate();


// keyboard event listeners
window.addEventListener('keydown', (event) => {

    switch(event.key) {
        case 'd':
            keys.d.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 'w':
            keys.w.pressed = true;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            break;

    }

    console.log(event.key);

});


window.addEventListener('keyup', (event) => {

    switch(event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;

    }

    console.log(event.key);

});