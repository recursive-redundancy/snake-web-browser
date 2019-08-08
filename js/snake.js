"use strict";
window.snakeGame = window.snakeGame || {};

// game module - game logic and game board `drawing functionality
snakeGame.game = snakeGame.game || (function () { 

    // 2D x-y coordinate point (in virtual world units)
    // with built-in scaling to canvas units
    // So whenever the x-y world units are set
    // the object automatically calculates units scaled
    // to the corresponding canvas units, and vice-versa
    var Coord = function(x, y ) {
        // if no x or y point argument supplied, default to left-most and/or top-most world point
        if (x == undefined) { x = gameBoard.world.x1; }
        if (y == undefined) { y = gameBoard.world.y1; }
        // private members
        var _x = x,
            _y = y,
            _scaleX = x * gameBoard.scale.x,
            _scaleY = y * gameBoard.scale.y;
        // public members
        var coord = {
            // x-y coords in world units
            x: {
                get: function() {
                    return _x;
                },
                set: function(value) {
                    _x = value;
                    _scaleX = value * gameBoard.scale.x; // scaled to canvas units
                }
            },
            y: {
                get: function() {
                    return _y;
                },
                set: function(value) {
                    _y = value;
                    _scaleY = value * gameBoard.scale.y; // scaled to canvas units
                }
            },
            // x-y coords scaled to canvas units
            scaleX: { 
                get: function() {
                    return _scaleX;
                },
                set: function(value) {
                    _scaleX = value;
                    _x = value / gameBoard.scale.x; // scaled to canvas units
                }
            },
            scaleY: {
                get: function() {
                    return _scaleY;
                },
                set: function(value) {
                    _scaleY = value;
                    _y = value / gameBoard.scale.y; // scaled to canvas units
                }
            },
            // Re-calculates scaleX & scaleY coords 
            reScaleCoords: function() {
                this.x.set(_x);
                this.y.set(_y);
            }
        };
        return coord; // return instance with public members/methods
    };

    // Helper singleton for Canvas drawing functionality
    var drawUtil = {
        // Clear/erase a rect section of the canvas
        clearRect: function(ctx, x, y, width, height) {
            ctx.clearRect(x, y, width, height);
        },
        // Draws a rect on the gameBoard canvas.
        // fillColor or strokeColor arguments can be passed as null if
        // a fill or stroke is not desired
        // so you can draw an un-filled rect with just a stroke
        // or a filled rect without a stroke.
        // the first agument, ctx, is a reference to a Canvas 2D drawing context
        drawRect: function(ctx, x, y, width, height, fillColor, strokeColor) {
            // fill in rect if a fillColor is supplied
            if (fillColor != null && fillColor != undefined) {
                ctx.beginPath();
                ctx.rect(x, y, width, height); 
                ctx.fillStyle = fillColor;
                ctx.fill();
                ctx.closePath();
            }
            if (strokeColor != null && strokeColor != undefined) {
                ctx.beginPath();
                ctx.rect(x + 1, y + 1, width - 2, height - 2); 
                ctx.strokeStyle = strokeColor;
                ctx.stroke();
                ctx.closePath();
            }
        }
    };

    // Input singleton for mapping inputs to game movements
    // the directional movements are added to a queue so that no input direction will be missed or dropped
    // each input frame, the next move in the queue is processed and executed (if move is valid)
    var input = {
        moveQueue: [], // Queue of directional movements to be applied on each frame update (one move from queue per frame)
        // Lost focus, so pause game
        blur: function() { 
            game.pause();
        },
        // Window resize, so pause and re-scale assets
        resize: function() { 
            game.pause(); // pause the game before re-scaling assets
            _rescaleAssets();
        },
        // keyDown input event
        // Takes an input up, down, left, or right and adds to a queue
        // so that each direction input can be recorded and executed without being missed
        keyDown: function(e) {
            var direction = null;
            // map input key to corresponding movement direction
            switch (e.key) {
                case "ArrowRight":
                    direction = DIRECTION.RIGHT;
                    break;
                case "Right":
                    direction = DIRECTION.RIGHT;
                    break;
                case "d":
                    direction = DIRECTION.RIGHT;
                    break;
                case "ArrowUp":
                    direction = DIRECTION.UP;
                    break;
                case "Up":
                    direction = DIRECTION.UP;
                    break;
                case "w":
                    direction = DIRECTION.UP;
                    break;
                case "ArrowLeft":
                    direction = DIRECTION.LEFT;
                    break;
                case "Left":
                    direction = DIRECTION.LEFT;
                    break;
                case "a":
                    direction = DIRECTION.LEFT;
                    break;
                case "ArrowDown":
                    direction = DIRECTION.DOWN;
                    break;
                case "Down":
                    direction = DIRECTION.DOWN;
                    break;
                case "s":
                    direction = DIRECTION.DOWN;
                    break;
            }
            if (direction != null) { // a controller direction was detected, so queue it
                e.preventDefault(); // prevent default web browser input action
                input.queueDirection(direction);
            }
        },
        // Add direction to moveQueue
        queueDirection: function(direction) {
            if (direction != this.moveQueue[this.moveQueue.length - 1]) { // don't add to queue if direction is same as last queued direction - reduces perceived input lag due to movement redundancy
                this.moveQueue.push(direction);
            }
        },
        // End input, remove input event listeners
        end: function() {
            this.eventsListeners_remove();
        },
        // Add input event listeners
        eventsListeners_add: function() {
            window.addEventListener("keydown", this.keyDown);
            window.addEventListener("resize", this.resize);
            window.addEventListener("blur", this.blur);
        },
        // Remove input event listeners
        eventsListeners_remove: function() {
            window.removeEventListener("keydown", this.keyDown);
            window.removeEventListener("resize", this.keyDown);
            window.removeEventListener("blur", this.blur);
        },
        // Each frame, update snake movement according to next direction in moveQueue
        update: function() {
            if (this.moveQueue.length > 0) { // check if moves exist in queue
                var dir = this.moveQueue.shift(); // Remove next move from queue & store in variable
                if (dir != snake.pieces[0].direction) { // don't move in the same direction snake is already moving
                    // make sure snake does not turn its head upon its own neck (i.e: if snake head is moving up, don't allow it to pivot downward onto itself or if right don't pivot left, etc.)
                    var canPiv = true; // flag signifies whether making a pivot in this direction is valid
                    if (snake.pieces.length > 1) { // if snake has a body, don't let snake turn on its own neck
                        switch (snake.pieces[0].direction) {
                            case DIRECTION.RIGHT:
                                if (dir == DIRECTION.LEFT) { canPiv = false; }
                                break;
                            case DIRECTION.LEFT:
                                if (dir == DIRECTION.RIGHT) { canPiv = false; }
                                break;
                            case DIRECTION.UP:
                                if (dir == DIRECTION.DOWN) { canPiv = false; }
                                break;
                            case DIRECTION.DOWN:
                                if (dir == DIRECTION.UP) { canPiv = false; }
                                break;
                        }
                    }
                } 
                if (canPiv) { // snake will not turn upon it's neck, so it can pivot in this direction
                    snake.pivotHead(dir); // Tell the snake to pivot in the direction & allow rest of body to follow
                }
            }
        },
        // Reset input properties and functionality
        reset: function() {
            this.moveQueue.length = 0; // clear moveQueue
            this.eventsListeners_remove(); // make sure eventListeners cleared before adding
            this.eventsListeners_add(); // add input listeners
        }
    };

    // Game GUI HUD singleton
    // The HUD consists of the web page DOM elements
    var hud = {
        scoreUpdated: false, // flag which signifies DOM score should be updated
        DOM: { // DOM element references
            scoreBoard: null, // element displays current score of game while in play
            finalScore: null,  // element which displays final score of game when ended
            winningScore: null, // elements displays final score of game, when game was completed and won (all game board pieces have been filled with snake pieces)
            // Sets the text of a DOM element with the value supplied
            setElementText: function(element, value) {
                element.innerText = _score; // set text in DOM element
            }
        },
        // Called at end of game
        end: function() {
            this.DOM.setElementText(this.DOM.finalScore, _score); // set final score in DOM element
        },
        // Called at end of game when game has been won
        win: function() {
            this.DOM.setElementText(this.DOM.winningScore, _score); // set final winning score in DOM element
        },
        // reset all HUD components
        reset: function() { 
            // save references to HUD DOM elements
            this.DOM.scoreBoard = document.getElementById('game-scoreboard');
            this.DOM.finalScore = document.getElementById('title-score-final');
            this.DOM.winningScore = document.getElementById('title-score-win');
            this.DOM.setElementText(this.DOM.scoreBoard, 0); // set score display to zero
        },
        // Update HUD components in game loop
        update: function() {
            if (this.scoreUpdated) { // score has changed, so update DOM
                this.DOM.setElementText(this.DOM.scoreBoard, _score);
                this.scoreUpdated = false;
            }
        }
    };

    // gameBoard singleton - the virtual game board upon which the game & drawing takes place
    var gameBoard = {
        // Game virtual world bounds - x2 & y2 are set at runtime based upon game's difficulty settings
        world: { 
            x1: 1,
            y1: 1,
            x2: 0,
            y2: 0
        },
        // Size of a 1x1 unit scaled from world to canvas units
        scale: { 
            x: 0,
            y: 0,
            // Re-calculate scaled size on canvas
            reset: function() {
                this.x = gameBoard.canvas.width / gameBoard.world.x2;
                this.y = gameBoard.canvas.height / gameBoard.world.y2;
            }
        },
        pieceCount: 0, // total number of available gameBoard pieces (gameBoard.world.x2 * gameBoard.world.y2) - lets game know how many pieces must be filled for game to be won
        // gameBoard's state which keeps track of all active pieces on the board (snake pieces, food, empty spaces)
        // allows for fast hit testing and decision making
        boardState: {
            state: [], // 2D matrix representing the gameBoard's state
            // Key to what each element value in the boardState represents
            BOARD_STATE_PIECES: {
                EMPTY: 0,
                FOOD: 1,
                SNAKE_PIECE: 2,
                SNAKE_HEAD: 3
            },
            // Returns board piece at particular gameBoard world unit
            getElement: function(x, y) {
                // decrement x & y values for proper array access since the world units start at one but array zero-indexed
                x--;
                y--;
                // if index is out of bounds return EMPTY as a fallback
                if (x < 0 || x > (gameBoard.boardState.state[0].length - 1) || y < 0 || y > (gameBoard.boardState.state.length -1 )) {
                    return gameBoard.boardState.BOARD_STATE_PIECES.EMPTY;
                }
                return this.state[y][x];  
            },
            // set a new empty 2D matrix state to represent board state
            reset: function() {
                var EMPTY = this.BOARD_STATE_PIECES.EMPTY; // save value of EMPTY boardpiece
                this.state = []; // create the row array
                this.state.length = gameBoard.world.y2;
                for (var i = 0, endI = gameBoard.world.y2; i < endI; i++) // iterate each row
                {
                    this.state[i] = []; // create the columns array within the row
                    this.state[i].length = gameBoard.world.x2;
                    for (var j = 0, endJ = gameBoard.world.x2; j < endJ; j++) { // set each element within the current row & set the element to empty
                        this.state[i][j] = EMPTY;
                    }
                }
            },
            // sets element in gameBoard state 2D matrix to whatever piece is set in arg3
            setElement: function(x, y, piece) {
                // decrement x & y values for proper array access since the world units start at one but array zero-indexed
                x--;
                y--;             
                if (x < 0 || x > (gameBoard.boardState.state[0].length - 1) || y < 0 || y > (gameBoard.boardState.state.length -1 )) { // don't set if index out of bounds
                    return;
                }
                this.state[y][x] = piece;
            }
        },
        // represents the canvas upon which all game drawing takes place
        canvas: { 
            // the page's DOM elements relating to the canvas
            DOM: { 
                canvas: null, // ref to DOM canvas element for drawing the gameBoard and characters
                ctx: null, // ref to canvas drawing context for graphics calls
                // re-find the DOM elements and store references to them
                reset: function() {
                    this.canvas = document.getElementById("canvas-game");
                    this.ctx = this.canvas.getContext("2d");
                }
            },
            // size of canvas in DOM coordinates (pixels)
            // saved each time canvas is reset so don't have to keep getting dimensions from DOM element in page which is slower
            width: 0,
            height: 0,
            // Size the DOM canvas element to a proper size so that it fits into the screen area available
            // but also so that its dimensions divide into whole integer values so that the game pieces
            // will size by integer values and give a clean sizing arrangement
            // this calculation is intended for a gameBoard that is perfectly square, i.e. gameboard width is same as gameboard height
            reset: function() {
                var canHeight = window.innerHeight,
                    canWidth = window.innerWidth;
                
                // Find ratio of screen to world & scale game canvas appropriately
                // Figure out if width > height or height >= width and scale against the greatest size
                var screenWorldRatio;
                if (canWidth > canHeight) { // Width is larger, so limit canvas dimensions by height
                    screenWorldRatio = Math.floor(canHeight / gameBoard.world.y2 * 0.95); // find ratio of canvas height to game world's height, and then scale down a bit to give some "breathing room"
                    canHeight = canWidth = screenWorldRatio * gameBoard.world.y2; // the new size to size the canvas dimensions
                } 
                else { // limit canvas dimensions by width
                    screenWorldRatio = Math.floor(canWidth / gameBoard.world.x2 * 0.95); // find ratio of canvas width to game world's width, and then scale down a bit to give some "breathing room"
                    canWidth = canHeight = screenWorldRatio * gameBoard.world.x2; // the new size to size the canvas dimensions
                }
                // set the height and width of the canvas in the DOM - setting canvas size also clears the canvas drawing which is necessary anyway since this is called during game reset
                this.DOM.canvas.height = this.height = canHeight;
                this.DOM.canvas.width = this.width = canWidth;
                // size the game view to fit the canvas so the scoreboard sits correctly at the bottom
                document.getElementById("view-game").style.height = (canHeight + 2) + "px"; // add 2 extra pixels to account for 1px border on each top and bottom side of canvas
            }
        },
        reset: function() {
            this.pieceCount = gameBoard.world.x2 * gameBoard.world.y2; // calculate available gameBoard pieces
            this.boardState.reset();
            this.canvas.DOM.reset();
            this.canvas.reset();
            this.scale.reset();
        },
        // Properties and methods related to drawing of gameBoard upon canvas
        drawing: {
            // clear the entire canvas area
            clear: function() { 
                drawUtil.clearRect(gameBoard.canvas.DOM.ctx, 0, 0, gameBoard.canvas.width, gameBoard.canvas.height);
            }
        }
    };

    // Food piece singleton
    var food = {
        position: new Coord(),
        size: { // size in world units
            width: 1,
            height: 1
        },
        // Called when snake has hit food and food is therefore collected, score updated, and food re-spawned
        collect: function() { 
            _incrementScore(_pointValue);
            this.spawn();
        },
        // Reset food properties and spawn a new food piece
        reset: function() {
            this.drawing.size.reset(); // reset canvas draw size
            this.spawn(); // spawn a new food piece to start
        },
        // Randomly generate new spawn location for food that does not clash with any other occupied spaces on gameBoard
        spawn: function() { 
            if (snake.pieces.length < gameBoard.pieceCount) { // only attempt to spawn if space available on board
                var boardPiece,
                    x,
                    y;
                var EMPTY = gameBoard.boardState.BOARD_STATE_PIECES.EMPTY; // save value of EMPTY boardpiece
                do { // choose a random coordinate until it doesn't conflict with any part of board that is already occupied
                    x = _random(gameBoard.world.x1, gameBoard.world.x2);
                    y = _random(gameBoard.world.y1, gameBoard.world.y2);
                    boardPiece = gameBoard.boardState.getElement(x, y); // get board piece currently occupying random coords
                } while (boardPiece != EMPTY); // exit loop when random coord is empty on board
                // update food piece's position to new random position
                this.position.x.set(x);
                this.position.y.set(y);
                gameBoard.boardState.setElement(x, y, gameBoard.boardState.BOARD_STATE_PIECES.FOOD); // set food's position on gameBoard state
                this.drawing.draw(); // draw on canvas upon spawning
            }
        },
        // Properties and methods related to drawing of food piece upon canvas
        drawing: {
            fillColor: "rgba(255, 180, 0, 1)",
            strokeColor: "rgba(150, 0, 0, 1)",
            size: {
                // how big the food piece should be drawn on canvas (in pixels)
                width: 0,
                height: 0,
                reset: function() { // reset canvas draw size
                    this.width = gameBoard.scale.x;
                    this.height = gameBoard.scale.y;
                }
            },
            // Draws food on canvas
            draw: function() {
                drawUtil.drawRect(gameBoard.canvas.DOM.ctx, food.position.scaleX.get() - this.size.width, food.position.scaleY.get() - this.size.height, this.size.width, this.size.height, this.fillColor, this.strokeColor);
            }
        }
    };

    // A single pivot point upon which the snake head has turned
    // represents the x-y coord the pivot occured, and the direction upon which it turns
    // The basic building block for tracking and coordinating snake movement path
    var Pivot = function(x, y, direction) {
        if (x == undefined) { x = gameBoard.world.x1; }
        if (y == undefined) { y = gameBoard.world.y1; }
        if (direction == undefined) { direction = null; }
        
        // instance with public members/methods
        var pivot = {
            position: new Coord(x, y),
            direction: direction,
            // Method to set all pivot's properties at once
            set: function(x, y, direction) {
                if (x == undefined) { return; }
                if (y == undefined) { return; }
                if (direction == undefined) { return; }
                this.position.x.set(x);
                this.position.y.set(y);
                this.direction = direction;
            }
        };
        return pivot; // return instance
    };

    // Individual piece of snake body
    var SnakePiece = function() {
        //
        // CONSTRUCTION OF NEW SNAKE PIECE OBJECT
        var _x,
            _y,
            _direction,
            _index,
            _oldTail = null,
            _boardPiece = gameBoard.boardState.BOARD_STATE_PIECES.SNAKE_PIECE;

        // If snake is empty, then create a new head that is still (not moving)
        if (snake.pieces.length == 0) {
            _x = _y = 1; // start in top-left corner of game board
            _direction = null; // no movement
            _index = 0;
            _boardPiece = gameBoard.boardState.BOARD_STATE_PIECES.SNAKE_HEAD;
        } 
        else { 
            // add new piece behind current tail piece, making this the new tail piece
            _oldTail = snake.pieces[snake.pieces.length - 1];
            // get position of previous tail piece
            _x = _oldTail.position.x.get();
            _y = _oldTail.position.y.get();
            _direction = _oldTail.direction;
            _index = snake.pieces.length;
            // decide where to place new tail based upon direction of previous tail
            switch (_oldTail.direction) {
                case DIRECTION.RIGHT:
                    _x--;
                    break;
                case DIRECTION.LEFT:
                    _x++;
                    break;
                case DIRECTION.UP:
                    _y++;
                    break;
                case DIRECTION.DOWN:
                    _y--;
                    break;
                default:
                    _x--;
                    break;
            }
        }

        // check whether this new piece will be placed within the game bounds
        // if not, this piece is invalid and will not be used
        if (_x < gameBoard.world.x1 || _x > gameBoard.world.x2 || _y < gameBoard.world.y1 || _y > gameBoard.world.y2) {
            return null; // position is outside of game bounds, therefore invalid piece and do not add to snake - so return as null (empty object)
        }

        // snakePiece instance with public members/methods
        var snakePiece = {
            position: new Coord(_x, _y),
            direction: _direction,
            pivots: [], // a queue that keeps track of pivots that snake has made so that the subsequent body pieces can turn themselves when this pivot position has been reached
            index: _index, // this piece's index in relation to collection of snake pieces (0 is head, tail is index=snake.pieces.length - 1)
            // push a new pivot onto the pivot queue
            addPivot: function(x, y, direction) {
                this.pivots.push(new Pivot(x, y, direction)); 
            },
            // update snakePiece every frame of game loop
            update: function() {
                this.drawing.clear();
                // check if piece should pivot direction to follow the rest of body's path
                _checkPivot();
                // move piece
                _move();
            },
            // Properties and methods related to drawing of snakePiece upon canvas
            drawing: {
                // clear piece from canvas
                clear: function() {
                    drawUtil.clearRect(gameBoard.canvas.DOM.ctx, snakePiece.position.scaleX.get() - snake.drawing.pieceSize.width, snakePiece.position.scaleY.get() - snake.drawing.pieceSize.height, snake.drawing.pieceSize.width, snake.drawing.pieceSize.height);
                },
                // draw/re-draw piece on canvas
                draw: function() {
                    var fillColor = snake.drawing.fillColor; // default to body piece fill color
                    if (snakePiece.index == 0) { // piece is head, so use head fill color
                        fillColor = snake.drawing.headColor; // use headColor as fill instead
                    }
                    //draw the snakePiece on canvas
                    drawUtil.drawRect(gameBoard.canvas.DOM.ctx, snakePiece.position.scaleX.get() - snake.drawing.pieceSize.width, snakePiece.position.scaleY.get() - snake.drawing.pieceSize.height, snake.drawing.pieceSize.width, snake.drawing.pieceSize.height, fillColor, snake.drawing.strokeColor);
                }
            }
        };

        // CONSTRUCTION CONTINUED HERE
        // PRIVATE METHOD _initPivots IS PART OF CONSTRUCTION

        // This new piece becomes the new tail of snake (or head if only piece)
        // and it must copy all the existing pivots of the old tail so it can continue the snake's pattern
        var _initPivots = function(oldTail) {
            if (oldTail != null) { // this piece isn't the head, so copy pivot queue of previous tail piece
                var piv = null;
                for (var i = 0, endI = oldTail.pivots.length; i < endI; i++) { // iterate every pivot in queue of oldTail
                    piv = oldTail.pivots[i];
                    snakePiece.addPivot(piv.position.x.get(), piv.position.y.get(), piv.direction); // copy pivot from queue
                }  
            }
        };
        _initPivots(_oldTail); // copy previous tail's pivot queue
        gameBoard.boardState.setElement(_x, _y, _boardPiece); // set this new piece's position in boardState
        snakePiece.drawing.draw(); // draw on initial creation
        //
        // END CONSTRUCTION
        //

        // Check if piece's current position is same as next pivot in queue's position, and if so then pivot the piece (change its direction) and remove current pivot from queue
        var _checkPivot = function() {
            if (snakePiece.pivots.length > 0) { // check if any pivots in queue
                var piv = snakePiece.pivots[0]; // test only the first pivot in the queue since piece must reach this pivot before the subsequent pivots
                if (snakePiece.position.x.get() == piv.position.x.get() && snakePiece.position.y.get() == piv.position.y.get()) { // piece is at same x-y location as pivot in queue, so piece must now pivot
                    snakePiece.direction = piv.direction;// pivot the piece (change direction)
                    snakePiece.pivots.shift(); // remove pivot from queue
                }
            }
        };

        // Move the piece's position in accordance with its current direction and do collision hit testing
        var _move = function () {
            var SNAKE_PIECE = gameBoard.boardState.BOARD_STATE_PIECES.SNAKE_PIECE; // store value of SNAKE_PIECE board piece
            var SNAKE_HEAD = gameBoard.boardState.BOARD_STATE_PIECES.SNAKE_HEAD; // store value of SNAKE_HEAD board piece
            var boardPiece = SNAKE_PIECE; // the current piece (this snakePiece instance) - default to SNAKE_PIECE
            if (snakePiece.index == 0) { boardPiece = SNAKE_HEAD; } // this piece is the head - so set boardPiece to SNAKE_HEAD

            if (snakePiece.direction != null) { // only moves if piece has a direction set - null means standing still
                // store current coords - these coords will be moved/updated if necessary
                var x = snakePiece.position.x.get(),
                    y = snakePiece.position.y.get();
                // keep current coords that will be unchanged
                var oldX = x,
                    oldY = y;
                switch (snakePiece.direction) { // find where new location will be
                    case DIRECTION.RIGHT:
                        x += 1;
                        break;
                    case DIRECTION.LEFT:
                        x -= 1;
                        break;
                    case DIRECTION.DOWN:
                        y += 1;
                        break;
                    case DIRECTION.UP:
                        y -= 1;
                        break;
                }
                // check for gameBoard border collisions
                if (x < gameBoard.world.x1 || x > gameBoard.world.x2 || y < gameBoard.world.y1 || y > gameBoard.world.y2) { // collided with gameBoard border - game over
                    _endBegin(); // begin end of game
                }
                else { // no boundary collisions
                    var oldPiece = gameBoard.boardState.getElement(x, y); // find what piece is currently on board in this position
                    // check for collision with snake pieces
                    if (oldPiece == SNAKE_PIECE || oldPiece == SNAKE_HEAD) { // collided with another snake piece - game over
                        _endBegin(); // begin end of game
                    }
                    else { // game is still in play, so update piece's coord position
                        if (oldPiece == gameBoard.boardState.BOARD_STATE_PIECES.FOOD) { // collided with food piece - set flag to notify snake food needs to be collected
                            snake.doCollectFood = true;
                        }
                        // update this piece's position to new coords
                        snakePiece.position.x.set(x);
                        snakePiece.position.y.set(y);
                        gameBoard.boardState.setElement(oldX, oldY, gameBoard.boardState.BOARD_STATE_PIECES.EMPTY); // clear old position from gameBoard state
                        gameBoard.boardState.setElement(x, y, boardPiece); // update gameBoard state with new piece position
                    }
                }
            }
            snakePiece.drawing.draw(); // re-draw piece on canvas
        }

        return snakePiece; // return instantiated snakePiece object
    };

    // Snake character singleton
    var snake = {
        didPivot: false, // flag signifying snake pivoted (changed direction)
        doCollectFood: false, // flag signifies snake head has contacted food, and food should be collected
        growRate: 3, // # of pieces to grow snake by with each food collection
        growCount: 0, // current number of pieces snake grows on each food collection - one new piece added each update
        lastPivot: new Pivot(), // last pivot (change in direction) that snake head made
        pieces: [], // array of snakePiece objects which make up the snake character
        // instantiates a new SnakePiece object and adds to snake.pieces if a valid piece could be created
        addPiece: function() {
            var newPiece = new SnakePiece();
            if (newPiece.drawing != undefined) { // check if drawing object exists on snakePiece, if undefined means object returned as null and snakePiece was invalid so don't add to snake.pieces
                this.pieces.push(newPiece);
            }
            else { newPiece = null } // de-reference newPiece if empty Object
        },
        // Called when snake growth is queued - calls the addPiece method if growth is queued
        grow: function() {
            if (this.growCount > 0) { // check for growth queued
                this.addPiece(); // grow (add) a new snake piece 
                this.growCount--;
            }
        },
        // Adds growth to grow queue (growCount)
        queueGrowth: function() { // food has been collected, so new growth must be queued up
            this.growCount += this.growRate; // increment growCount by growRate
        },
        // Called by input controller upon movement
        // turns head's direction and allows for subsequent body pieces to follow this movement
        pivotHead: function(direction) {
            if (this.pieces.length > 0) { // only pivot if snake has body pieces
            this.pieces[0].direction = direction; // set head's direction to new pivot direction
            // save coord's of head's pivot location
            var headX = this.pieces[0].position.x.get();
            var headY = this.pieces[0].position.y.get();
            // save this pivot so update method can utilize it and add the pivot to the rest of the snake's body piece's pivotQueues
            this.didPivot = true; // set flag to alert update method that a pivot was made
            this.lastPivot.set(headX, headY, direction); // save the properties of the pivot
            }
        },
        // Reset snake for new game
        reset: function() {
            this.pieces.length = 0; // clear all snake pieces
            this.didPivot = false; // clear pivot flag
            this.doCollectFood = false; // clear food collect flag
            this.drawing.pieceSize.reset(); // re-calculate scaled drawing size for canvas draws
            this.addPiece(); // create a single snake piece - the head
            this.growCount = 0; // start with no body growth
        },
        // Update snake on every game loop call
        update: function() {
            if (snake.pieces[0].direction != null) // check if snake is moving since it doesn't need to update anything if it's at rest
            {
                // Iterate all snake pieces - add lastPivot to each piece's pivot queue if one was made, and call piece's update method
                for (var i = 0, endI = this.pieces.length; i < endI; i++) {
                    // if a pivot was made, add it to piece's pivot queue
                    if (this.didPivot) {
                        this.pieces[i].addPivot(this.lastPivot.position.x.get(), this.lastPivot.position.y.get(), this.lastPivot.direction);
                    }
                    this.pieces[i].update();
                } 
                if (!game.isEnding) { // continue update only if snake hasn't collided and flag has not been set to end game
                    this.didPivot = false; // reset didPivot flag
                    // grow a new piece if growth queued
                    this.grow();
                    // check if flag set for food collection (snake head contacted food), and if so collect it
                    if (this.doCollectFood) {
                        this.doCollectFood = false;
                        food.collect();
                        snake.queueGrowth(); // queue snake body growth
                    }
                }
        }
        },
        // Properties & methods involving drawing snake on canvas
        drawing: {
            fillColor: "rgba(45, 220, 80, 1)", // color to fill body pieces with
            headColor: "rgba(10, 150, 30, 1)", // color to fill head piece with
            strokeColor: "rgba(0, 0, 0, 1)", // color to stroke pieces with
            // How big the snake piece should be drawn on canvas (in pixels)
            pieceSize: {
                width: gameBoard.scale.x,
                height: gameBoard.scale.y,
                // Reset draw size on canvas
                reset: function() {
                    this.width = gameBoard.scale.x;
                    this.height = gameBoard.scale.y;
                }
            },
        }
    };

    // Instance of game publically accessible on window.snakeGame.game
    var game = {
        // Constant describing difficulty setting values
        DIFFICULTY: {
            EASY: 0,
            MEDIUM: 1,
            HARD: 2
        },
        isEnding: false, // flag indicates that game is in process of ending and to finish up any additional procedures such as growing remaining snake pieces before ending game completely
        isPlaying: false, // flag indicates if game is in play (false) or game over (true)
        isPaused: false, // flag indicates if game is in paused state (true) or not (false)
        // Returns current difficulty setting
        getDifficulty: function() {
            if (_difficulty == undefined || _difficulty == null) { // no difficulty has been set in memory
                var diff = null;
                if (localStorage) { // check if localStorage supported by browser
                    diff = parseInt(localStorage.getItem("difficulty")); // try to get difficulty stored in localStorage
                }
                if (diff == null || isNaN(diff)) { // default to medium difficulty if no proper difficulty is set
                    diff = this.DIFFICULTY.MEDIUM;
                } 
                return diff;
            }
            else return _difficulty;
        },
        // Initiate game pause
        pause: function() {
            if (this.isPlaying) { // only pause if game is in play
                this.isPaused = true; // set pause flag
                _interval_clear(); // stop game loop
                input.eventsListeners_remove(); // stop input listeners
                snakeGame.main.views.game.pause.load(); // load pause view
            }
        },
        // Exit pause and resume game
        unPause: function() {
            if (this.isPlaying) { // only pause/unpause when game is in play
                this.isPaused = false; // unset pause flag
                _interval_set(); // start game loop
                input.eventsListeners_add(); // add (start) input listeners
                snakeGame.main.views.game.pause.unload(); // unload pause view
            }
        },
        // Sets the current game difficulty setting
        // Each time called it also sets the game parameters such as
        // timer rate  (how fast game moves e.g: rate frames are updates - in milliseconds),
        // rate at which snake grows when food is collected,
        // and how large the game word is sized
        // note: game world must be a 1x1 relationship e.g x2 must equal y2, a perfect square board
        setDifficulty: function(value) {
            switch (value) {
                case this.DIFFICULTY.EASY:
                    _difficulty = value;
                    _timerRate = 120;
                    snake.growRate = 5;
                    // gameboard size is 25x25
                    gameBoard.world.y2 = 25;
                    gameBoard.world.x2 = 25;
                    break;
                case this.DIFFICULTY.MEDIUM:
                    _difficulty = value;
                    _timerRate = 90;
                    snake.growRate = 4;
                    // gameboard size is 30x30
                    gameBoard.world.y2 = 30;
                    gameBoard.world.x2 = 30;
                    break;
                case this.DIFFICULTY.HARD:
                    _difficulty = value;
                    _timerRate = 60;
                    snake.growRate = 3;
                    // gameboard size is 35x35
                    gameBoard.world.y2 = 35;
                    gameBoard.world.x2 = 35;
                    break;
            }
            // Save current difficulty level in localStorage
            if (localStorage) {
                localStorage.setItem("difficulty", _difficulty);
            }
        },
        // Start a new game
        start: function() {
            _reset(); // Reset everything before starting new game play
            _interval_set(); // Start the game loop
        }
    }

    // Constants to describe directions of movement
    var DIRECTION = {
        RIGHT: 0,
        UP: 1,
        LEFT: 2,
        DOWN: 3
    };

    var _timer = null, // reference to game loop timer called by setInterval
        _timerRate = 0, // how often (in milliseconds) game loop is called
        _score = 0, // Current game score
        _pointValue = 1, // value of each food collection
        _difficulty = game.getDifficulty(); // difficulty setting
        
    // End current game
    var _end = function() {
        game.isPlaying = false; // set flag indicating game is not in play
        _interval_clear(); // turn off game loop
        input.end();
        if (_isBoardComplete()) { // game winner - all pieces filled, win game over
            hud.win();
            snakeGame.main.winGame();
        }
        else { // normal game over
            hud.end();
            snakeGame.main.endGame();
        }
        gameBoard.drawing.clear(); // clear entire gameBoard
    };

    // Called when snake has collided with itself or game bounds
    // sets flag to let update method know to end game once current update call has completed
    // any other pre-emptive ending procedures can be included here as well
    var _endBegin = function() {
        game.isEnding = true; // set flag to notify update method it is time to end game
    };

    // checks if all gameBoard pieces filled by snake pieces
    var _isBoardComplete = function() {
            if (snake.pieces.length == gameBoard.pieceCount) { return true; } // board is filled & therefore complete
            return false;   // board not complete
    }

    // Updates value of game score and sets flag to notify HUD to update DOM score display
    var _incrementScore = function(value) {
        hud.scoreUpdated = true; // set flag indicating score has changed since last HUD update
        _score += value;
    };

    // Stop the game loop
    var _interval_clear = function() {
        if (_timer != null) {
            window.clearInterval(_timer); // stop the game loop
        }
    };

    // Start the game loop
    var _interval_set = function() {
        _interval_clear(); // clear interval if one is set
        _timer = window.setInterval(_update, _timerRate); // Start the game loop
    }

    // Generate a random integer in range [min - max]
    var _random = function(min, max) {
        if (min >= max) { return min; }// range error - default to min value as failsafe
        return Math.floor(min + Math.random() * max);
    };

    // Re-scales everything to fit a new window size
    // used when the window has been resized and game must be resized to fit properly
    var _rescaleAssets = function() {
        // re-calculate sizing
        gameBoard.canvas.reset(); // re-size canvas
        gameBoard.scale.reset(); // re-calculate scaling units
        food.drawing.size.reset(); // re-calculate food canvas drawing size
        snake.drawing.pieceSize.reset(); // re-size snake pieces canvas drawing size
        gameBoard.drawing.clear(); // clear game canvas
        food.position.reScaleCoords(); // re-scale food piece's coords
        food.drawing.draw(); // re-draw food
        // re-scale & re-draw snake pieces
        for (var i = 0, endI = snake.pieces.length; i < endI; i++) {
            snake.pieces[i].position.reScaleCoords();
            snake.pieces[i].drawing.draw();
        }
    }

    // set value of game score to a specific value and notify HUD to update DOM score display
    var _setScore = function(value) {
        hud.scoreUpdated = true;
        _score = value;
    }

    // Reset/re-initialize all objects and properties for a new game
    var _reset =  function() {
        game.isEnding = false;
        game.isPlaying = true;
        game.isPaused = false;
        _setScore(0);
        hud.reset();
        input.reset();
        gameBoard.reset();
        snake.reset();
        food.reset();
    };

    // Main logical call within game loop - updates all game elements in accordance with game logic and calls all drawing procedures
    var _update = function() {
        input.update();
        snake.update();
        hud.update();
        if (game.isEnding) { // flag to end game has been set, so after last frame updated, end the game
            _end(); 
        } 
    };

    return game; // return public members/methods
})();

// main module - view/UI logic
snakeGame.main = snakeGame.main || (function () {
    // Map Game object's difficulty keys to DOM radio values
    var DIFF_RADIOS = {};
    DIFF_RADIOS[snakeGame.game.DIFFICULTY.EASY] = "easy";
    DIFF_RADIOS[snakeGame.game.DIFFICULTY.MEDIUM] = "medium";
    DIFF_RADIOS[snakeGame.game.DIFFICULTY.HARD] = "hard";
    
    var _difficulty; // difficulty setting
                
    $(document).ready(function() {
        main.views.title.load(); // on document ready load title screen view

        // Difficulty radio buttons events
        $('input[type=radio][name=difficulty]').on('click', function() {
            switch (this.value) {
                case DIFF_RADIOS[snakeGame.game.DIFFICULTY.EASY]:
                    _difficulty = snakeGame.game.DIFFICULTY.EASY;
                    break;
                case DIFF_RADIOS[snakeGame.game.DIFFICULTY.MEDIUM]:
                    _difficulty = snakeGame.game.DIFFICULTY.MEDIUM;
                    break;
                case DIFF_RADIOS[snakeGame.game.DIFFICULTY.HARD]:
                    _difficulty = snakeGame.game.DIFFICULTY.HARD;
                    break;
            }
        });

        // Start Game & Pause Game events
        $('#btn-play').on('click', function()  { // start game on play button pressed
            main.startGame();
        });
        $(document).on('keyup', function(e) { // start game on enter key
            if (e.which == 13 && !snakeGame.game.isPlaying) { // enter key pressed, start game if isn't playing already
                main.startGame();
            }
            else if (e.which == 32 && snakeGame.game.isPlaying) { // space bar pressed - pause if game is in play
                if (snakeGame.game.isPaused) {
                    snakeGame.game.unPause(); 
                }
                else {
                    snakeGame.game.pause(); 
                }
            }
            else if (e.which == 27) {// escape key pressed
                if (!snakeGame.game.isPlaying) {
                    main.views.tutorial.unload();
                }
            }
        });

        // tutorial pop-up events
        $('#btn-tutorial-close').on('click', function()  { // unload tutorial view when close button clicked
            main.views.tutorial.unload();
        });
        
        $('#how-to-link').on('click', function()  { // load tutorial view when tutorial link clicked
            main.views.tutorial.load();
        });
    });

    // Main module public members & methods
    var main = {
        // Game has ended - called from snakeGame.game module
        endGame: function() {
            main.views.game.unload();
            main.views.title.gameOver.load();
            main.views.title.load();
        },
        // Game has ended and was won - called from snakeGame.game module
        winGame: function() {
            main.views.game.unload();
            main.views.title.gameWin.load();
            main.views.title.load();
        },
        // Start a new game
        startGame: function() {
            snakeGame.game.setDifficulty(_difficulty); // set game difficulty to current setting selected from radio buttons
            main.views.title.gameOver.unload();
            main.views.title.gameWin.unload();
            main.views.tutorial.unload();
            main.views.title.unload();
            snakeGame.game.start();
            main.views.game.load();
        },
        // UI views
        views: {
            // game play view
            game: {
                load: function() {
                    $('#view-game').show();
                },
                unload: function() {
                    $('#view-game').hide();
                },
                // pause overlay - display over the game view
                pause: {
                    load: function() {
                        $('#view-pause').show();
                    },
                    unload: function() {
                        $('#view-pause').hide();
                    }
                }
            },
            title: {
                load: function() {
                    _difficulty = snakeGame.game.getDifficulty(); // get difficulty setting
                    // select difficulty radio button corresponding to difficulty
                    var diffValue = DIFF_RADIOS[_difficulty];
                    $("input[type=radio][name=difficulty][value=" + diffValue + "]").attr('checked', 'checked');
                    $('#view-title').show();
                },
                unload: function() {
                    $('#view-title').hide();
                },
                // game over view, displayed within title view - shows final score of game
                gameOver: {
                    load: function() {
                        $('#view-gameover').show();
                    },
                    unload: function() {
                        $('#view-gameover').hide();
                    }
                },
                // game win view, displayed within title view - shows final score of a winning game
                gameWin: {
                    load: function() {
                        $('#view-gamewin').show();
                    },
                    unload: function() {
                        $('#view-gamewin').hide();
                    }
                },
            },
            // tutorial pop-up - displayed on top of the title view
            tutorial: {
                load: function() {
                    if ($('#view-tutorial').css('display') != 'none') { // if tutorial already loaded, unload it
                        this.unload();
                    } else { // load tutorial
                        $('#view-tutorial').show();
                    }
                },
                unload: function() {
                    $('#view-tutorial').hide();
                }
            }
        }
    };
    return main;
})();