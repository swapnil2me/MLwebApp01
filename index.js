const classifier = knnClassifier.create();
let net;
var mousePressed = false;
var lastX, lastY;
var ctxM=[]
var ctxA;

function InitThis() {
    ctxA = document.getElementsByClassName('myCanvas')

    for (i = 0, len = ctxA.length, text = ""; i < len; i++) {
      ctxM[i] = ctxA[i].getContext("2d");
    };

    $('.myCanvas').mousedown(function (e) {
        mousePressed = true;
        //console.log($(this)[0].id);
        Draw(ctxM[$(this)[0].id-1], e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('.myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(ctxM[$(this)[0].id-1],e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('.myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
	    $('.myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(ctx,x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = "5";
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    //ctxA = document.getElementsByClassName('myCanvas')
    for (i = 0, len = ctxA.length, text = ""; i < len; i++) {
      ctx = ctxA[i].getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
}

function clearAreaTest() {
    // Use the identity matrix while clearing the canvas
    //ctxA = document.getElementsByClassName('myCanvas')

      ctx = ctxA[3].getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

}

async function addClasses() {

    // Generate the image data

    console.log('Loading mobilenet..');
    // Load the model.
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    for (i = 0, len = ctxA.length, text = ""; i < len-1; i++) {
      ctx = ctxA[i];
      const activation = net.infer(ctx,'conv_preds');
      classifier.addExample(activation, i);
    };
};
async function predictClass() {
    console.log('Loading mobilenet..');
    // Load the model.
    net = await mobilenet.load();
    console.log('Successfully loaded model');
    img = ctxA[3];
    const activation = net.infer(img, 'conv_preds');
    const result = await classifier.predictClass(activation);
    const classes = ['A','B','C'];
    document.getElementById('console').innerText = `
      prediction: ${classes[result.label]}\n
      probability: ${result.confidences[result.label]}
    `;

};
