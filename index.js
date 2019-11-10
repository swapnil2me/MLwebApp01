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
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

function clearArea() {
    for (i = 0, len = ctxA.length, text = ""; i < len; i++) {
      ctx = ctxA[i].getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    document.getElementById('console').innerText =``
    //delete classifier.addExample
}

  function clearAreaTest() {
      ctx = ctxA[3].getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      document.getElementById('console').innerText =``
}

async function addClasses() {

    document.getElementById('console').innerText =`Loading MobileNet...`;
    net = await mobilenet.load();
    document.getElementById('console').innerText =`MobileNet loaded`;
    for (i = 0, len = ctxA.length, text = ""; i < len-1; i++) {
      ctx = ctxA[i];
      const activation = net.infer(ctx,'conv_preds');
      for (var j = 0; j < 3; j++) {
        classifier.addExample(activation, i);
        console.log(j);
      };
    };
    document.getElementById('console').innerText =`Added New classes`
};
async function predictClass() {
    document.getElementById('console').innerText =`Loading MobileNet...`
    net = await mobilenet.load();
    document.getElementById('console').innerText =`MobileNet loaded`;
    img = ctxA[3];
    const activation = net.infer(img, 'conv_preds');
    const result = await classifier.predictClass(activation);
    const classes = ['A','B','C'];
    console.log(result);
    document.getElementById('console').innerText = `
      prediction: ${classes[result.label]}\n
      probability: ${result.confidences[result.label]}
    `;

};
