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
    space: {
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
    },


 }

const gravity = 0.4;
const jumpVelocity = -15;
const walkVelocity = 4;

const punchWidth = 130;





// Character Object
class CharacterSprite {

    // args:
    // position = { x:0, y:0 }
    // velocity = {x:0, y:0}
    // direction = 'l' or 'r'
    constructor({position, velocity, direction}) {
        this.position = position;
        this.velocity = velocity;
        this.direction = direction;
        this.height = 150;
        this.playerWidth = 50;
        this.state = 'idle';
        this.attackPunchBox = {
            position: this.direction === 'r' ? this.position : { x: this.position.x - punchWidth + this.playerWidth, y: this.position.y},
            width: punchWidth,
            height: 50,
        }
        this.health = 100;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.playerWidth, this.height);


        // attack punch box
        c.fillStyle = 'green';
        c.fillRect(this.attackPunchBox.position.x, this.attackPunchBox.position.y, this.attackPunchBox.width, this.attackPunchBox.height);
    }

    update() {
        this.draw();

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        this.attackPunchBox = {
            position: this.direction === 'r' ? this.position : { x: this.position.x - this.attackPunchBox.width + this.playerWidth, y: this.position.y},
            width: punchWidth,
            height: 50,
        }


        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    directionChange(direction) {
        if(direction === 'l' && this.direction === 'r') {
            this.direction = 'l';

        }
        if(direction === 'r' && this.direction === 'l') {
            this.direction = 'r';

        }
    }

    punch() {
        this.state = 'punch';
        setTimeout(() => {
            this.state = 'idle';
        }, 100);
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
    },
    direction: 'r'
 });

const player2 = new CharacterSprite({
    position: {
        x: 400,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    direction: 'l'
 });

 function keyPressedCharacterVelocityChange(keyboard) {
    // player 1 controls
    if ((keyboard.d.pressed && keyboard.a.pressed) || (!keyboard.d.pressed && !keyboard.a.pressed)) {
        player1.velocity.x = 0;
    } else if(keyboard.a.pressed) {
        player1.velocity.x = -walkVelocity;
        player1.directionChange('l');
        console.log(player1.direction);
    } else if (keyboard.d.pressed) {
        player1.velocity.x = walkVelocity;
        player1.directionChange('r');
    }

    if(keys.w.pressed && player1.velocity.y === 0) {
        player1.velocity.y = jumpVelocity;
    }

    // player 2 controls
    if ((keyboard.ArrowRight.pressed && keyboard.ArrowLeft.pressed) || (!keyboard.ArrowRight.pressed && !keyboard.ArrowLeft.pressed)) {
        player2.velocity.x = 0;
    } else if(keyboard.ArrowLeft.pressed) {
        player2.velocity.x = -walkVelocity;
        player2.directionChange('l');
    } else if (keyboard.ArrowRight.pressed) {
        player2.velocity.x = walkVelocity;
        player2.directionChange('r');
    }

    if(keys.ArrowUp.pressed && player2.velocity.y === 0) {
        player2.velocity.y = jumpVelocity;
    }
 }

 function setHealthBar(playerObject, healthBarId, healthReduction) {
    playerObject.health = playerObject.health - healthReduction;
    console.log(document.getElementById(healthBarId));
    document.getElementById(healthBarId).style.width = `${playerObject.health}%`
}

 function detectCollision() {
    if(player1.attackPunchBox.position.x + player1.attackPunchBox.width >= player2.position.x && player1.attackPunchBox.position.x <= player2.position.x + player2.playerWidth && player1.attackPunchBox.position.y + player1.attackPunchBox.height >= player2.position.y && player1.attackPunchBox.position.y <= player2.position.y + player2.height && player1.state === 'punch') {
        player1.state = 'idle';    
        console.log('yeet');
        setHealthBar(player2, "player2AdjustableHealth", 5);
    }
    // }
    if(player2.attackPunchBox.position.x + player2.attackPunchBox.width >= player1.position.x && player2.attackPunchBox.position.x <= player1.position.x + player1.playerWidth && player2.attackPunchBox.position.y + player2.attackPunchBox.height >= player1.position.y && player2.attackPunchBox.position.y <= player1.position.y + player1.height && player2.state === 'punch') {
        player2.state = 'idle';
        console.log('reet');
        setHealthBar(player1, "player1AdjustableHealth", 5);
    }
 }

// infinite loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();
    
    detectCollision();
    keyPressedCharacterVelocityChange(keys);

}

animate();


// keyboard event listeners
window.addEventListener('keydown', (event) => {
    // console.log(event.key);

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
        case ' ':
            player1.punch();
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
        case 'm':
            player2.punch();
            break;

    }

});